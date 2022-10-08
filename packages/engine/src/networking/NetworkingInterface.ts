import {
  GetPublicationDocument,
  GetPublicationQuery,
  GetPublicationQueryVariables,
  Publication,
} from "@wired-labs/lens";
import { createClient } from "urql";

import { MainScene } from "../main/MainScene";
import { RenderThread } from "../render/RenderThread";
import { Entity, GLTFMesh } from "../scene";
import { Triplet } from "../types";
import { LENS_API } from "./constants";
import { FromHostMessage, ToHostMessage } from "./types";

const DEFAULT_HOST = "wss://host.thewired.space";
const PUBLISH_HZ = 10;

/*
 * Acts as an interface for all networking functionality.
 * Handles joining spaces, sending and receiving messages, etc.
 */
export class NetworkingInterface {
  #scene: MainScene;
  #renderThread: RenderThread;

  #ws: WebSocket | null = null;
  #lensClient = createClient({ url: LENS_API });
  #spaceEntityId: string | null = null;
  #broadcastInterval: NodeJS.Timeout | null = null;
  #hostServer: string | null = null;
  #reconnectCount = 0;

  #playerPositionBuffer: Float32Array | null = null;

  constructor({
    scene,
    renderThread,
  }: {
    scene: MainScene;
    renderThread: RenderThread;
  }) {
    this.#scene = scene;
    this.#renderThread = renderThread;
  }

  async joinSpace(spaceId: string) {
    this.#reconnectCount = 0;

    // Fetch space publication from lens
    const { data } = await this.#lensClient
      .query<GetPublicationQuery, GetPublicationQueryVariables>(
        GetPublicationDocument,
        {
          request: { publicationId: spaceId },
        }
      )
      .toPromise();

    const publication = data?.publication as Publication | undefined;
    if (!publication) throw new Error("Space not found");

    const modelURL: string | undefined =
      publication?.metadata.media[1]?.original.url;
    if (!modelURL) throw new Error("Space model not found");

    // Create glTF entity from model URL
    const entity = new Entity();
    this.#spaceEntityId = entity.id;

    const mesh = new GLTFMesh();
    mesh.uri = modelURL;
    entity.mesh = mesh;

    // Add to scene
    this.#scene.addEntity(entity);

    // Get host server
    const spaceHost = null; // TODO: get from metadata

    const host =
      process.env.NODE_ENV === "development"
        ? "ws://localhost:4000"
        : spaceHost
        ? `wss://${spaceHost}`
        : DEFAULT_HOST;

    this.#hostServer = host;

    // Connect to host server
    this.connectToHost(spaceId);
  }

  connectToHost(spaceId: string) {
    if (!this.#hostServer) throw new Error("No host server set");

    // Create WebSocket connection to host server
    const ws = new WebSocket(this.#hostServer);
    this.#ws = ws;

    function send(message: ToHostMessage) {
      ws.send(JSON.stringify(message));
    }

    ws.onopen = () => {
      console.info("✅ Connected to host");
      this.#reconnectCount = 0;

      // Join space
      send({ subject: "join", data: { spaceId } });

      // Start broadcasting position
      this.#broadcastInterval = setInterval(() => {
        if (!this.#playerPositionBuffer) return;

        const position: Triplet = [
          this.#playerPositionBuffer[0] ?? 0,
          this.#playerPositionBuffer[1] ?? 0,
          this.#playerPositionBuffer[2] ?? 0,
        ];

        send({
          subject: "location",
          data: [position[0], position[1], position[2], 0, 0, 0, 1],
        });
      }, 1000 / PUBLISH_HZ);
    };

    ws.onmessage = (event: MessageEvent<string>) => {
      const { subject, data }: FromHostMessage = JSON.parse(event.data);

      switch (subject) {
        case "player_joined": {
          console.info(`👋 Player ${data} joined`);
          this.#renderThread.postMessage({ subject: "player_joined", data });
          break;
        }

        case "player_left": {
          console.info(`👋 Player ${data} left`);
          this.#renderThread.postMessage({ subject: "player_left", data });
          break;
        }

        case "player_location": {
          this.#renderThread.postMessage({
            subject: "set_player_location",
            data,
          });
          break;
        }
      }
    };

    ws.onclose = async () => {
      console.info("❌ Disconnected from host");

      if (this.#broadcastInterval) clearInterval(this.#broadcastInterval);

      if (!this.#hostServer || this.#reconnectCount > 0) return;

      // Try reconnect
      while (this.#reconnectCount < 10) {
        const count = ++this.#reconnectCount;

        // Wait a little longer each attempt
        const timeout = Math.min(1000 * count);
        await new Promise((resolve) => setTimeout(resolve, timeout));

        // Test if has been reconnected
        if (this.#ws?.readyState === WebSocket.OPEN) return;

        // Close preview WebSocket connection
        if (this.#ws) this.#ws.close();
        this.#ws = null;

        console.info(`🔄 (${count}) Attempting reconnect to host...`);
        this.connectToHost(spaceId);
      }

      console.error("🪦 Failed to reconnect to host. Giving up.");
      this.disconnect();
    };
  }

  disconnect() {
    // Close WebSocket connection
    if (this.#ws) this.#ws.close();
    this.#ws = null;

    this.#reconnectCount = 0;
    this.#hostServer = null;
    if (this.#broadcastInterval) clearInterval(this.#broadcastInterval);
  }

  leaveSpace() {
    this.disconnect();

    // Remove space entity from scene
    if (this.#spaceEntityId) {
      this.#scene.removeEntity(this.#spaceEntityId);
      this.#spaceEntityId = null;
    }
  }

  setPlayerPositionBuffer(position: Float32Array) {
    this.#playerPositionBuffer = position;
  }
}