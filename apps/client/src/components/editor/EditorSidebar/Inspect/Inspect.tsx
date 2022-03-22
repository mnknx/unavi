import { useStore } from "../../helpers/store";

import Transform from "./modules/Transform";
import Geometry from "./modules/Geometry";
import Material from "./modules/Material";

export default function Inspect() {
  const selected = useStore((state) => state.selected);
  const instance = useStore((state) => state.scene.instances[selected?.id]);

  if (!instance) return null;

  return (
    <div className="space-y-6">
      <div className="text-2xl flex items-center justify-center h-9">
        {instance.type}
      </div>

      <div className="space-y-4">
        <Transform />
        <Geometry />
        <Material />
      </div>
    </div>
  );
}
