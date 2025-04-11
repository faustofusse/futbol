import { sql } from 'drizzle-orm';
import { int } from 'drizzle-orm/sqlite-core';

export const timestamps = {
  created: int().notNull().default(sql`(strftime('%s', 'now'))`),
  updated: int().notNull().default(sql`(strftime('%s', 'now'))`),
  deleted: int(),
};