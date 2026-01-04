export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ eventName: string }>;
}>) {
  const { eventName } = await params;
  return <div>event {eventName}</div>;
}
