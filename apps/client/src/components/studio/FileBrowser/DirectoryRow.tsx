import { useEffect, useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import { VscFolder, VscFolderOpened } from "react-icons/vsc";

import { readDirectoryContents } from "../../../helpers/studio/filesystem";
import { useStudioStore } from "../../../helpers/studio/store";

interface Props {
  handle: FileSystemDirectoryHandle;
}

export default function DirectoryRow({ handle }: Props) {
  const [open, setOpen] = useState(false);
  const [childrenDirectories, setChildrenDirectories] = useState<
    FileSystemDirectoryHandle[]
  >([]);

  const selectedDirectory = useStudioStore((state) => state.selectedDirectory);

  useEffect(() => {
    async function readEntries() {
      if (!handle) return;

      const { directories } = await readDirectoryContents(handle);

      const directoryDiff = directories
        .filter((x) => !childrenDirectories.includes(x))
        .concat(childrenDirectories.filter((x) => !directories.includes(x)));

      if (directoryDiff.length > 0) setChildrenDirectories(directories);
    }

    readEntries();

    const interval = setInterval(readEntries, 2000);

    return () => clearInterval(interval);
  }, [childrenDirectories, handle]);

  function handleClick() {
    useStudioStore.setState({ selectedDirectory: handle });
  }

  const hasChildren = childrenDirectories.length > 0;
  const isSelected = selectedDirectory === handle;
  const selectedClass = isSelected
    ? "bg-surfaceVariant"
    : "hover:bg-surfaceVariant";

  return (
    <div>
      <button
        onClick={handleClick}
        className={`cursor-default text-bold flex items-center
                    rounded-md w-full px-2 space-x-2 ${selectedClass}`}
      >
        <div className="w-4">
          {hasChildren && (
            <div
              onClick={() => setOpen((prev) => !prev)}
              className="cursor-default text-outline hover:text-inherit transition flex items-center"
            >
              {open ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
            </div>
          )}
        </div>

        <div>{open ? <VscFolderOpened /> : <VscFolder />}</div>

        <div>{handle.name}</div>
      </button>

      {open && (
        <div className="pl-4 pt-1 space-y-1">
          {childrenDirectories.map((directory) => (
            <DirectoryRow key={directory.name} handle={directory} />
          ))}
        </div>
      )}
    </div>
  );
}
