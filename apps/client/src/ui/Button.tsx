type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className, disabled, children, ...rest }: Props) {
  return (
    <button
      disabled={disabled}
      className={`rounded-full bg-neutral-900 px-6 py-1.5 font-bold text-white transition ${
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:opacity-90 hover:shadow active:opacity-80"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
