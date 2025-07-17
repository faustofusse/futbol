"use client";

import { Match, Team } from "@/db";
import { useState, useRef } from "react";
import { createMatch, deleteMatch } from "./actions";
import { createUserSession } from "../../actions";
import { redirect } from "next/navigation";

export function MatchesList({
  matches,
  currentTeams,
  groupId,
  userId,
}: {
  matches: Match[];
  currentTeams: Team[];
  groupId: number;
  userId: number;
}) {
  const [matchesList, setMatchesList] = useState(matches);
  const [teamsList, setTeamsList] = useState(currentTeams);
  const [panelVisibility, setPanelVisibility] = useState(false);
  const team1input = useRef<HTMLInputElement>(null);
  const team2input = useRef<HTMLInputElement>(null);

  function Slot({ m }: { m: Match }) {
    const teamsArray = teamsList.filter((team) => team.match === m.id);

    return (
      <div
        key={m.id}
        style={{
          borderBottomWidth:
            m.id === matchesList[matchesList.length - 1].id ? "0" : "1px",
        }}
        className="flex flex-row justify-between items-center p-3 border-b-1 gap-3 border-[#2b2b2b]"
      >
        <span className="w-20">{m.date}</span>
        <span className="w-20">Fútbol {m.playerAmount}</span>
        <span className="w-30">
          {teamsArray[0]?.name} vs {teamsArray[1]?.name}
        </span>
        <button
          className="rounded-md bg-gray-900 text-white border border-green-900 p-2 cursor-pointer hover:opacity-75 hover:bg-green-900"
          onClick={() => goTo(m.id)}
        >
          Editar
        </button>
        <button
          className="rounded-md bg-gray-900 text-white border border-red-900 p-2 cursor-pointer hover:opacity-75 hover:bg-red-900"
          onClick={() => remove(m.id)}
        >
          Eliminar
        </button>
      </div>
    );
  }

  async function goTo(id: number) {
    await createUserSession(userId, groupId, id);
    redirect("/groups/" + groupId + "/matches/" + id);
  }

  function remove(id: number) {
    deleteMatch(id).then(() => {
      setMatchesList(matchesList.filter((m) => m.id != id));
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
            createMatch(
              groupId,
              team1input?.current?.value,
              team2input?.current?.value
            ).then(async (r) => {
              setMatchesList([...matchesList, r.match]);
              setTeamsList([...teamsList, ...r.teams]);
              setPanelVisibility(false);
            });
          }}
          className="flex flex-col min-w-70 border-1 border-[#2b2b2b] rounded-2xl mb-3"
        >
          <input
            className="flex flex-col min-w-70 p-2"
            ref={team1input}
            placeholder="Nombre equipo 1"
          ></input>
          <input
            className="flex flex-col min-w-70 p-2"
            ref={team2input}
            placeholder="Nombre equipo 2"
          ></input>
          <button className=" rounded-2xl bg-gray-900 text-white border border-gray-900 gap-0.5 p-2 cursor-pointer hover:opacity-75">
            Crear
          </button>
        </form>
      ) : null}
      <div className="flex flex-col min-w-70 border-1 border-[#2b2b2b] rounded-2xl">
        {matchesList.map((m) => (
          <Slot key={m.id} m={m} />
        ))}
      </div>
    </>
  );
}
