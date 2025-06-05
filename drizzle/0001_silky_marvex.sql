PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_team_players` (
	`team` integer NOT NULL,
	`match` integer NOT NULL,
	`player` integer NOT NULL,
	`index` integer NOT NULL,
	`x` real,
	`y` real,
	`is_active` integer DEFAULT false NOT NULL,
	PRIMARY KEY(`match`, `team`, `player`),
	FOREIGN KEY (`player`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`match`,`team`) REFERENCES `teams`(`match`,`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_team_players`("team", "match", "player", "index", "x", "y", "is_active") SELECT "team", "match", "player", "index", "x", "y", "is_active" FROM `team_players`;--> statement-breakpoint
DROP TABLE `team_players`;--> statement-breakpoint
ALTER TABLE `__new_team_players` RENAME TO `team_players`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_teams` (
	`id` integer NOT NULL,
	`name` text NOT NULL,
	`match` integer NOT NULL,
	PRIMARY KEY(`match`, `id`),
	FOREIGN KEY (`match`) REFERENCES `matches`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_teams`("id", "name", "match") SELECT "id", "name", "match" FROM `teams`;--> statement-breakpoint
DROP TABLE `teams`;--> statement-breakpoint
ALTER TABLE `__new_teams` RENAME TO `teams`;--> statement-breakpoint
CREATE TABLE `__new_group_users` (
	`group` integer NOT NULL,
	`user` integer NOT NULL,
	PRIMARY KEY(`user`, `group`),
	FOREIGN KEY (`group`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_group_users`("group", "user") SELECT "group", "user" FROM `group_users`;--> statement-breakpoint
DROP TABLE `group_users`;--> statement-breakpoint
ALTER TABLE `__new_group_users` RENAME TO `group_users`;--> statement-breakpoint
CREATE TABLE `__new_matches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group` integer NOT NULL,
	`date` integer,
	`player_amount` integer NOT NULL,
	`created` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`deleted` integer,
	FOREIGN KEY (`group`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_matches`("id", "group", "date", "player_amount", "created", "updated", "deleted") SELECT "id", "group", "date", "player_amount", "created", "updated", "deleted" FROM `matches`;--> statement-breakpoint
DROP TABLE `matches`;--> statement-breakpoint
ALTER TABLE `__new_matches` RENAME TO `matches`;