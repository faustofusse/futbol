'use client';

import { Player } from "@/db";
import { useState } from "react";
import { createPlayer, deletePlayer } from "./actions";

export function PlayersList({ initialPlayers, groupId }: { initialPlayers: Player[], groupId: number }) {
    const [players, setPlayers] = useState(initialPlayers);

    function create() {
        const nickname = prompt('nombre');
        if (!nickname) return;
        createPlayer(nickname, groupId).then((p) => {
            if (p) {
                setPlayers([ ...players, p ]);
            }
        });
    }

    function remove(id: number) {
        deletePlayer(id).then(() => {
            setPlayers(players.filter((p) => p.id != id));
        });
    }

    return (
        <>
            <button onClick={create} className="mb-3">nuevo</button>
            <div className="flex flex-col min-w-70">
                { players.map((p) => (
                    <div key={p.id} className="flex flex-row justify-between">
                        <span>{ p.nickname }</span>
                        <button onClick={() => remove(p.id)}>eliminar</button>
                    </div>
                )) }
            </div>
        </>
    );
}
