"use server";

import {
  db,
  matches,
  teams as teamsTable,
  TeamExpanded,
  players as playersTable,
  teamPlayers,
} from "@/db";
import {
  and,
  eq,
  isNull,
  desc,
  isNotNull,
  getTableColumns,
  sql,
} from "drizzle-orm";

const defaultPlayerAmount = 8;

export async function getMatches(groupId: number) {
  return db
    .select()
    .from(matches)
    .where(
      and(
        eq(matches.group, groupId),
        isNotNull(matches.date),
        isNull(matches.deleted)
      )
    );
}

export async function createMatch(groupId: number) {
  // busco si ya hay un partido para ver la cantidad de jugadores
  const playerAmount = await db
    .select({ playerAmount: matches.playerAmount })
    .from(matches)
    .where(eq(matches.group, groupId))
    .orderBy(desc(matches.created))
    .then((p) => p.at(0)?.playerAmount);

  // creo el partido
  const match = await db
    .insert(matches)
    .values({
      group: groupId,
      playerAmount: playerAmount ?? defaultPlayerAmount,
    })
    .returning()
    .then((p) => p.at(0));

  if (!match) {
    throw new Error("Error creating match");
  }

  // creo los equipos
  const teams = [
    { match: match?.id, id: 0, name: "CLARO" },
    { match: match?.id, id: 1, name: "OSCURO" },
  ];
  console.log("teams", teams);
  await db.insert(teamsTable).values(teams);

  return { match, teams };
}

export async function getCurrentMatch(groupId: number) {
  // busco un partido sin fecha
  const match = await db
    .select()
    .from(matches)
    .where(
      and(
        eq(matches.group, groupId),
        isNull(matches.date),
        isNull(matches.deleted)
      )
    )
    .orderBy(desc(matches.created))
    .then((p) => p.at(0));

  // si no hay, creo uno
  if (!match) {
    return createMatch(groupId);
  }

  // busco los equipos
  const teams: TeamExpanded[] = await db
    .select()
    .from(teamsTable)
    .where(eq(teamsTable.match, match.id));

  // busco los jugadores
  for (const team of teams) {
    team.players = await db
      .select({
        ...getTableColumns(teamPlayers),
        ...getTableColumns(playersTable),
      })
      .from(teamPlayers)
      .leftJoin(playersTable, eq(teamPlayers.player, playersTable.id))
      .where(
        and(eq(teamPlayers.match, team.match), eq(teamPlayers.team, team.id))
      );
  }

  return { match, teams };
}

export async function deleteMatch(id: number) {
  await db
    .update(matches)
    .set({ deleted: Math.floor(Date.now() / 1000) })
    .where(eq(matches.id, id));
}

export async function changeMatchPA(id: number, newAmount: number) {
  await db
    .update(matches)
    .set({ playerAmount: newAmount })
    .where(eq(matches.id, id));
}
