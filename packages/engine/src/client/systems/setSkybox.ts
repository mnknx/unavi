import { Asset } from "houseki/core";
import { Image, Skybox } from "houseki/scene";
import { Entity, Mut, Query } from "thyseus";

import { useClientStore } from "../clientStore";

export function setSkybox(
  skyboxes: Query<Skybox>,
  images: Query<[Entity, Mut<Asset>, Mut<Image>]>
) {
  for (const skybox of skyboxes) {
    for (const [entity, asset, image] of images) {
      if (skybox.imageId !== entity.id) continue;

      const skyboxUri = useClientStore.getState().skybox;
      if (asset.uri === skyboxUri) continue;

      asset.uri = skyboxUri;
      image.flipY = true;

      const fileExt = asset.uri.split(".").pop();

      switch (fileExt) {
        case "jpg":
        case "jpeg": {
          asset.mimeType = "image/jpeg";
          break;
        }

        default: {
          asset.mimeType = "";
          break;
        }
      }
    }
  }
}