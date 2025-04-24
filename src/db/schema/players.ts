import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './timestamps';
import { users } from './users';
import { groups } from './groups';

export const players = sqliteTable('players', {
	id: int().primaryKey({ autoIncrement: true }), // .$default(generateId),
	user: int().references(() => users.id),
    group: int().references(() => groups.id),
	nickname: text(),
	...timestamps,
});
