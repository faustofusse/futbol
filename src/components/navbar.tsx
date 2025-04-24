'use client';

import { logout } from "@/lib/auth";

type Group = { id: number | null, name: string | null };

export function NavBar({ groups, currentGroup }: { groups: Group[], currentGroup?: number }) {
  const group = currentGroup == null ? groups.at(0) : groups.filter(g => g.id == currentGroup).at(0);
  return (
    <div className="p-4 flex flex-row justify-between max-w-full bg-grey">
      <button className="bg-sky-500/10">{ group?.name }</button>
	  <button onClick={logout} className="bg-sky-500/10">logout</button>
    </div>
  );
}
