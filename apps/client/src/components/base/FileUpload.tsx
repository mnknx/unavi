import { ChangeEvent, useState } from "react";

interface Props {
  title?: string;
  accept?: string;
  color?: "Surface" | "SurfaceVariant";
  inputRef?: React.MutableRefObject<HTMLInputElement>;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

export default function FileUpload({
  title,
  accept,
  color = "Surface",
  inputRef,
  onChange,
  ...rest
}: Props) {
  const [file, setFile] = useState<File>();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (onChange) onChange(e);

    const file = e.target.files?.[0];
    if (file) setFile(file);
  }

  const colorClass =
    color === "Surface" ? "bg-surface text-onSurface" : "bg-surfaceVariant";

  return (
    <div className="flex flex-col space-y-1">
      <label
        htmlFor={title}
        className={`group block cursor-pointer rounded-md transition
                    hover:bg-opacity-60 active:bg-opacity-40 ${colorClass}`}
      >
        <div className="flex items-center">
          <div className="px-3 py-2 rounded-l-lg">Choose File</div>
          <div className="px-3 py-2">{file ? file.name : "No file chosen"}</div>
        </div>
      </label>

      <div>
        <input
          ref={inputRef}
          id={title}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
          {...rest}
        />
      </div>
    </div>
  );
}
