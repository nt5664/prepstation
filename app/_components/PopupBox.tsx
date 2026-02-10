"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Button, { ButtonType } from "@/app/_components/primitives/Button";
import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Point = { x: number; y: number } | null;

type BoxContextValue = {
  isOpen: boolean;
  position: Point;
  setIsOpen: (open: boolean) => void;
  setPosition: (pos: Point) => void;
} | null;

const BoxContext = createContext<BoxContextValue>(null);

function useBoxContext() {
  const ctx = useContext(BoxContext);
  if (!ctx) throw new Error("Invalid use of component");

  return ctx;
}

function PopupBox({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [position, setPosition] = useState<Point>(null);

  return (
    <BoxContext.Provider value={{ isOpen, position, setIsOpen, setPosition }}>
      {children}
    </BoxContext.Provider>
  );
}

function Toggle({
  title,
  className,
  children,
}: Readonly<{
  title?: string;
  className?: string;
  children: React.ReactNode;
}>) {
  const { setIsOpen, setPosition } = useBoxContext();

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.x + rect.width / 2,
      y: rect.y,
    });
    setIsOpen(true);
  }

  return (
    <Button
      className={className}
      type={ButtonType.Borderless}
      title={title}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}

function Panel({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isOpen, position, setIsOpen } = useBoxContext();
  const [panelPos, setPanelPos] = useState<Point>(null);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isOpen || !ref.current || !position || panelPos) return;

    setPanelPos({
      x: position.x - ref.current!.getBoundingClientRect().width / 2,
      y: position.y - ref.current!.getBoundingClientRect().height - 12,
    });
  }, [isOpen, position, panelPos, setPanelPos]);

  function handleClose(e: React.MouseEvent) {
    e.stopPropagation();

    setPanelPos(null);
    setIsOpen(false);
  }

  return !isOpen
    ? null
    : createPortal(
        <div
          ref={ref}
          className="fixed grid grid-rows-[auto_1fr] border-2 rounded-md border-emerald-600 bg-teal-900"
          style={{ left: panelPos?.x, top: panelPos?.y }}
        >
          <Button
            className="ml-auto text-lime-400 hover:text-lime-300 active:text-lime-500"
            type={ButtonType.Borderless}
            onClick={handleClose}
          >
            <XMarkIcon height={20} />
          </Button>
          {children}
        </div>,
        document.body,
      );
}

PopupBox.Toggle = Toggle;
PopupBox.Panel = Panel;

export default PopupBox;
