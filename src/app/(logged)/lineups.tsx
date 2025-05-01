"use client";

import { Player } from "@/db";
import { useEffect, useState, useRef } from "react";
import { createSwapy, Swapy } from "swapy";
import { twJoin, twMerge } from "tailwind-merge";

function PlayerItem({
  player,
  align,
}: {
  player: Player;
  align: "left" | "right";
}) {
  return (
    <div
      data-swapy-slot={player.id}
      className="cursor-grab mb-1"
    >
        <div data-swapy-item={player.id} className="flex justify-end items-center gap-4" style={{ flexDirection: align == "left" ? "row" : "row-reverse" }}>
            <span>{player.nickname}</span>
            <div className="rounded-4xl border-black"></div>
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
    <div className={twJoin("flex flex-col w-[200px]")}>
      {Array.from({ length: 11 }, (_, i) => {
        const player = players.at(i);
        return (
          <div key={i} className="h-[40px] w-[100%] bg-red-50">
            {player && (
              <PlayerItem key={player.id} player={player} align={align} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field() {
  return <div className="flex flex-col bg-green-500 w-100 h-150"></div>;
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
      });
    }

    return () => {
      swapy.current?.destroy();
    };
  }, []);

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

  const amount = 8;

  return (
    <div ref={container} className="mt-10 flex flex-row justify-center gap-5">
      <Column players={leftTeam} align="left" amount={amount} />
      <Field />
      <Column players={rightTeam} align="right" amount={amount} />
    </div>
  );
}
