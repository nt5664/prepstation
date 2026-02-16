import PreferenceEditor from "@/app/_components/PreferenceEditor";

export default function Footer() {
  return (
    <footer className="mt-auto h-12 px-2 py-1.5 border-t-3 border-teal-800 bg-gray-800">
      <div className="flex flex-col">
        <div className="flex gap-2">
          <p className="text-sm">&copy; 2026 PrepStation.</p>
          <PreferenceEditor />
        </div>

        <div className="text-center text-xs font-semibold">
          This app only uses essential cookies required for logins and saving
          user preferences.
        </div>
      </div>
    </footer>
  );
}
