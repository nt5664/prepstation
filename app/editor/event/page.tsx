import EventEditorForm from "@/app/_components/EventEditorForm";
import FormHint from "@/app/_components/forms/FormHint";
import { getEventData } from "@/app/_lib/data/event-service";

export const metadata = {
  title: "Event editor",
};

export default async function EventEditorPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ ename: string | undefined }>;
}>) {
  const { ename: editName } = await searchParams;
  const eventToEdit = editName
    ? await getEventData(editName as string)
    : undefined;

  return (
    <div>
      <h2 className="text-center tracking-wider mt-6 mb-4 text-2xl font-medium">
        {eventToEdit ? "Edit event" : "Create new event"}
      </h2>

      <div className="grid grid-cols-2 w-3/5 justify-self-center">
        <EventEditorForm eventToEdit={eventToEdit} />

        <FormHint>
          <FormHint.Field name="Event name">
            short name of the event, used for the slug and identifying it,
            therefore must consist of alphanumeric letters and dashes (e.g.
            <FormHint.Highlight className="text-emerald-600">
              /events/exampleEvent-01
            </FormHint.Highlight>
            )
          </FormHint.Field>

          <FormHint.Field name="Display title">
            full name of the event, displayed on the event&apos;s and the
            individual schedules&apos; pages
          </FormHint.Field>

          <FormHint.Field name="Description">
            additional information about the event.{" "}
            <FormHint.Highlight className="font-semibold">
              This field is optional
            </FormHint.Highlight>
          </FormHint.Field>

          <FormHint.Field name="Editors">
            users, who have the ability to edit this event.{" "}
            <FormHint.Highlight className="font-semibold">
              Adding editors is optional
            </FormHint.Highlight>
          </FormHint.Field>
        </FormHint>
      </div>
    </div>
  );
}
