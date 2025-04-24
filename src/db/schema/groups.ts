import { int, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { timestamps } from './timestamps';
import { users } from './users';

export type Group = typeof groups.$inferSelect;

export const groups = sqliteTable('groups', {
	id: int().primaryKey({ autoIncrement: true }), // .$default(generateId),
	name: text(),
	...timestamps,
});

// export const groupRelations = relations(groups, ({ many }) => ({
//     users: many(groupUsers),
// }));

export const groupUsers = sqliteTable('group_users', {
    group: int().notNull().references(() => groups.id),
    user: int().notNull().references(() => users.id),
}, (table) => [
    primaryKey({ columns: [table.user, table.group] })
]);

// export const groupUsersRelations = relations(groupUsers, ({ one }) => ({
//     user: one(users, {
//         fields: [groupUsers.user],
//         references: [users.id],
//     }),
//     group: one(groups, {
//         fields: [groupUsers.group],
//         references: [groups.id],
//     })
// }));
