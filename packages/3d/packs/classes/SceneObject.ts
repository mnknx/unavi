import { MutableRefObject } from "react";
import { Triplet } from "@react-three/cannon";
import { Object3D } from "three";
import { nanoid } from "nanoid";

import { ASSET_NAMES } from "..";

//each SceneObject represents an object within the scene
export class SceneObject {
  id: string;
  type: ASSET_NAMES;
  name: string;

  ref: MutableRefObject<Object3D> | null;

  position: Triplet;
  rotation: Triplet;
  scale: Triplet;

  color: string;
  opacity: number;

  constructor(
    type: ASSET_NAMES,
    name?: string,
    position: Triplet = [0, 0, 0],
    rotation: Triplet = [0, 0, 0],
    scale: Triplet = [1, 1, 1],
    color: string = "#ffffff",
    opacity: number = 1
  ) {
    this.id = nanoid();
    this.type = type;
    this.name = name ?? type;

    this.ref = null;

    this.position = position;
    this.rotation = rotation;
    this.scale = scale;

    this.color = color;
    this.opacity = opacity;
  }

  save() {
    if (!this.ref) return;

    this.position = this.ref.current.position.toArray();
    this.rotation = this.ref.current.rotation.toArray().slice(0, 3) as Triplet;
    this.scale = this.ref.current.scale.toArray();
  }

  load() {
    if (!this.ref) return;

    this.ref.current.position.fromArray(this.position);
    this.ref.current.rotation.fromArray(this.rotation);
    this.ref.current.scale.fromArray(this.scale);
  }

  clone() {
    return new SceneObject(
      this.type,
      this.name,
      this.position,
      this.rotation,
      this.scale,
      this.color,
      this.opacity
    );
  }
}
