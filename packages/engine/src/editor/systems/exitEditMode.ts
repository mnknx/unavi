import { InputStruct } from "houseki/input";
import { PhysicsConfig } from "houseki/physics";
import { TransformControls } from "houseki/transform";
import { Commands, Entity, Mut, Query, Res, With } from "thyseus";

import { ENABLE_POINTER_LOCK } from "../../constants";

export function exitEditMode(
  commands: Commands,
  inputStruct: Res<Mut<InputStruct>>,
  physicsConfig: Res<Mut<PhysicsConfig>>,
  controls: Query<Entity, With<TransformControls>>
) {
  for (const entity of controls) {
    commands.getById(entity.id).remove(TransformControls);
  }

  physicsConfig.debug = false;
  inputStruct.enablePointerLock = ENABLE_POINTER_LOCK;
}
