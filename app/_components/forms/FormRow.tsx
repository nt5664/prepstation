export default function FormRow({
  id,
  label,
  errorMessage,
  headerComponent,
  children,
}: Readonly<{
  id?: string;
  label: string;
  errorMessage?: string;
  headerComponent?: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <div className="my-2">
      <div className="flex justify-between items-end">
        {id ? (
          <label htmlFor={id} className="font-semibold">
            {label}
          </label>
        ) : (
          <p className="font-semibold">{label}</p>
        )}

        {headerComponent}
      </div>
      {children}
      {errorMessage && (
        <span className="text-rose-400 text-sm">{errorMessage}</span>
      )}
    </div>
  );
}
