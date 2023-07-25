import { editNode } from "@/src/play/actions/editNode";

import { useTreeArrayValue } from "../../hooks/useTreeArrayValue";
import { useTreeValue } from "../../hooks/useTreeValue";
import NumberInput from "./NumberInput";

interface Props {
  id: bigint;
}

export default function Scale({ id }: Props) {
  const name = useTreeValue(id, "name");
  const locked = useTreeValue(id, "locked");
  const rawX = useTreeArrayValue(id, "scale", 0);
  const rawY = useTreeArrayValue(id, "scale", 1);
  const rawZ = useTreeArrayValue(id, "scale", 2);

  if (!name || rawX === undefined || rawY === undefined || rawZ === undefined) {
    return null;
  }

  const x = round(rawX);
  const y = round(rawY);
  const z = round(rawZ);

  return (
    <div className="flex items-center space-x-1">
      <div className="w-20 shrink-0 font-bold text-neutral-400">Scale</div>

      <NumberInput
        value={x}
        label="X"
        placeholder="X"
        disabled={locked}
        onChange={(e) => {
          editNode({
            scale: [Number(e.target.value), y, z],
            target: name,
          });
        }}
      />
      <NumberInput
        value={y}
        label="Y"
        placeholder="Y"
        disabled={locked}
        onChange={(e) => {
          editNode({
            scale: [x, Number(e.target.value), z],
            target: name,
          });
        }}
      />
      <NumberInput
        value={z}
        label="Z"
        placeholder="Z"
        disabled={locked}
        onChange={(e) => {
          editNode({
            scale: [x, y, Number(e.target.value)],
            target: name,
          });
        }}
      />
    </div>
  );
}

const PRECISION = 1000;

function round(num: number) {
  return Math.round(num * PRECISION) / PRECISION;
}
