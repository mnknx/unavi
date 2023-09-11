import { HousekiSchedules } from "houseki/core";
import { csmPlugin } from "houseki/csm";
import { gltfPlugin } from "houseki/gltf";
import { physicsPlugin } from "houseki/physics";
import { playerPlugin } from "houseki/player";
import { postprocessingPlugin } from "houseki/postprocessing";
import { textPlugin } from "houseki/text";
import { getTransformPlugin } from "houseki/transform";
import { defaultPlugin } from "houseki/utils";
import { vrmPlugin } from "houseki/vrm";
import { run, WorldBuilder } from "thyseus";

import { EngineSchedules } from "../constants";
import { calcPlayerVelocity } from "./systems/calcPlayerVelocity";
import { connectToHost } from "./systems/connectToHost";
import { exportLoadingInfo } from "./systems/exportLoadingInfo";
import { initApp } from "./systems/initApp";
import { joinWorld } from "./systems/joinWorld";
import { lerpTransforms } from "./systems/lerpTransforms";
import { movePlayers } from "./systems/movePlayers";
import { parseWorld } from "./systems/parseWorld";
import { publishLocation } from "./systems/publishLocation";
import { saveExport } from "./systems/saveExport";
import { sendEvents } from "./systems/sendEvents";
import { setLocationUpdateTime } from "./systems/setLocationUpdateTime";
import { setPlayersAirTime } from "./systems/setPlayersAirTime";
import { setPlayersAvatar } from "./systems/setPlayersAvatars";
import { setRootName } from "./systems/setRootName";
import { setSkybox } from "./systems/setSkybox";
import { setUserAvatar } from "./systems/setUserAvatar";
import { spawnPlayers } from "./systems/spawnPlayers";

export function clientPlugin(builder: WorldBuilder) {
  builder
    .addPlugin(defaultPlugin)
    .addPlugin(csmPlugin)
    .addPlugin(gltfPlugin)
    .addPlugin(physicsPlugin)
    .addPlugin(playerPlugin)
    .addPlugin(postprocessingPlugin)
    .addPlugin(getTransformPlugin({ playerControls: true }))
    .addPlugin(textPlugin)
    .addPlugin(vrmPlugin)
    .addSystemsToSchedule(HousekiSchedules.Startup, initApp)
    .addSystemsToSchedule(HousekiSchedules.PreUpdate, sendEvents)
    .addSystemsToSchedule(HousekiSchedules.PostFixedUpdate, publishLocation)
    .addSystemsToSchedule(EngineSchedules.ConnectToHost, connectToHost)
    .addSystems(
      exportLoadingInfo,
      joinWorld,
      movePlayers,
      parseWorld,
      saveExport,
      setPlayersAirTime,
      setPlayersAvatar,
      setRootName,
      setSkybox,
      setUserAvatar,
      spawnPlayers,
      ...run.chain(setLocationUpdateTime, lerpTransforms, [
        calcPlayerVelocity,
        movePlayers,
      ])
    );
}