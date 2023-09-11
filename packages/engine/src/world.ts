import { Engine } from "houseki/core";
import { World } from "thyseus";

import { enginePlugin } from "./plugin";

export let world: World;

export async function resetWorld() {
  world = await Engine.createWorld().addPlugin(enginePlugin).build();
  return world;
}