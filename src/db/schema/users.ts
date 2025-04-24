import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './timestamps';

export type User = typeof users.$inferSelect;

export const users = sqliteTable('users', {
	id: int().primaryKey({ autoIncrement: true }), // .$default(generateId),
	email: text(),
	firstName: text('first_name'),
	lastName: text('last_name'),
	...timestamps,
});

// export const usersRelations = relations(users, ({ many }) => ({
//     groups: many(groupUsers),
// }));
