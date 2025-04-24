'use server';

import { db, players } from "@/db";
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
}

export async function getPlayers(groupId: number) {
    return db
        .select()
        .from(players)
        .where(and(eq(players.group, groupId), isNull(players.deleted)));
}
