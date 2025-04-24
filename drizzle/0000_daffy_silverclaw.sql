-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
CREATE TABLE `groups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`created` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`deleted` integer
);
--> statement-breakpoint
CREATE TABLE `matches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group` integer,
	`date` integer,
	`created` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`deleted` integer,
	FOREIGN KEY (`group`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user` integer,
	`group` integer,
	`nickname` text,
	`created` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`deleted` integer,
	FOREIGN KEY (`group`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `team_players` (
	`team` integer,
	`player` integer,
	PRIMARY KEY(`team`, `player`),
	FOREIGN KEY (`player`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team`) REFERENCES `matches`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`match` integer,
	`name` text NOT NULL,
	PRIMARY KEY(`match`, `name`),
	FOREIGN KEY (`match`) REFERENCES `matches`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text,
	`first_name` text,
	`last_name` text,
	`created` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`deleted` integer
);
--> statement-breakpoint
CREATE TABLE `group_users` (
	`group` integer NOT NULL,
	`user` integer NOT NULL,
	PRIMARY KEY(`group`, `user`),
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`group`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action
);
