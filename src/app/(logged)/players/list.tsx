"use client";

import { Player, Team, db } from "@/db";
import { useState, useRef } from "react";
import { createPlayer, deletePlayer, assignPlayer } from "./actions";
import { and, eq } from "drizzle-orm";

export function PlayersList({
  initialPlayers,
  groupId,
  teams,
}: {
  initialPlayers: Player[];
  groupId: number;
  teams: Team[];
}) {
  const [players, setPlayers] = useState(initialPlayers);
  const selectRef = useRef<{ [playerId: number]: HTMLSelectElement | null }>(
    {}
  );

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

  async function assign(id: number, teamId: number) {
    assignPlayer(groupId, id, teamId);

    const nick = players.find((player) => {
      return player.id === id;
    })?.nickname;
    const team = teams.find((team) => {
      return team.id === teamId;
    })?.name;

    console.log("Asigned Player " + nick + " to team " + team);
  }

  return (
    <>
      <button className="cursor-pointer hover:opacity-75 mb-3" onClick={create}>
        Añadir
      </button>
      <div className="flex flex-col min-w-70 border-1 border-[#2b2b2b] rounded-2xl">
        {players.map((p) => (
          <div
            key={p.id}
            style={{
              borderBottomWidth:
                p.id === players[players.length - 1].id ? "0" : "1px",
            }}
            className="flex flex-row justify-between items-center p-3 border-b-1 gap-3 border-[#2b2b2b]"
          >
            <span>{p.nickname}</span>
            <div className="flex flex-row justify-between bg-[#272727] p-1 rounded-2xl gap-1">
              <select
                className="rounded-md bg-gray-900 text-white border border-gray-900 gap-0.5 p-2"
                id="select"
                defaultValue={"Seleccionar"}
                ref={(el) => {
                  selectRef.current[p.id] = el;
                }}
              >
                <option value={teams[0]?.id}>{teams[0]?.name}</option>
                <option value={teams[1]?.id}>{teams[1]?.name}</option>
              </select>
              <button
                className="rounded-md bg-gray-900 text-white border border-gray-900 gap-0.5 p-2 cursor-pointer hover:opacity-75"
                onClick={() => {
                  const value = selectRef.current[p.id]?.value;
                  assign(p.id, Number(value));
                }}
              >
                Asignar
              </button>
            </div>
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
