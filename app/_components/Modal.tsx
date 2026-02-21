"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Button, { ButtonType } from "@/app/_components/primitives/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type Point = { x: number; y: number } | null;
type DisplayMode = "button-top-middle" | "center-screen";

type ModalContextValue = {
  isOpen: boolean;
  mode: DisplayMode;
  position: Point;
  setIsOpen: (open: boolean) => void;
  setPosition: (pos: Point) => void;
} | null;

const ModalContext = createContext<ModalContextValue>(null);

function useModalContext() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Invalid use of component");

  return ctx;
}

export function useCloseModalWindow() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("Invalid use of component");

  return () => ctx.setIsOpen(false);
}

function Modal({
  mode = "button-top-middle",
  children,
}: Readonly<{ mode?: DisplayMode; children: React.ReactNode }>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [position, setPosition] = useState<Point>(null);

  return (
    <ModalContext.Provider
      value={{ isOpen, mode, position, setIsOpen, setPosition }}
    >
      {children}
    </ModalContext.Provider>
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
  const { setIsOpen, setPosition } = useModalContext();

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

function Window({
  title,
  className,
  children,
}: Readonly<{
  title?: string;
  className?: string;
  children: React.ReactNode;
}>) {
  const { isOpen, mode, position, setIsOpen } = useModalContext();
  const [panelPos, setPanelPos] = useState<Point>(null);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isOpen || !ref.current) return;

    let finalPos: Point = null;
    switch (mode) {
      case "center-screen":
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        finalPos = {
          x: windowWidth / 2 - ref.current!.getBoundingClientRect().width / 2,
          y: windowHeight / 2 - ref.current!.getBoundingClientRect().height / 2,
        };
        break;
      case "button-top-middle":
        if (!position) return;

        finalPos = {
          x: position.x - ref.current!.getBoundingClientRect().width / 2,
          y: position.y - ref.current!.getBoundingClientRect().height - 12,
        };
        break;
    }

    setPanelPos((pos) => pos || finalPos);
  }, [isOpen, mode, position, setPanelPos]);

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
          className={twMerge(
            clsx(
              "fixed grid grid-rows-[auto_1fr] border-2 rounded-md border-emerald-600 bg-teal-900",
              className,
            ),
          )}
          style={{ left: panelPos?.x, top: panelPos?.y }}
        >
          <div className="flex justify-between pl-1 tracking-wider">
            <div className="text-lime-500">{title}</div>
            <Button
              className="text-lime-400 hover:text-lime-300 active:text-lime-500"
              type={ButtonType.Borderless}
              onClick={handleClose}
            >
              <XMarkIcon height={20} />
            </Button>
          </div>

          {children}
        </div>,
        document.body,
      );
}

Modal.Toggle = Toggle;
Modal.Window = Window;

export default Modal;
