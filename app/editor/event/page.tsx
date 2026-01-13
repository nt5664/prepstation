import EventEditorForm from "@/app/_components/EventEditorForm";

export default function EventEditorPage() {
  return (
    <div>
      <h2 className="text-center tracking-wider mt-6 mb-4 text-2xl font-medium">
        Create new event
      </h2>
      <div className="grid grid-cols-2 w-3/4 justify-self-center">
        <EventEditorForm />

        <div className="flex flex-col text-sm space-y-6 bg-gray-800 border-2 rounded-md leading-4 border-cyan-900 mx-2 my-4 px-3 py-2">
          <p>
            <strong className="text-base text-gray-300">Event name: </strong>
            short name of the event, used for the slug and identifying it,
            therefore must consist of alphanumeric letters and dashes (e.g. the
            event will be via{" "}
            <em className="text-emerald-600">/events/exampleEvent-01</em>)
          </p>
          <p>
            <strong className="text-base text-gray-300">Display title: </strong>
            full name of the event, displayed on the event&apos;s and the
            individual schedules&apos; pages
          </p>
          <p>
            <strong className="text-base text-gray-300">Description: </strong>
            additional information about the event.{" "}
            <em className="text-emerald-500 font-semibold">
              This field is optional
            </em>
          </p>
          <p>
            <strong className="text-base text-gray-300">Editors: </strong>users,
            who have the ability to edit this event.{" "}
            <em className="text-emerald-500 font-semibold">
              Adding editors is optional
            </em>
          </p>
        </div>
      </div>
    </div>
  );
}
