import {
  AnimationClip,
  BufferAttribute,
  Mesh,
  MeshStandardMaterial,
  Object3D,
} from "three";

import { AccessorJSON, EntityJSON } from "../../scene";

export type SceneMap = {
  accessors: Map<string, AccessorJSON>;
  animations: Map<string, AnimationClip>;
  attributes: Map<string, BufferAttribute>;
  colliders: Map<string, Mesh>;
  entities: Map<string, EntityJSON>;
  images: Map<string, ImageBitmap>;
  materials: Map<string, MeshStandardMaterial>;
  objects: Map<string, Object3D>;
};