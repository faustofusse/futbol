"use client";

import { Player } from "@/db";
import { useEffect, useState, useRef } from "react";
import { createSwapy, Swapy } from "swapy";
import { twJoin, twMerge } from "tailwind-merge";

function PlayerItem({ player }: { player: Player }) {
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
  players: Player[];
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
    <div className="flex flex-row gap-4">
      <img
        src="pitch.png"
        draggable="false"
        className="select-none h-[500px] static"
      ></img>
    </div>
  );
}

export function Lineups({ players }: { players: Player[] }) {
  const [leftTeam, setLeftTeam] = useState(players.slice(0, 5));
  const [rightTeam, setRightTeam] = useState(players.slice(5, 10));
  const [simpleMode, setSimpleMode] = useState(true);

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

  const amount = 8;

  return (
    <div className="flex flex-col justify-center">
      <button
        className="cursor-pointer hover:opacity-75"
        onClick={() => setSimpleMode(!simpleMode)}
      >
        Mode {simpleMode ? "'simple'" : "'double'"}
      </button>
      <div ref={container} className="mt-10 flex flex-row justify-center gap-5">
        <Column players={leftTeam} align="left" amount={amount} />
        <Field />
        {simpleMode === false ? <Field /> : null}
        <Column players={rightTeam} align="right" amount={amount} />
      </div>
    </div>
  );
}
