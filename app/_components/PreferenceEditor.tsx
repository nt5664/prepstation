"use client";

import { Cog6ToothIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import Modal from "@/app/_components/Modal";
import ComboBox from "@/app/_components/primitives/ComboBox";
import { SemaphoreStyle, TimeFormat } from "@/app/_types/Prefs";
import {
  setTimeFormat as setTimeFormatCookie,
  setSemaphoreStyle as setSemaphoreStyleCookie,
} from "@/app/_lib/pref-actions";
import {
  getPreferredTimeFormat,
  getPreferredSemaphoreStyle,
} from "@/app/_lib/pref-client";

export default function PreferenceEditor() {
  const [timeFormat, setTimeFormat] = useState(getPreferredTimeFormat());
  const [semaphoreStyle, setSemaphoreStyle] = useState(
    getPreferredSemaphoreStyle(),
  );

  async function handleUpdateTimeFormat(newFormat: TimeFormat) {
    await setTimeFormatCookie(newFormat);
    setTimeFormat(newFormat);
  }

  async function handleUpdateSemaphoreStyle(newStyle: SemaphoreStyle) {
    await setSemaphoreStyleCookie(newStyle);
    setSemaphoreStyle(newStyle);
  }

  return (
    <Modal>
      <Modal.Toggle className="hover:text-teal-300" title="Set preferences">
        <Cog6ToothIcon height={16} />
      </Modal.Toggle>

      <Modal.Window title="Set preferences">
        <div className="flex flex-col p-1 text-sm">
          <PreferenceRow name="Time format">
            <ComboBox<TimeFormat>
              className="text-sm text-right"
              items={[
                { value: "24h", display: "24h" },
                { value: "12h", display: "12h" },
              ]}
              value={timeFormat}
              onChange={handleUpdateTimeFormat}
            />
          </PreferenceRow>

          <PreferenceRow name="Semaphore style">
            <ComboBox<SemaphoreStyle>
              className="text-sm text-right"
              items={[
                { value: "animated", display: "Default (animated)" },
                { value: "fixed", display: "Fixed" },
                { value: "off", display: "Off" },
              ]}
              value={semaphoreStyle}
              onChange={handleUpdateSemaphoreStyle}
            />
          </PreferenceRow>
        </div>
      </Modal.Window>
    </Modal>
  );
}

function PreferenceRow({
  name,
  children,
}: Readonly<{ name: string; children: React.ReactNode }>) {
  return (
    <div className="flex justify-between">
      <p className="self-center">{name}:</p>
      {children}
    </div>
  );
}
