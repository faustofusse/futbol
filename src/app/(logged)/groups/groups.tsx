"use client";

import { Match } from "@/db";
import { useRef, useState } from "react";
import { createGroup, createUserSession, deleteGroup } from "./actions";
import { redirect } from "next/navigation";

type Group = { id: number | null; name: string | null };
export function GroupsList({
  groups,
  matches,
  userId,
}: {
  groups: Group[];
  matches: Match[];
  userId: number;
}) {
  const [groupsList, setGroupsList] = useState(groups);
  const [panelVisibility, setPanelVisibility] = useState(false);
  const groupInput = useRef<HTMLInputElement>(null);

  function Slot({ g }: { g: Group }) {
    const matchesAmount = matches.filter(
      (group) => group.group === g.id
    ).length;

    return (
      <div
        key={g.id}
        style={{
          borderBottomWidth:
            g.id === groupsList[groupsList.length - 1].id ? "0" : "1px",
        }}
        className="flex flex-row justify-between items-center p-3 border-b-1 gap-3 border-[#2b2b2b]"
      >
        <span className="w-20">{g.name}</span>
        <span className="w-20">{matchesAmount} partidos</span>
        <button
          className="rounded-md bg-gray-900 text-white border border-green-900 p-2 cursor-pointer hover:opacity-75 hover:bg-green-900"
          onClick={() => (g?.id ? goTo(g?.id) : null)}
        >
          Editar
        </button>
        <button
          className="rounded-md bg-gray-900 text-white border border-red-900 p-2 cursor-pointer hover:opacity-75 hover:bg-red-900"
          onClick={() => (g?.id ? remove(g.id) : null)}
        >
          Eliminar
        </button>
      </div>
    );
  }

  async function goTo(id: number) {
    await createUserSession(userId, id);
    redirect("/groups/" + id + "/matches");
  }

  function remove(id: number) {
    deleteGroup(id).then(() => {
      setGroupsList(groupsList.filter((m) => m.id != id));
    });
  }

  return (
    <>
      <button
        className="rounded-md bg-gray-900 text-white border border-gray-900 gap-0.5 p-2 cursor-pointer hover:opacity-75 mb-3"
        onClick={() => {
          setPanelVisibility(!panelVisibility);
        }}
      >
        {panelVisibility ? "Cancelar" : "Crear"}
      </button>
      {panelVisibility ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createGroup(userId, groupInput?.current?.value).then((r) => {
              setGroupsList([...groupsList, r.group]);
              setPanelVisibility(false);
            });
          }}
          className="flex flex-col min-w-70 border-1 border-[#2b2b2b] rounded-2xl mb-3"
        >
          <input
            className="flex flex-col min-w-70 p-2 focus:outline-none"
            ref={groupInput}
            placeholder="Nombre del grupo"
          ></input>
          <button className=" rounded-2xl bg-gray-900 text-white border border-gray-900 gap-0.5 p-2 cursor-pointer hover:opacity-75">
            Crear
          </button>
        </form>
      ) : null}
      <div className="flex flex-col min-w-70 border-1 border-[#2b2b2b] rounded-2xl">
        {groupsList.map((g) => (
          <Slot key={g.id} g={g} />
        ))}
      </div>
    </>
  );
}
