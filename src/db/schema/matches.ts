import { int, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { timestamps } from './timestamps';
import { groups } from './groups';
import { players } from './players';

export const matches = sqliteTable('matches', {
	id: int().primaryKey({ autoIncrement: true }), // .$default(generateId),
    group: int().references(() => groups.id),
    date: int(),
	...timestamps,
});

export const teams = sqliteTable('teams', {
    match: int().references(() => matches.id),
    name: text().notNull(),
}, (table) => [
    primaryKey({ columns: [table.match, table.name] })
]);

export const teamPlayers = sqliteTable('team_players', {
    team: int().references(() => matches.id),
    player: int().references(() => players.id),
}, (table) => [
    primaryKey({ columns: [table.team, table.player] })
]);
