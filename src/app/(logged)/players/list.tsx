"use client";

import { Player } from "@/db";
import { useState } from "react";
import { createPlayer, deletePlayer } from "./actions";

export function PlayersList({
  initialPlayers,
  groupId,
}: {
  initialPlayers: Player[];
  groupId: number;
}) {
  const [players, setPlayers] = useState(initialPlayers);

  function create() {
    const nickname = prompt("nombre");
    if (!nickname) return;
    createPlayer(nickname, groupId).then((p) => {
      if (p) {
        setPlayers([...players, p]);
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
      <button className="cursor-pointer hover:opacity-75 mb-3" onClick={create}>
        Añadir
      </button>
      <div className="flex flex-col min-w-70">
        {players.map((p) => (
          <div key={p.id} className="flex flex-row justify-between">
            <span>{p.nickname}</span>
            <button
              className="cursor-pointer hover:opacity-75"
              onClick={() => remove(p.id)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
