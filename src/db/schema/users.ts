import { int, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { timestamps } from './timestamps';

function generateId(): number {
	return 0;
}

export const users = sqliteTable('users', {
	id: int().primaryKey({ autoIncrement: true }), // .$default(generateId),
	email: text(),
	firstName: text('first_name'),
	lastName: text('last_name'),
	...timestamps,
});

export type User = typeof users.$inferSelect;

export const groups = sqliteTable('groups', {
	id: int().primaryKey({ autoIncrement: true }), // .$default(generateId),
	name: text(),
	...timestamps,
});

export const players = sqliteTable('players', {
	id: int().primaryKey({ autoIncrement: true }), // .$default(generateId),
	user: int().references(() => users.id),
    group: int().references(() => groups.id),
	nickname: text(),
	...timestamps,
});

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