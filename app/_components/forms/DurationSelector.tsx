"use client";

import clsx from "clsx";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function DurationSelector({
  value,
  maxValue = 0,
  title,
  hasError = false,
  onChange,
  onBlur,
}: Readonly<{
  value: number;
  maxValue?: number;
  title?: string;
  hasError?: boolean;
  onChange: (val: number) => void;
  onBlur?: () => void;
}>) {
  const [error, setError] = useState<string | null>(null);

  const hours = Math.trunc(value / 60);
  const mins = value - hours * 60;

  function handleChange(newValue: number) {
    const tooHigh = maxValue > 0 && newValue > maxValue;
    if (tooHigh) {
      const h = Math.trunc(maxValue / 60);
      const m = maxValue - h * 60;
      setError(`The max duration is ${h}h ${m}m.`);
      return;
    }

    if (newValue <= 0) {
      setError("The duration must be at least 1 minute long.");
      return;
    }

    setError(null);
    onChange(newValue);
  }

  function onSetHours(newHours: number) {
    if (Number.isNaN(newHours)) {
      setError("Invalid hours.");
      return;
    }

    handleChange(newHours * 60 + mins);
  }

  function onSetMinutes(newMins: number) {
    if (Number.isNaN(newMins)) {
      setError("Invalid minutes.");
      return;
    }

    handleChange(hours * 60 + newMins);
  }

  const inputClassName = twMerge(
    clsx(
      "w-13 px-1 py-0.5 border-2 rounded-sm font-medium placeholder-gray-400 text-gray-300 bg-gray-700",
      hasError ? "border-rose-400" : "border-cyan-700",
      "focus:border-cyan-500 focus:text-cyan-300 focus:outline-0 placeholder:font-normal placeholder:italic",
    ),
  );

  return (
    <div className="min-w-0 max-w-36">
      <div className="flex justify-between gap-2">
        <div>
          <input
            className={inputClassName}
            type="number"
            inputMode="numeric"
            min={0}
            max={23}
            value={hours}
            title={title}
            onChange={(e) =>
              onSetHours(e.target.value === "" ? 0 : parseInt(e.target.value))
            }
            onBlur={onBlur}
          />
          <span className="inline-block ml-0.5">h</span>
        </div>
        <div>
          <input
            className={inputClassName}
            type="number"
            inputMode="numeric"
            min={0}
            max={59}
            value={mins}
            title={title}
            onChange={(e) =>
              onSetMinutes(e.target.value === "" ? 0 : parseInt(e.target.value))
            }
            onBlur={onBlur}
          />
          <span className="inline-block ml-0.5">m</span>
        </div>
      </div>
    </div>
  );
}
