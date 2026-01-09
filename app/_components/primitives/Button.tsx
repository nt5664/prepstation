export enum ButtonType {
  Primary = "primary",
  Secondary = "secondary",
}

export enum ButtonMode {
  Submit = "submit",
  Reset = "reset",
}

export default function Button({
  type = ButtonType.Primary,
  mode = ButtonMode.Submit,
  className,
  disabled,
  onClick,
  children,
}: Readonly<{
  type?: ButtonType;
  mode?: ButtonMode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}>) {
  return (
    <button
      type={mode}
      className={`px-2 py-1 border-2 rounded-sm cursor-pointer disabled:cursor-not-allowed ${className} ${getColors(
        type
      )}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function getColors(type: ButtonType): string {
  switch (type) {
    case ButtonType.Secondary:
      return "border-teal-500 text-teal-500 hover:border-teal-400 hover:text-teal-400 active:border-teal-600 active:text-teal-600 disabled:border-teal-700 disabled:text-teal-700";
    case ButtonType.Primary:
    default:
      return "border-teal-700 bg-teal-700 hover:border-teal-600 hover:bg-teal-600 active:border-teal-800 active:bg-teal-800 disabled:border-teal-800 disabled:bg-teal-800 disabled:text-gray-500";
  }
}
