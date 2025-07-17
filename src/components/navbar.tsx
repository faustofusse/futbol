"use client";

import { createSession } from "@/lib/sessions";
import { Match } from "@/db";
import { logout } from "@/lib/auth";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { createUserSession } from "@/app/(logged)/groups/actions";
import { useState } from "react";

type Group = { id: number | null; name: string | null };

export function NavBar({
  groups,
  matches,
  currentMatch,
  currentGroup,
  userId,
}: {
  groups: Group[];
  matches: Match[];
  currentMatch?: number;
  currentGroup?: number;
  userId: number;
}) {
  const [selectedId, setSelectedId] = useState(0);
  const group =
    currentGroup == null
      ? groups.at(0)
      : groups.filter((g) => g.id == currentGroup).at(0);

  async function redirectToGroup(id: number) {
    if (id != -1) {
      const matchId = matches.filter((group) => group.group === id)[0]?.id;
      await createUserSession(userId, id!, matchId);
      redirect("/groups/" + id + "/matches");
    } else {
      redirect("/groups");
    }
  }
  if (usePathname() != "/groups") {
    return (
      <div className="p-4 flex flex-row justify-between max-w-full border-b-1 border-[#2b2b2b]">
        <div className="w-[20vh] flex flex-row justify-start">
          <select
            id="redirectSelect"
            defaultValue={currentGroup}
            onChange={(e) => {
              redirectToGroup(Number(e.target.value));
            }}
            className="rounded-md bg-[#202020] text-white border border-gray-900 gap-0.5 p-2 cursor-pointer hover:opacity-75"
          >
            {groups.map((group) => (
              <option value={group!.id!} key={group?.id}>
                {group?.name}
              </option>
            ))}
            <option value={-1}>Editar grupos</option>
          </select>
        </div>
        <div className="flex flex-row gap-4">
          <Link
            href={"/groups/" + currentGroup + "/matches/" + currentMatch}
            className="rounded-md bg-[#202020] text-white border border-gray-900 gap-0.5 p-2 cursor-pointer hover:opacity-75"
          >
            Esquema
          </Link>
          <Link
            href={
              "/groups/" +
              currentGroup +
              "/matches/" +
              currentMatch +
              "/players"
            }
            className="rounded-md bg-[#202020] text-white border border-gray-900 gap-0.5 p-2 cursor-pointer hover:opacity-75"
          >
            Jugadores
          </Link>
          <Link
            href={"/groups/" + currentGroup + "/matches"}
            className="rounded-md bg-[#202020] text-white border border-gray-900 gap-0.5 p-2 cursor-pointer hover:opacity-75"
          >
            Partidos
          </Link>
        </div>
        <div className="w-[20vh] flex flex-row justify-end">
          <button
            onClick={logout}
            className="rounded-md bg-[#202020] text-white border border-red-900 gap-0.5 p-2 cursor-pointer hover:opacity-75 hover:bg-red-900"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
