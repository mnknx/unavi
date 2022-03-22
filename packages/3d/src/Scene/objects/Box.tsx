import { Triplet, useBox } from "@react-three/cannon";

import { defaultMaterial, MeshMaterial } from "../modules/MeshMaterial";
import { Properties } from "../types";

export type IBox = Pick<
  Properties,
  "position" | "rotation" | "scale" | "material"
>;

export const boxDefaultProperties: IBox = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
  material: defaultMaterial,
};

export function Box({ properties = boxDefaultProperties }) {
  const args: Triplet = properties.scale;

  const [ref] = useBox(() => ({
    args,
    position: properties.position,
    rotation: properties.rotation,
    type: "Static",
  }));

  return (
    <mesh ref={ref}>
      <boxBufferGeometry args={args} />
      <MeshMaterial material={properties.material} />
    </mesh>
  );
}
