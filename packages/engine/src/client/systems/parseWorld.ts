import { World as WorldSchema } from "@wired-protocol/types";
import { Asset, Warehouse } from "houseki/core";
import { Gltf } from "houseki/gltf";
import { Commands, Entity, Mut, Query, Res, Without, World } from "thyseus";

import { EngineSchedules } from "../../constants";
import { WorldJson } from "../components";

const decoder = new TextDecoder();

export async function parseWorld(
  world: World,
  commands: Commands,
  warehouse: Res<Warehouse>,
  worlds: Query<[Entity, Asset, Mut<WorldJson>], Without<Gltf>>
) {
  for (const [entity, asset, json] of worlds) {
    const buffer = asset.data.read(warehouse);
    if (!buffer || buffer.byteLength === 0) continue;

    const text = decoder.decode(buffer);
    const parsed = WorldSchema.fromJsonString(text);

    // Load model
    const gltf = new Gltf(parsed.model);
    commands.getById(entity.id).add(gltf);

    // Connect to host
    json.host = parsed.host ?? "";

    // @ts-expect-error
    json.serialize();

    await world.runSchedule(EngineSchedules.ConnectToHost);
  }
}