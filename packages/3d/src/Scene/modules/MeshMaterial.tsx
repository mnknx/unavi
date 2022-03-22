import { useContext, useEffect, useRef, useState } from "react";
import {
  MeshPhysicalMaterial,
  MeshToonMaterial,
  Texture as ThreeTexture,
  TextureLoader,
} from "three";
import { fileToDataUrl } from "../helpers";
import { SceneContext } from "../SceneContext";

import { Material } from "../types";

const loader = new TextureLoader();

export const defaultMaterial: Material = {
  type: "physical",
  color: "#ffffff",
  emissive: "#000000",
  sheenColor: "#000000",
  opacity: 1,
  metalness: 0,
  roughness: 0.5,
  reflectivity: 0.5,
  clearcoat: 0,
  sheen: 0,
  texture: undefined,
  flatShading: false,
};

interface Props {
  material: Material;
}

export function MeshMaterial({ material }: Props) {
  const physicalRef = useRef<MeshPhysicalMaterial>();
  const toonRef = useRef<MeshToonMaterial>();

  const { assets } = useContext(SceneContext);
  const [texture, setTexture] = useState<ThreeTexture>();

  const isToon = material?.type === "toon";

  useEffect(() => {
    if (!material?.texture) {
      setTexture(undefined);
      return;
    }

    const file = assets[material.texture];

    if (!file) {
      setTexture(undefined);
      return;
    }

    fileToDataUrl(file).then((res) => {
      loader.loadAsync(res).then(setTexture);
    });
  }, [assets, material]);

  useEffect(() => {
    if (isToon) {
      if (toonRef.current) toonRef.current.needsUpdate = true;
    } else {
      if (physicalRef.current) physicalRef.current.needsUpdate = true;
    }
  }, [texture]);

  useEffect(() => {
    if (physicalRef.current) physicalRef.current.needsUpdate = true;
  }, [material?.flatShading]);

  if (!material) return null;

  if (isToon) {
    return (
      <meshToonMaterial
        ref={toonRef}
        map={texture}
        color={material.color}
        emissive={material.emissive}
        opacity={material.opacity}
        transparent={material.opacity < 1}
      />
    );
  }

  return (
    <meshPhysicalMaterial
      ref={physicalRef}
      map={texture}
      color={material.color}
      emissive={material.emissive}
      opacity={material.opacity}
      transmission={Math.abs(1 - material.opacity)}
      reflectivity={material.reflectivity}
      metalness={material.metalness}
      roughness={material.roughness}
      clearcoat={material.clearcoat}
      sheen={material.sheen}
      sheenColor={material.sheenColor}
      transparent={material.opacity < 1}
      flatShading={material.flatShading}
    />
  );
}
