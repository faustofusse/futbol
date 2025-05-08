"use client";

import { logout } from "@/lib/auth";
import Link from "next/link";

type Group = { id: number | null; name: string | null };

export function NavBar({
  groups,
  currentGroup,
}: {
  groups: Group[];
  currentGroup?: number;
}) {
  const group =
    currentGroup == null
      ? groups.at(0)
      : groups.filter((g) => g.id == currentGroup).at(0);
  return (
    <div className="p-4 flex flex-row justify-between max-w-full border-b-1 border-[#2b2b2b]">
      <div className="w-[20vh] flex flex-row justify-start">
        <select className="rounded-md bg-gray-900 text-white border border-gray-900 gap-0.5 p-2 cursor-pointer hover:opacity-75">
          {groups.map((group) => (
            <option key={group?.id}>{group?.name}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-row gap-4">
        <Link
          href={"/"}
          className="rounded-md bg-gray-900 text-white border border-gray-900 gap-0.5 p-2 cursor-pointer hover:opacity-75"
        >
          Partido
        </Link>
        <Link
          href={"/players"}
          className="rounded-md bg-gray-900 text-white border border-gray-900 gap-0.5 p-2 cursor-pointer hover:opacity-75"
        >
          Jugadores
        </Link>
        <Link
          href={"/matches"}
          className="rounded-md bg-gray-900 text-white border border-gray-900 gap-0.5 p-2 cursor-pointer hover:opacity-75"
        >
          Historial
        </Link>
      </div>
      <div className="w-[20vh] flex flex-row justify-end">
        <button
          onClick={logout}
          className="rounded-md bg-gray-900 text-white border border-red-900 gap-0.5 p-2 cursor-pointer hover:opacity-75 hover:bg-red-900"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
