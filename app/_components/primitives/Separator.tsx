export default function Separator({
  width,
  height,
}: Readonly<{ width: number; height: number }>) {
  return (
    <div
      className="rounded-sm bg-gray-600"
      style={{ width, height }}
      aria-hidden="true"
    ></div>
  );
}
