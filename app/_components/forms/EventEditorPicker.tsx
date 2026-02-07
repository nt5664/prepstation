"use client";

import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useReducer } from "react";
import Image from "next/image";
import {
  MagnifyingGlassIcon,
  UserMinusIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import SecondaryInput from "@/app/_components/forms/SecondaryInput";
import Button, {
  ButtonMode,
  ButtonType,
} from "@/app/_components/primitives/Button";
import { getEditorUsers } from "@/app/_lib/actions";
import LoaderMedium from "@/app/_components/LoaderMedium";

type EditorPickerState = {
  nameToSearch: string;
  isSearchOpen: boolean;
  isLoading: boolean;
  foundUsers: { id: string; name: string; image: string | null }[];
};

type EditorPickerStatePayload =
  | {
      property: "nameToSearch";
      payload: string;
    }
  | { property: "isSearchOpen"; payload: boolean }
  | { property: "isLoading" }
  | {
      property: "foundUsers";
      payload: { id: string; name: string; image: string | null }[];
    };

function reduce(state: EditorPickerState, action: EditorPickerStatePayload) {
  switch (action.property) {
    case "nameToSearch":
      return { ...state, nameToSearch: action.payload };
    case "isSearchOpen":
      return { ...state, isSearchOpen: action.payload };
    case "isLoading":
      return { ...state, isSearchOpen: true, isLoading: true };
    case "foundUsers":
      return {
        ...state,
        isSearchOpen: true,
        isLoading: false,
        foundUsers: action.payload,
      };
  }
}

export default function EventEditorPicker({
  className,
  values,
  creatorId,
  max,
  onUpdate,
  onBlur,
}: Readonly<{
  className?: string;
  values: { id: string; name: string }[];
  creatorId?: string;
  max: number;
  onUpdate: (values: { id: string; name: string }[]) => void;
  onBlur: () => void;
}>) {
  const [{ nameToSearch, isSearchOpen, isLoading, foundUsers }, dispatch] =
    useReducer(reduce, {
      nameToSearch: "",
      isSearchOpen: false,
      isLoading: false,
      foundUsers: [],
    });

  async function searchUser() {
    dispatch({ property: "isLoading" });
    const users = await getEditorUsers(nameToSearch);
    dispatch({
      property: "foundUsers",
      payload: (creatorId
        ? users.filter((x) => x.id !== creatorId)
        : users
      ).filter((x) => !values.some((y) => y.id === x.id)),
    });
  }

  function handleAdd(user: { id: string; name: string }) {
    onUpdate([...values, user]);
    onBlur();
    dispatch({ property: "nameToSearch", payload: "" });
    dispatch({ property: "isSearchOpen", payload: false });
  }

  function handleRemove(id: string) {
    onUpdate(values.filter((x) => x.id !== id));
    onBlur();
  }

  return (
    <div
      className={twMerge(
        clsx(
          "grid grid-rows-6 space-y-2 gap-1 w-full h-57 min-w-0 p-1 border-2 rounded-sm text-gray-300 bg-gray-700 border-cyan-700",
          className,
        ),
      )}
    >
      {values.map((x) => (
        <EventEditorPickerRow key={x.id} user={x} onRemove={handleRemove} />
      ))}

      {isSearchOpen && (
        <div className="row-span-5 flex flex-col gap-2 p-1 h-full w-full rounded-sm border-2 border-cyan-700 bg-slate-600">
          {!isLoading ? (
            <>
              <Button
                className="self-end text-cyan-500 hover:text-cyan-400 active:text-cyan-600"
                title="Close this panel"
                type={ButtonType.Borderless}
                mode={ButtonMode.Button}
              >
                <XMarkIcon
                  height={20}
                  onClick={() =>
                    dispatch({ property: "isSearchOpen", payload: false })
                  }
                />
              </Button>

              {foundUsers.length ? (
                foundUsers.map((x) => (
                  <EventEditorPickerSearchRow
                    key={x.id}
                    user={x}
                    onAdd={handleAdd}
                  />
                ))
              ) : (
                <div className="text-center">No users has been found</div>
              )}
            </>
          ) : (
            <LoaderMedium />
          )}
        </div>
      )}

      <div className="row-6 grid grid-cols-[1fr_auto] gap-4">
        <SecondaryInput
          placeholder="Type a name to add"
          max={25}
          value={nameToSearch}
          disabled={values.length >= max}
          onChange={(e) =>
            dispatch({ property: "nameToSearch", payload: e.target.value })
          }
        />

        <Button
          className="mr-2 text-cyan-500 hover:text-cyan-400 active:text-cyan-700 disabled:text-cyan-700"
          title="Search user"
          type={ButtonType.Borderless}
          mode={ButtonMode.Button}
          disabled={
            values.length >= max ||
            isLoading ||
            nameToSearch.length < 3 ||
            nameToSearch.length > 25
          }
          onClick={searchUser}
        >
          <MagnifyingGlassIcon height={26} />
        </Button>
      </div>
    </div>
  );
}

function EventEditorPickerRow({
  user: { id, name },
  onRemove,
}: Readonly<{
  user: { id: string; name: string };
  onRemove: (id: string) => void;
}>) {
  return (
    <div className="flex justify-between h-full items-center px-2 rounded-md text-teal-400 bg-slate-600">
      <div className="italic">{name}</div>
      <Button
        className="hover:text-teal-200 active:text-teal-600"
        type={ButtonType.Borderless}
        mode={ButtonMode.Button}
        title="Remove editor"
        onClick={() => onRemove(id)}
      >
        <UserMinusIcon height={24} />
      </Button>
    </div>
  );
}

function EventEditorPickerSearchRow({
  user: { id, name, image },
  onAdd,
}: Readonly<{
  user: { id: string; name: string; image: string | null };
  onAdd: (user: { id: string; name: string }) => void;
}>) {
  return (
    <div className="flex justify-between items-center px-2">
      <div className="flex gap-2">
        <Image
          className="rounded-full"
          src={image ?? "/imgs/user.png"}
          alt={`Image of ${name}`}
          height={24}
          width={24}
        />{" "}
        <p>{name}</p>{" "}
      </div>
      <Button
        className="hover:text-teal-400 active:text-teal-600"
        title="Add editor"
        type={ButtonType.Borderless}
        mode={ButtonMode.Button}
        onClick={() => onAdd({ id, name })}
      >
        <UserPlusIcon height={24} />
      </Button>
    </div>
  );
}
