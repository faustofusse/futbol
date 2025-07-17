"use server";

import { createSession } from "@/lib/sessions";

import { db, matches, groupUsers, groups } from "@/db";
import { and, eq, isNull } from "drizzle-orm";

const defaultPlayerAmount = 8;

export async function getGroups(userId: number) {
  const groupsArray = await db
    .select({ id: groups.id, name: groups.name })
    .from(groups)
    .where(and(eq(groups.id, groupUsers.group), isNull(groups.deleted)))
    .leftJoin(groupUsers, eq(groupUsers.user, userId));
  const matchesList = await db
    .select()
    .from(matches)
    .where(isNull(matches.deleted));

  return { groupsArray, matchesList };
}

export async function createGroup(userId: number, name?: string) {
  const group = await db
    .insert(groups)
    .values({
      name: name,
    })
    .returning()
    .then((p) => p.at(0));
  await db.insert(groupUsers).values({ user: userId, group: group!.id! });

  if (!group) {
    throw new Error("Error creating group");
  }

  return { group };
}

export async function deleteGroup(id: number) {
  await db
    .update(groups)
    .set({ deleted: Math.floor(Date.now() / 1000) })
    .where(eq(groups.id, id));
}

export async function createUserSession(
  userId: number,
  groupId: number,
  matchId?: number
) {
  await createSession(userId, groupId, matchId);
}
