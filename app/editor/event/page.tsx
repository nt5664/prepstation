import EventEditorForm from "@/app/_components/EventEditorForm";

export default function Page() {
  return (
    <div>
      <h2 className="text-center mt-6 mb-4 text-xl font-medium italic">
        Create new event
      </h2>
      <div className="grid grid-cols-2 w-3/4 justify-self-center">
        <EventEditorForm />
      </div>
    </div>
  );
}
