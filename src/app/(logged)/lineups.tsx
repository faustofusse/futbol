"use client";

import { Player, Match, Team, TeamExpanded } from "@/db";
import { Nullable } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { createSwapy, Swapy } from "swapy";
import { twJoin, twMerge } from "tailwind-merge";
import Image from "next/image";

function PlayerItem({ player }: { player: Nullable<Player> }) {
  return (
    <div
      data-swapy-item={player.id}
      className="group flex justify-start items-center gap-2 p-2 cursor-grab data-swapy-dragging:cursor-grabbing group-data-[align=left]:flex-row group-data-[align=right]:flex-row-reverse"
    >
      <span className="select-none group-data-swapy-dragging:font-bold">
        {player.nickname}
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
  players,
  align,
}: {
  amount: number;
  players: Nullable<Player>[];
  align: "left" | "right";
}) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: amount }, (_, i) => {
        const player = players.at(i);
        return (
          <PlayerSlot key={i} index={i} align={align}>
            {player && <PlayerItem player={player} />}
          </PlayerSlot>
        );
      })}
    </div>
  );
}

function Field() {
  return (
    <div className="flex flex-row gap-4 rounded-xl shadow-amber-300-2xl">
      <img
        src="pitch.png"
        draggable="false"
        className="select-none h-[500px] static"
      ></img>
    </div>
  );
}

export function Lineups({
  match,
  teams,
  players,
}: {
  match: Match;
  teams: TeamExpanded[];
  players: Player[];
}) {
  const [leftTeam, setLeftTeam] = useState(players.slice(0, 5));
  const [rightTeam, setRightTeam] = useState(players.slice(5, 10));
  const [simpleMode, setSimpleMode] = useState(true);
  const [playerAmount, setPlayerAmount] = useState(8);
  const options = [5, 6, 7, 8, 9, 10, 11];

  const swapy = useRef<Swapy>(null);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      swapy.current = createSwapy(container.current, {
        // manualSwap: true
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
                onClick={() => setPlayerAmount(value)}
                className="peer hidden"
              />
              <span
                className={`${
                  value === playerAmount
                    ? "peer-checked:bg-white peer-checked:text-black rounded-md p-2 duration-500"
                    : "hover:bg-gray-800 cursor-pointer rounded-md p-2 duration-500"
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
          players={teams.at(0)?.players ?? []}
          align="left"
          amount={playerAmount}
        />
        <Field />
        {simpleMode === false ? <Field /> : null}
        <Column
          players={teams.at(1)?.players ?? []}
          align="right"
          amount={playerAmount}
        />
      </div>
    </div>
  );
}
