"use client";

export default function EventEditorForm() {
  return (
    <form className="mx-4 my-4">
      <div className="my-4">
        <label htmlFor="eventName">Event name</label>
        <input
          id="eventName"
          name="eventName"
          placeholder="exampleEvent-01"
          className="w-full px-1 py-0.5 border-2 rounded-sm border-emerald-800 focus:border-emerald-500 focus:outline-0"
        />
      </div>

      <div className="my-4">
        <label htmlFor="eventTitle">Display title</label>
        <input
          id="eventTitle"
          name="eventTitle"
          placeholder="Example Event 01"
          className="w-full px-1 py-0.5 border-2 rounded-sm border-emerald-800 focus:border-emerald-500 focus:outline-0"
        />
      </div>

      <div className="my-4">
        <label htmlFor="eventDescription">Description</label>
        <textarea
          id="eventDescription"
          name="eventDescription"
          className="w-full px-1 py-0.5 border-2 rounded-sm border-emerald-800 focus:border-emerald-500 focus:outline-0"
        />
      </div>
    </form>
  );
}
