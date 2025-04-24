'use client';

import { Player } from "@/db";
import { useEffect, useState, useRef } from "react";
import { createSwapy, Swapy } from "swapy";

function PlayerItem({ player }: { player: Player }) {
    return (
        <div data-swapy-slot={player.id} className="cursor-grab mb-1">
            <div data-swapy-item={player.id}>{ player.nickname }</div>
        </div>
    );
}

function Column({ players }: { players: Player[] }) {
    return (
        <div className="flex flex-col">
            { players.map((p) => (
                <PlayerItem key={p.id} player={p} />
            ))}
        </div>
    );
}

function Field() {
    return (
        <div className="flex flex-col bg-green-500 w-100 h-150">
        </div>
    );
}

export function Lineups({ players }: { players: Player[] }) {
    const [leftTeam, setLeftTeam] = useState(players.slice(0, 5));
    const [rightTeam, setRightTeam] = useState(players.slice(5, 10));

    const swapy = useRef<Swapy>(null);
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (container.current) {
            swapy.current = createSwapy(container.current, {
                // manualSwap: true
            })
        }

        return () => {
            swapy.current?.destroy()
        }
    }, [])

//       <div data-swapy-slot="a">
//         <div data-swapy-item="a">
//           <div>A</div>
//         </div>
//       </div>
// <div data-swapy-slot="b">
//         <div data-swapy-item="b">
//           <div>B</div>
//         </div>
//       </div>

    return (
        <div ref={container} className="mt-10 flex flex-row justify-center gap-5">
            <Column players={leftTeam} />
            <Field />
            <Column players={rightTeam} />
        </div>
    );
}
