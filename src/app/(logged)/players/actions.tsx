"use server";
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
  const result = Array.from(teamGroups.values());

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

  await db
    .insert(teamPlayers)
    .values({ team: teamId, match: matchId, player: playerId, index: 0 });
}
