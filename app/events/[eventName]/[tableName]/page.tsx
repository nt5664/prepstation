export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ eventName: string; tableName: string }>;
}>) {
  const { eventName, tableName } = await params;
  return (
    <>
      <div>
        {eventName} and {tableName}
      </div>
    </>
  );
}
