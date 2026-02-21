"use client";

import { FlagIcon } from "@heroicons/react/24/outline";
import Modal, { useCloseModalWindow } from "@/app/_components/Modal";
import EventReportForm from "@/app/_components/EventReportForm";

export default function EventReportButton({
  eventId,
}: Readonly<{ eventId: string }>) {
  return (
    <Modal mode="center-screen">
      <Modal.Toggle
        className="text-amber-500 hover:text-amber-400"
        title="Report event"
      >
        <FlagIcon height={24} />
      </Modal.Toggle>

      <Modal.Window title="Report event">
        <ReportWindowContent eventId={eventId} />
      </Modal.Window>
    </Modal>
  );
}

function ReportWindowContent({ eventId }: Readonly<{ eventId: string }>) {
  const closeModal = useCloseModalWindow();
  return (
    <div className="p-2 w-100 bg-gray-700">
      <EventReportForm eventId={eventId} onSubmitted={closeModal} />
    </div>
  );
}
