"use client";

import { Player } from "@/db";
import { useEffect, useState, useRef } from "react";
import { createSwapy, Swapy } from "swapy";
import { twJoin, twMerge } from "tailwind-merge";

// function PlayerSlot({
// }: {

// }) {
//   return (
//   );
// }

function PlayerItem({
  player,
  align,
}: {
  player: Player;
  align: "left" | "right";
}) {
  return (
    <div
      data-swapy-item={player.id}
      className="group flex justify-end items-center gap-2 cursor-grab data-swapy-dragging:cursor-grabbing"
      style={{ flexDirection: align == "left" ? "row" : "row-reverse" }}
    >
      <span className="group-data-swapy-dragging:font-bold">
        {player.nickname}
      </span>
      <div className="rounded-4xl h-5 bg-black aspect-square group-data-swapy-dragging:border-yellow-300 group-data-swapy-dragging:border-2"></div>
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
    <div className="flex flex-col bg-[#2b2b2b] p-2 rounded-2xl">
      {Array.from({ length: 11 }, (_, i) => {
        const player = players.at(i);
        return (
          <div
            key={i}
            data-swapy-slot={`${align}-${i}`}
            className="flex min-w-[200px] justify-start h-[40px] w-[100%]"
            style={{ flexDirection: align == "left" ? "row-reverse" : "row" }}
          >
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
  return <img src="pitch.png" className="h-[500px] static"></img>;
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
