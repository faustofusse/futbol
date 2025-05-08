import {
  int,
  sqliteTable,
  text,
  primaryKey,
  foreignKey,
  real,
} from "drizzle-orm/sqlite-core";
import { Nullable } from "@/lib/utils";
import { timestamps } from "./timestamps";
import { groups } from "./groups";
import { Player, players } from "./players";

export type Match = typeof matches.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type TeamPlayer = typeof teamPlayers.$inferSelect;
export type TeamPlayerExpanded = Nullable<TeamPlayer & Player>;
export type TeamExpanded = Team & {
  players?: TeamPlayerExpanded[];
};

export const matches = sqliteTable("matches", {
  id: int().primaryKey({ autoIncrement: true }), // .$default(generateId),
  group: int()
    .notNull()
    .references(() => groups.id),
  date: int(),
  playerAmount: int("player_amount").notNull(),
  ...timestamps,
});

export const teams = sqliteTable(
  "teams",
  {
    id: int().notNull(),
    name: text().notNull(),
    match: int()
      .notNull()
      .references(() => matches.id),
  },
  (table) => [primaryKey({ columns: [table.match, table.id] })]
);

export const teamPlayers = sqliteTable(
  "team_players",
  {
    team: int().notNull(),
    match: int().notNull(),
    player: int()
      .notNull()
      .references(() => players.id),
    index: int().notNull(),
    x: real(),
    y: real(),
  },
  (table) => [
    primaryKey({ columns: [table.match, table.team, table.player] }),
    foreignKey({
      name: "team_players_teams_fk",
      columns: [table.match, table.team],
      foreignColumns: [teams.match, teams.id],
    }),
  ]
);
