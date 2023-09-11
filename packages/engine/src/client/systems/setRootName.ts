import { Name, Scene, SceneStruct } from "houseki/scene";
import { Entity, Query, Res } from "thyseus";

import { useClientStore } from "../clientStore";

export function setRootName(
  sceneStruct: Res<SceneStruct>,
  scenes: Query<[Entity, Scene]>,
  names: Query<[Entity, Name]>
) {
  for (const [entity, scene] of scenes) {
    if (sceneStruct.activeScene !== entity.id) continue;

    for (const [entity, name] of names) {
      if (scene.rootId !== entity.id) continue;

      useClientStore.setState({ rootName: name.value });
    }
  }
}