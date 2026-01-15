export default function SvgIcon({
  path,
  viewBox,
  className,
  width = 24,
  height = 24,
}: Readonly<{
  path: string;
  viewBox: string;
  className?: string;
  width?: number;
  height?: number;
}>) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={height}
    >
      <path d={path} />
    </svg>
  );
}
