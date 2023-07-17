import { ButtonHTMLAttributes, forwardRef } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  rounded?: "full" | "small";
  cursor?: "pointer" | "default";
}

const IconButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      selected,
      disabled,
      rounded = "small",
      cursor = "default",
      children,
      ...rest
    },
    ref
  ) => {
    const selectedClass = selected
      ? "bg-neutral-200 hover:bg-neutral-300"
      : "hover:bg-neutral-200";
    const roundedClass = rounded === "full" ? "rounded-full" : "rounded-lg";
    const cursorClass =
      cursor === "pointer" ? "cursor-pointer" : "cursor-default";

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`flex aspect-square h-full items-center justify-center text-2xl transition ${cursorClass} ${roundedClass} ${
          disabled ? "cursor-default" : "active:opacity-80" && selectedClass
        }`}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
