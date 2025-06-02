"use server";

import { db, players, matches, teams, teamPlayers } from "@/db";
import { and, eq, isNull } from "drizzle-orm";

export async function createPlayer(nickname: string, groupId: number) {
  return db
    .insert(players)
    .values({ nickname, group: groupId })
    .returning()
    .then((p) => p.at(0));
}

export async function deletePlayer(id: number) {
  await db
    .update(players)
    .set({ deleted: Math.floor(Date.now() / 1000) })
    .where(eq(players.id, id));
  await db.delete(teamPlayers).where(eq(teamPlayers.player, id));
}

export async function deleteTeamPlayer(id: number) {
  await db.delete(teamPlayers).where(eq(teamPlayers.player, id));
}

export async function getPlayers(groupId: number) {
  return db
    .select()
    .from(players)
    .where(and(eq(players.group, groupId), isNull(players.deleted)));
}

export async function getTeamPlayers(matchId: number) {
  const team_players = await db
    .select()
    .from(teamPlayers)
    .orderBy(teamPlayers.team);

  const teamGroups = new Map<number, typeof team_players>();
  for (const teamPlayer of team_players) {
    if (!teamGroups.has(teamPlayer.team)) {
      teamGroups.set(teamPlayer.team, []);
    }
    teamGroups.get(teamPlayer.team)!.push(teamPlayer);
  }
  const team0 = teamGroups.get(0) ?? [];
  const team1 = teamGroups.get(1) ?? [];
  const result = [team0, team1];

  return result;
}

export async function getTeams(matchId: number) {
  return db.select().from(teams).where(eq(teams.match, matchId));
}

export async function assignPlayer(
  groupId: number,
  playerId: number,
  teamId: number
) {
  const matchId = (
    await db.select().from(matches).where(eq(matches.group, groupId)).limit(1)
  )[0].id;

  const playerMatch = (
    await db
      .select()
      .from(teamPlayers)
      .where(eq(teamPlayers.player, playerId))
      .limit(1)
  )[0];
  if (playerMatch) {
    await db
      .update(teamPlayers)
      .set({ team: teamId })
      .where(eq(teamPlayers.player, playerId));
  } else {
    await db
      .insert(teamPlayers)
      .values({ team: teamId, match: matchId, player: playerId, index: 0 });
  }
}
