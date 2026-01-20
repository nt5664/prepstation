import FormHint from "@/app/_components/forms/FormHint";
import TableEditorForm from "@/app/_components/TableEditorForm";
import { getServerSession } from "@/app/_lib/auth";
import { getEventData } from "@/app/_lib/data/event-service";
import { getTableSummary } from "@/app/_lib/data/table-service";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Table editor",
};

export default async function TableEditorPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ eventName: string }>;
  searchParams: Promise<{ sname: string | undefined }>;
}>) {
  const [{ eventName }, { sname: editName }, session] = await Promise.all([
    params,
    searchParams,
    getServerSession(),
  ]);

  if (!session) return notFound();

  const event = await getEventData(eventName);
  if (!event) return notFound();

  const { id: eventId, title, editors } = event;
  if (!editors.map((x) => x.id).includes(session!.user.internalId))
    return notFound();

  const tableToEdit = editName
    ? await getTableSummary(editName as string, eventId)
    : undefined;

  return (
    <div>
      <h2 className="text-center tracking-wider mt-6 mb-4 text-2xl font-medium">
        {`${tableToEdit ? `Edit` : "Create new"} table in `}
        <em>{title}</em>
      </h2>

      <div className="grid grid-cols-2 w-3/5 justify-self-center">
        <TableEditorForm eventName={eventName} tableToEdit={tableToEdit} />

        <FormHint>
          <FormHint.Field name="Table stub">
            short name of the table, used for identifying it, therefore its
            value must contain only alphanumeric letters and dashes (e.g.{" "}
            <FormHint.Highlight className="text-emerald-600">
              /events/exampleEvent-01/exampleTable
            </FormHint.Highlight>
            )
          </FormHint.Field>

          <FormHint.Field name="Display title">
            full name of the table, is displayed at the top of the schedule page
          </FormHint.Field>

          <FormHint.Field name="Start date">
            the date and time of when this schedule starts
          </FormHint.Field>

          <FormHint.Field name="Transition length">
            the time in minutes of how much time is needed between the entries
          </FormHint.Field>

          <FormHint.Field name="Channel name">
            the channel of the organizer/streamer where the event is going to be
            broadcasted.{" "}
            <FormHint.Highlight className="font-semibold">
              Currently, only Twitch channel names are supported (but it may
              change upon request). This field is optional
            </FormHint.Highlight>
          </FormHint.Field>

          <FormHint.Field name="Website">
            website of the event/organizer.{" "}
            <FormHint.Highlight className="font-semibold">
              This field is optional
            </FormHint.Highlight>
          </FormHint.Field>

          <FormHint.Field name="Extra columns">
            if additional data is necessary (for commentary, etc.), up to 5
            extra columns can be created. By specifying a secret, the column
            will be hidden by default, unless the same secret is present on the
            URL with the{" "}
            <FormHint.Highlight className="font-semibold">
              secrets
            </FormHint.Highlight>{" "}
            key. (e.g.{" "}
            <FormHint.Highlight className="text-emerald-600">
              /events/exampleEvent-01/exampleTable?secrets=supersecret
            </FormHint.Highlight>{" "}
            or{" "}
            <FormHint.Highlight className="text-emerald-600">
              /events/exampleEvent-01/exampleTable?secrets=supersecret&secrets=secret2
            </FormHint.Highlight>{" "}
            and so on for multiple sectrets)
          </FormHint.Field>
        </FormHint>
      </div>
    </div>
  );
}
