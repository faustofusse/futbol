"use server";

import { db, players, matches, teamPlayers } from "@/db";
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

export async function deleteTeamPlayer(id: number, matchId: number) {
  await db
    .delete(teamPlayers)
    .where(and(eq(teamPlayers.player, id), eq(teamPlayers.match, matchId)));
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
    .where(eq(teamPlayers.match, matchId))
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

export async function assignPlayer(
  groupId: number,
  playerId: number,
  index: number,
  teamId: number,
  matchId: number
) {
  const match = (
    await db
      .select()
      .from(matches)
      .where(and(eq(matches.group, groupId), eq(matches.id, matchId)))
      .limit(1)
  )[0];

  const player = (
    await db
      .select()
      .from(teamPlayers)
      .where(
        and(eq(teamPlayers.player, playerId), eq(teamPlayers.match, matchId))
      )
      .limit(1)
  )[0];
  if (index === -1) {
    const teamPlayers = await getTeamPlayers(match.id);
    const takenPositions = new Set(teamPlayers[teamId].map((tp) => tp.index));
    for (let i = 0; i < match.playerAmount; i++) {
      if (!takenPositions.has(i)) {
        index = i;
        break;
      }
    }
  }
  if (player) {
    await db
      .update(teamPlayers)
      .set({ team: teamId, index: index })
      .where(
        and(eq(teamPlayers.player, playerId), eq(teamPlayers.match, matchId))
      );
  } else {
    await db.insert(teamPlayers).values({
      team: teamId,
      match: match.id,
      player: playerId,
      index: index,
      onPitch: false,
    });
  }
}

export async function setPlayerStatus(
  id: number,
  status: boolean,
  matchId: number,
  index: number
) {
  await db
    .update(teamPlayers)
    .set({ onPitch: status, index: index })
    .where(and(eq(teamPlayers.player, id), eq(teamPlayers.match, matchId)));
}

export async function setPlayerPosition(
  id: number,
  x: number,
  y: number,
  matchId: number
) {
  await db
    .update(teamPlayers)
    .set({ x: x, y: y })
    .where(and(eq(teamPlayers.player, id), eq(teamPlayers.match, matchId)));
}
