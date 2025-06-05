"use client";

import { Player, TeamPlayer, Team, db } from "@/db";
import { useState, useRef } from "react";
import { createPlayer, deletePlayer, assignPlayer } from "./actions";

export function PlayersList({
  initialPlayers,
  groupId,
  teams,
  teamPlayers,
}: {
  initialPlayers: Player[];
  groupId: number;
  teams: Team[];
  teamPlayers: TeamPlayer[][];
}) {
  const [players, setPlayers] = useState(initialPlayers);
  const selectRef = useRef<{ [playerId: number]: HTMLSelectElement | null }>(
    {}
  );

  function Slot({ p }: { p: Player }) {
    const [buttonAvailability, setButtonAvailability] = useState(false);
    const [addedConfirmation, setAddedConfirmation] = useState(false);
    const [playerTeam, setPlayerTeam] = useState(
      teamPlayers[0]?.find((tp) => {
        return tp.player === p.id;
      })?.team ??
        teamPlayers[1]?.find((tp) => {
          return tp.player === p.id;
        })?.team ??
        -1
    );
    const [value, setValue] = useState(playerTeam != -1 ? playerTeam : -2);
    return (
      <div
        key={p.id}
        style={{
          borderBottomWidth:
            p.id === players[players.length - 1].id ? "0" : "1px",
        }}
        className="flex flex-row justify-between items-center p-3 border-b-1 gap-3 border-[#2b2b2b]"
      >
        <span className="w-20">{p.nickname}</span>
        <div className="flex flex-row justify-between bg-[#272727] p-1 rounded-2xl gap-1">
          <select
            className="rounded-md bg-gray-900 text-white border border-gray-900 gap-0.5 p-2"
            id="select"
            defaultValue={value?.toString()}
            onChange={(e) => {
              setValue(Number(e.target.value));
              Number(e.target.value) === teams[0]?.id ||
              Number(e.target.value) === teams[1]?.id
                ? setButtonAvailability(true)
                : setButtonAvailability(false);
            }}
            ref={(el) => {
              selectRef.current[p.id] = el;
            }}
          >
            <option value="-2" disabled>
              Sin equipo
            </option>
            <option value={teams[0]?.id}>{teams[0]?.name}</option>
            <option value={teams[1]?.id}>{teams[1]?.name}</option>
          </select>
          <button
            className={
              buttonAvailability && playerTeam !== value
                ? "rounded-md bg-gray-900 text-white border border-gray-900 gap-0.5 p-2 cursor-pointer hover:opacity-75"
                : addedConfirmation || playerTeam === value
                ? "pointer-events-none rounded-md bg-green-900 text-white border border-gray-900 gap-0.5 p-2"
                : "pointer-events-none opacity-50 rounded-md bg-gray-900 text-white border border-gray-900 gap-0.5 p-2 cursor-pointer hover:opacity-75"
            }
            onClick={() => {
              assign(p.id, value);
              setAddedConfirmation(true);
              setButtonAvailability(false);
              setPlayerTeam(value);
            }}
            id="assign"
          >
            {(!buttonAvailability && addedConfirmation) || playerTeam === value
              ? "Asignado"
              : "Asignar"}
          </button>
        </div>
        <button
          className="rounded-md bg-gray-900 text-white border border-red-900 p-2 cursor-pointer hover:opacity-75 hover:bg-red-900"
          onClick={() => remove(p.id)}
        >
          Eliminar
        </button>
      </div>
    );
  }

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
    assignPlayer(groupId, id, -1, teamId);

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
      <button
        className="rounded-md bg-gray-900 text-white border border-gray-900 gap-0.5 p-2 cursor-pointer hover:opacity-75 mb-3"
        onClick={create}
      >
        Añadir
      </button>
      <div className="flex flex-col min-w-70 border-1 border-[#2b2b2b] rounded-2xl">
        {players.map((p) => (
          <Slot key={p.id} p={p} />
        ))}
      </div>
    </>
  );
}
