"use client";

import { Player, TeamPlayer, Match, Team, TeamExpanded } from "@/db";
import { Nullable } from "@/lib/utils";
import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { createSwapy, Swapy } from "swapy";
import { deleteTeamPlayer, assignPlayer } from "./players/actions";
import { changeMatchPA } from "./matches/actions";

function PlayerItem({
  player,
  panelVisibility,
  i,
  teamPlayer,
  teamList,
  setTeamList,
}: {
  player: Player;
  panelVisibility: number;
  teamPlayer: Nullable<TeamPlayer> | undefined;
  i: number;
  teamList: Nullable<{
    player: number;
    match: number;
    team: number;
    index: number;
    x: number | null;
    y: number | null;
    onPitch: boolean;
  }>[];
  setTeamList: Dispatch<
    SetStateAction<
      Nullable<{
        player: number;
        match: number;
        index: number;
        team: number;
        x: number | null;
        y: number | null;
        onPitch: boolean;
      }>[]
    >
  >;
}) {
  return (
    <div
      data-swapy-item={player.id}
      className="group flex justify-start items-center gap-2 p-2 cursor-grab data-swapy-dragging:cursor-grabbing group-data-[align=left]:flex-row group-data-[align=right]:flex-row-reverse"
    >
      {player ? (
        <div
          className={
            panelVisibility === i && teamPlayer?.team === 0
              ? "absolute bg-gray-800 rounded-2xl p-2 z-1000 inline-block ml-16"
              : panelVisibility === i && teamPlayer?.team === 1
              ? "absolute bg-gray-800 rounded-2xl p-2 z-1000 inline-block mr-16"
              : "hidden"
          }
        >
          <button
            onClick={() => {
              deleteTeamPlayer(player.id);
              setTeamList(
                teamList.filter((team) => {
                  return team.player === player.id;
                })
              );
            }}
            className="rounded-md bg-gray-900 text-white border border-red-900 p-2 cursor-pointer hover:opacity-75 hover:bg-red-900"
          >
            Remover
          </button>
        </div>
      ) : null}
      <span className="select-none group-data-swapy-dragging:font-bold text-2xs">
        {player.nickname?.toUpperCase()}
      </span>
      <div className="rounded-4xl h-5 bg-red-700 aspect-square group-data-swapy-dragging:border-yellow-300 group-data-swapy-dragging:border-2"></div>
    </div>
  );
}

function PlayerSlot({
  children,
  align,
  index,
}: {
  index: number;
  align: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <div className="relative group" data-align={align}>
      <div
        data-swapy-slot={`${align}-${index}`}
        className="flex min-w-[200px] h-[40px] w-[100%] justify-start group-data-[align=left]:flex-row-reverse group-data-[align=right]:flex-row"
      >
        {children}
      </div>
      <div className="absolute top-0 w-[100%] z-0 group-has-data-swapy-item:invisible">
        <div className="flex justify-end items-center gap-2 p-2 group-data-[align=left]:flex-row group-data-[align=right]:flex-row-reverse">
          <span className="text-gray-700/35 select-none font-bold"></span>
          <div className="rounded-4xl h-5 bg-gray-700/35 aspect-square"></div>
        </div>
      </div>
    </div>
  );
}

function Column({
  amount,
  teamPlayers,
  players,
  align,
  team,
  simpleMode,
}: {
  amount: number;
  teamPlayers: Nullable<TeamPlayer>[];
  players: Player[];
  align: "left" | "right";
  team: Team;
  simpleMode: boolean;
}) {
  const [teamList, setTeamList] = useState(
    teamPlayers.filter((tp) => {
      return tp.onPitch === false;
    })
  );
  const [panelVisibility, setPanelVisibility] = useState(-1);
  return (
    <div className={simpleMode ? "flex flex-col mt-3" : "flex flex-col mt-19"}>
      {simpleMode ? (
        <h1 className={team.id === 0 ? "flex justify-end text-xl" : "text-xl"}>
          {team?.name?.toUpperCase()}
        </h1>
      ) : null}
      {Array.from({ length: amount }, (_, i) => {
        const teamPlayer = teamList.find((tp) => {
          return tp.index === i;
        });
        const player = players.find((player) => {
          return player.id === teamPlayer?.player;
        });
        return (
          <div
            className="flex"
            onMouseOver={() => {
              setPanelVisibility(i);
            }}
            onMouseLeave={() => {
              setPanelVisibility(-1);
            }}
            onDragCapture={() => {
              setPanelVisibility(-1);
            }}
            key={i}
          >
            <PlayerSlot key={i} index={i} align={align}>
              {player && (
                <PlayerItem
                  teamPlayer={teamPlayer}
                  player={player}
                  panelVisibility={panelVisibility}
                  i={i}
                  teamList={teamList}
                  setTeamList={setTeamList}
                />
              )}
            </PlayerSlot>
          </div>
        );
      })}
    </div>
  );
}

function Field({ simpleMode, team }: { simpleMode: boolean; team: Team }) {
  return (
    <div>
      {!simpleMode ? (
        <h1 className="text-xl mb-2">{team?.name?.toUpperCase()}</h1>
      ) : null}
      <div className="flex relative rounded-[19px] border-2 inset-shadow-blue-950/100 border-white shadow-amber-300-2xl h-[500px] w-[387.55px] bg-contain bg-[url('/pitch.png')]"></div>
    </div>
  );
}

function handlePlayerAmount(
  setPlayerAmount: Dispatch<SetStateAction<number>>,
  value: number,
  matchId: number
) {
  setPlayerAmount(value);
  changeMatchPA(matchId, value);
}

export function Lineups({
  match,
  teams,
  teamPlayers,
  players,
  group,
}: {
  match: Match;
  teams: TeamExpanded[];
  teamPlayers: TeamPlayer[][];
  players: Player[];
  group: number;
}) {
  const [leftTeam, setLeftTeam] = useState(teamPlayers[0]);
  const [rightTeam, setRightTeam] = useState(teamPlayers[1]);
  const [simpleMode, setSimpleMode] = useState(false);
  const [playerAmount, setPlayerAmount] = useState(match.playerAmount);
  const options = [5, 6, 7, 8, 9, 10, 11];

  const swapy = useRef<Swapy>(null);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      swapy.current = createSwapy(container.current, {
        // manualSwap: true
      });
      swapy.current.onSwap((event) => {
        const playerId = Number(event.draggingItem);
        const affected = Number(event.swappedWithItem);
        const fromSlot = event.fromSlot;
        const toSlot = event.toSlot;
        const playerIndex = Number(toSlot?.split("-")[1]);
        const affectedIndex = Number(fromSlot?.split("-")[1]);

        let playerTeam;
        let affectedTeam;
        if (toSlot.includes("left")) {
          playerTeam = 0;
          if (fromSlot.includes("right")) {
            affectedTeam = 1;
            const player = rightTeam.find((p) => {
              return p.player === playerId;
            });
            if (player) {
              player.team = 0;
              console.log(event);
              console.log(leftTeam);
              setLeftTeam([...leftTeam, player]);
              console.log(leftTeam);
            }
          } else {
            affectedTeam = 0;
          }
        } else {
          playerTeam = 1;
          setRightTeam(rightTeam);
          if (fromSlot.includes("left")) {
            affectedTeam = 0;
            const player = leftTeam.find((p) => {
              return p.player === playerId;
            });
            if (player) {
              player.team = 1;
              console.log(event);
              console.log(rightTeam);
              setRightTeam([...rightTeam, player]);
              console.log(rightTeam);
            }
          } else {
            affectedTeam = 1;
          }
        }
        assignPlayer(group, playerId, playerIndex, playerTeam);
        if (affected) {
          assignPlayer(group, affected, affectedIndex, affectedTeam);
        }
      });
    }

    return () => {
      swapy.current?.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-row gap-4">
        <div className="flex items-center rounded-md bg-gray-900 text-white gap-0.5">
          {options.map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="type"
                value={value}
                defaultChecked={playerAmount === value}
                onClick={() =>
                  handlePlayerAmount(setPlayerAmount, value, match.id)
                }
                className="peer hidden"
              />
              <span
                className={`${
                  value === playerAmount
                    ? "peer-checked:bg-white peer-checked:text-black rounded-md p-3 duration-500"
                    : "hover:bg-gray-800 cursor-pointer rounded-md p-3 duration-500"
                }`}
              >
                F{value}
              </span>
            </label>
          ))}
        </div>
        <button
          className="flex flex-row rounded-md bg-gray-900 text-white border border-gray-900 gap-0.5 p-2 cursor-pointer hover:opacity-75"
          onClick={() => setSimpleMode(!simpleMode)}
        >
          <img
            src="https://img.icons8.com/?size=100&id=cBFvS9yWRYSZ&format=png&color=000000"
            className="h-7 rotate-90"
          ></img>
          {!simpleMode ? (
            <img
              src="https://img.icons8.com/?size=100&id=cBFvS9yWRYSZ&format=png&color=000000"
              className="h-7 rotate-90"
            ></img>
          ) : null}
        </button>
      </div>
      <div ref={container} className="mt-4 flex flex-row justify-center gap-5">
        <Column
          teamPlayers={leftTeam}
          players={players}
          align="left"
          amount={playerAmount}
          team={teams[0]}
          simpleMode={simpleMode}
        />
        <div className="mt-4 flex flex-row justify-center gap-20">
          <Field simpleMode={simpleMode} team={teams[0]} />
          {simpleMode === false ? (
            <Field simpleMode={simpleMode} team={teams[1]} />
          ) : null}
        </div>
        <Column
          teamPlayers={rightTeam}
          players={players}
          align="right"
          amount={playerAmount}
          team={teams[1]}
          simpleMode={simpleMode}
        />
      </div>
    </div>
  );
}
