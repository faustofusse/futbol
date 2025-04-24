'use client';

import { logout } from "@/lib/auth";
import Link from "next/link";

type Group = { id: number | null, name: string | null };

export function NavBar({ groups, currentGroup }: { groups: Group[], currentGroup?: number }) {
    const group = currentGroup == null ? groups.at(0) : groups.filter(g => g.id == currentGroup).at(0);
    return (
        <div className="p-4 flex flex-row justify-between max-w-full bg-grey">
            <div className="w-[20vh] flex flex-row justify-start">
                <button className="bg-sky-500/10">{ group?.name }</button>
            </div>
            <div className="flex flex-row gap-4">
                <Link href={"/"}>vista previa</Link>
                <Link href={"/players"}>jugadores</Link>
                <Link href={"/matches"}>partidos</Link>
            </div>
            <div className="w-[20vh] flex flex-row justify-end">
                <button onClick={logout} className="bg-sky-500/10">logout</button>
            </div>
        </div>
    );
}
