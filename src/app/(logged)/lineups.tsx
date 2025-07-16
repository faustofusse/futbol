"use client";

import { Player, TeamPlayer, Match, Team, TeamExpanded } from "@/db";
import { Nullable } from "@/lib/utils";
import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { createSwapy, Swapy } from "swapy";
import { motion, useMotionValue } from "framer-motion";
import {
  deleteTeamPlayer,
  assignPlayer,
  setPlayerStatus,
  setPlayerPosition,
} from "./players/actions";
import { changeMatchPA } from "./matches/actions";

function PlayerItem({
  player,
  panelVisibility,
  i,
  teamPlayer,
  setTeamPlayers,
}: {
  player: Player;
  panelVisibility: number;
  teamPlayer: Nullable<TeamPlayer> | undefined;
  i: number;
  setTeamPlayers: Dispatch<
    SetStateAction<
      {
        match: number;
        team: number;
        player: number;
        index: number;
        x: number | null;
        y: number | null;
        onPitch: boolean;
      }[]
    >
  >;
}) {
  return (
    <div
      data-swapy-item={player.id}
      className="group flex justify-start items-center gap-2 p-2 cursor-grab data-swapy-dragging:cursor-grabbing group-data-[align=left]:flex-row group-data-[align=right]:flex-row-reverse"
    >
      <span
        className={
          teamPlayer?.team === 0
            ? "absolute select-none group-data-swapy-dragging:font-bold text-2xs right-10"
            : "absolute select-none group-data-swapy-dragging:font-bold text-2xs left-10"
        }
      >
        {player.nickname?.toUpperCase()}
      </span>
      <div
        className={
          teamPlayer?.team === 0
            ? "rounded-4xl h-5 bg-red-700 aspect-square group-data-swapy-dragging:border-yellow-300 group-data-swapy-dragging:border-2"
            : "rounded-4xl h-5 bg-blue-700 aspect-square group-data-swapy-dragging:border-yellow-300 group-data-swapy-dragging:border-2"
        }
      ></div>
      {player ? (
        <div
          className={
            panelVisibility === i && teamPlayer?.team === 0
              ? "absolute flex flex-col bg-gray-800 rounded-2xl z-10 p-2 ml-6"
              : panelVisibility === i && teamPlayer?.team === 1
              ? "absolute flex flex-col bg-gray-800 rounded-2xl z-10 p-2 mr-6"
              : "hidden"
          }
        >
          <button
            onClick={() => {
              deleteTeamPlayer(player.id);
              setTeamPlayers((prevPlayers) =>
                prevPlayers.filter((p) => p.player !== player.id)
              );
            }}
            className="rounded-md bg-gray-900 text-white border border-red-900 p-2 cursor-pointer hover:opacity-75 hover:bg-red-900"
          >
            Remover
          </button>
          <button
            onClick={() => {
              setPlayerStatus(player.id, true);
              setTeamPlayers((prevPlayers) =>
                prevPlayers.map((p) =>
                  p.player === player.id ? { ...p, onPitch: true } : p
                )
              );
            }}
            className="rounded-md bg-gray-900 text-white border border-red-900 p-2 cursor-pointer hover:opacity-75 hover:bg-red-900"
          >
            Agregar
          </button>
        </div>
      ) : null}
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
  setTeamPlayers,
}: {
  amount: number;
  teamPlayers: Nullable<TeamPlayer>[];
  players: Player[];
  align: "left" | "right";
  team: Team;
  simpleMode: boolean;
  setTeamPlayers: Dispatch<
    SetStateAction<
      {
        match: number;
        team: number;
        player: number;
        index: number;
        x: number | null;
        y: number | null;
        onPitch: boolean;
      }[]
    >
  >;
}) {
  const [panelVisibility, setPanelVisibility] = useState(-1);
  return (
    <div className={simpleMode ? "flex flex-col mt-3" : "flex flex-col mt-19"}>
      {simpleMode ? (
        <h1 className={team.id === 0 ? "flex justify-end text-xl" : "text-xl"}>
          {team?.name?.toUpperCase()}
        </h1>
      ) : null}
      {Array.from({ length: amount }, (_, i) => {
        const teamPlayer = teamPlayers
          .filter((tp) => {
            return tp.onPitch === false;
          })
          .find((tp) => {
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
                  setTeamPlayers={setTeamPlayers}
                />
              )}
            </PlayerSlot>
          </div>
        );
      })}
    </div>
  );
}

function PitchPlayer({
  tp,
  playerTeam,
  players,
  containerRef,
  setPanelVisibility,
  panelVisibility,
  setPlayerList,
  rect,
  simpleMode,
}: {
  tp: TeamPlayer;
  playerTeam: number;
  players: Player[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  setPanelVisibility: Dispatch<SetStateAction<number>>;
  panelVisibility: number;
  setPlayerList: Dispatch<SetStateAction<TeamPlayer[]>>;
  rect: DOMRect | undefined;
  simpleMode: boolean;
}) {
  const x = useMotionValue(
    simpleMode && tp.team === 0
      ? (rect?.width || 0) - (tp.x || 0) - 20
      : tp.x || 0
  );
  const y = useMotionValue(
    !simpleMode
      ? tp.y || 0
      : simpleMode && tp.team === 0
      ? ((rect?.height || 0) - (tp.y || 0)) / 2 - 20
      : (tp.y || 0) + ((rect?.height || 0) - (tp.y || 0)) / 2 - 20
  );

  const dragConstraints = rect
    ? !simpleMode
      ? containerRef
      : playerTeam === 0
      ? {
          top: 0,
          left: 0,
          right: rect.width - 20,
          bottom: rect.height / 2 - 20,
        }
      : {
          top: rect.height / 2,
          left: 0,
          right: rect.width - 20,
          bottom: rect.height - 20,
        }
    : {};

  return (
    <motion.div
      key={tp.player}
      drag
      dragConstraints={dragConstraints}
      dragMomentum={false}
      onHoverStart={() => {
        setPanelVisibility(tp.player);
      }}
      onMouseLeave={() => {
        setPanelVisibility(-1);
      }}
      onDrag={() => {
        setPanelVisibility(-1);
      }}
      onDragEnd={() => {
        const timer = setTimeout(() => {
          let posX = 0;
          let posY = 0;
          if (!simpleMode) {
            posX = x.get();
            posY = y.get();
          }
          if (simpleMode && tp.team === 0) {
            posX = (rect?.width || 0) - x.get() - 20;
            posY = (rect?.height || 0) - (y.get() + 20) * 2;
          }
          if (simpleMode && tp.team === 1) {
            posX = x.get();
            posY = y.get() / 2;
          }
          setPlayerPosition(tp.player, posX, posY);
          setPlayerList((prevTeam) =>
            prevTeam.map((p) =>
              p.player === tp.player ? { ...p, x: posX, y: posY } : p
            )
          );
        }, 1000);
        return () => clearTimeout(timer);
      }}
      className="flex absolute flex-col items-center justify-center cursor-grab group"
      style={{
        x,
        y,
      }}
    >
      <div
        className={
          playerTeam === 0
            ? "rounded-4xl h-5 w-5 bg-red-700 active:border-2 active:border-yellow-300 active:cursor-grabbing"
            : "rounded-4xl h-5 w-5 bg-blue-700 active:border-2 active:border-yellow-300 active:cursor-grabbing"
        }
      ></div>
      <label className="absolute mt-10">
        {players
          .find((player) => {
            return player.id === tp?.player;
          })
          ?.nickname?.toUpperCase()}
      </label>
      {tp ? (
        <div
          className={
            panelVisibility === tp.player
              ? "absolute bg-gray-800 rounded-2xl p-2 z-1000 ml-29"
              : "hidden"
          }
        >
          <button
            onClick={() => {
              if (tp.player) {
                setPlayerStatus(tp.player, false);
                setPlayerList((prevTeam) =>
                  prevTeam.map((p) =>
                    p.player === tp.player ? { ...p, onPitch: false } : p
                  )
                );
              }
            }}
            className="rounded-md bg-gray-900 text-white border border-red-900 p-2 cursor-pointer hover:opacity-75 hover:bg-red-900"
          >
            Remover
          </button>
        </div>
      ) : null}
    </motion.div>
  );
}

function Pitch({
  teams,
  team,
  teamPlayers,
  leftTeam,
  rightTeam,
  players,
  setLeftTeam,
  setRightTeam,
  simpleMode,
}: {
  teams: TeamExpanded[];
  team: number;
  teamPlayers: TeamPlayer[][];
  leftTeam: TeamPlayer[];
  rightTeam: TeamPlayer[];
  players: Player[];
  setLeftTeam: Dispatch<SetStateAction<TeamPlayer[]>>;
  setRightTeam: Dispatch<SetStateAction<TeamPlayer[]>>;
  simpleMode: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [panelVisibility, setPanelVisibility] = useState(-1);

  let currentTeamPlayers: TeamPlayer[] = [];
  let currentSetTeamPlayers: Dispatch<SetStateAction<TeamPlayer[]>> =
    setLeftTeam;

  if (team === 0) {
    currentTeamPlayers = leftTeam;
    currentSetTeamPlayers = setLeftTeam;
  } else if (team === 1) {
    currentTeamPlayers = rightTeam;
    currentSetTeamPlayers = setRightTeam;
  }

  const rect = containerRef.current
    ? containerRef.current.getBoundingClientRect()
    : undefined;

  return (
    <div>
      {team !== 2 && (
        <h1 className="text-xl mb-2">{teams[team]?.name?.toUpperCase()}</h1>
      )}

      <motion.div
        ref={containerRef}
        className="flex relative rounded-[19px] border-2 inset-shadow-blue-950/100 border-white bg-gray-500 shadow-[0_0_30px_#6a7282] h-[500px] w-[387.55px] bg-contain bg-[url('/pitch.png')]"
      >
        {simpleMode ? (
          <>
            {leftTeam
              ?.filter((tp) => tp.onPitch)
              .map((tp) => (
                <PitchPlayer
                  key={tp.player}
                  tp={tp}
                  playerTeam={0}
                  players={players}
                  containerRef={containerRef}
                  setPanelVisibility={setPanelVisibility}
                  panelVisibility={panelVisibility}
                  setPlayerList={setLeftTeam}
                  rect={rect}
                  simpleMode={simpleMode}
                />
              ))}
            {rightTeam
              ?.filter((tp) => tp.onPitch)
              .map((tp) => (
                <PitchPlayer
                  key={tp.player}
                  tp={tp}
                  playerTeam={1}
                  players={players}
                  containerRef={containerRef}
                  setPanelVisibility={setPanelVisibility}
                  panelVisibility={panelVisibility}
                  setPlayerList={setRightTeam}
                  rect={rect}
                  simpleMode={simpleMode}
                />
              ))}
          </>
        ) : (
          currentTeamPlayers
            ?.filter((tp) => tp.onPitch)
            .map((tp) => (
              <PitchPlayer
                key={tp.player}
                tp={tp}
                playerTeam={team}
                players={players}
                containerRef={containerRef}
                setPanelVisibility={setPanelVisibility}
                panelVisibility={panelVisibility}
                setPlayerList={currentSetTeamPlayers}
                rect={rect}
                simpleMode={simpleMode}
              />
            ))
        )}
      </motion.div>
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
      swapy.current = createSwapy(container.current, {});
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
              setLeftTeam([...leftTeam, player]);
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
              setRightTeam([...rightTeam, player]);
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
        <div className="flex items-center rounded-md bg-[#202020] text-white gap-0.5">
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
          className="flex flex-row rounded-md bg-[#202020] text-white border border-gray-900 gap-0.5 p-2 cursor-pointer hover:opacity-75"
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
          setTeamPlayers={setLeftTeam}
        />
        <div className="mt-4 flex flex-row justify-center gap-20">
          <Pitch
            teams={teams}
            team={simpleMode ? 2 : 0}
            teamPlayers={teamPlayers}
            leftTeam={leftTeam}
            rightTeam={rightTeam}
            players={players}
            setLeftTeam={setLeftTeam}
            setRightTeam={setRightTeam}
            simpleMode={simpleMode}
          />
          {!simpleMode ? (
            <Pitch
              teams={teams}
              team={1}
              teamPlayers={teamPlayers}
              leftTeam={leftTeam}
              rightTeam={rightTeam}
              players={players}
              setLeftTeam={setLeftTeam}
              setRightTeam={setRightTeam}
              simpleMode={simpleMode}
            />
          ) : null}
        </div>
        <Column
          teamPlayers={rightTeam}
          players={players}
          align="right"
          amount={playerAmount}
          team={teams[1]}
          simpleMode={simpleMode}
          setTeamPlayers={setRightTeam}
        />
      </div>
    </div>
  );
}
