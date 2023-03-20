import { Node } from "@gltf-transform/core";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { getNewProjectAssetUpload } from "../../../../app/api/projects/[id]/assets/helper";
import FileInput from "../../../ui/FileInput";
import { useAvatar } from "../../hooks/useExtension";
import { useSubscribe } from "../../hooks/useSubscribe";
import { cdnURL, pathAsset } from "../../utils/s3Paths";
import ComponentMenu from "./ComponentMenu";

interface Props {
  node: Node;
}

export default function AvatarComponent({ node }: Props) {
  const params = useSearchParams();
  const id = params?.get("id");

  const avatar = useAvatar(node);
  const uri = useSubscribe(avatar, "URI");

  const [loading, setLoading] = useState(false);

  if (uri === undefined) return null;

  const fileName = avatar ? avatar.getName() : undefined;
  const uriName = uri ? `File ${uri.split("/").pop()?.substring(0, 6)}` : undefined;

  return (
    <ComponentMenu
      title="Avatar"
      onRemove={() => {
        avatar?.dispose();
      }}
    >
      <FileInput
        displayName={fileName || uriName}
        placeholder="Upload VRM File"
        accept=".vrm"
        disabled={loading}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!avatar || !id || !file || loading) return;

          avatar.setName(file.name);
          setLoading(true);

          try {
            const { url, assetId } = await getNewProjectAssetUpload(id);

            const res = await fetch(url, {
              method: "PUT",
              body: file,
              headers: {
                "Content-Type": file.type,
                "x-amz-acl": "public-read",
              },
            });

            if (!res.ok) return;

            avatar.setURI(cdnURL(pathAsset(assetId)));
          } catch (e) {
            console.error(e);
            avatar.setName("");
          }

          setLoading(false);
        }}
      />
    </ComponentMenu>
  );
}
