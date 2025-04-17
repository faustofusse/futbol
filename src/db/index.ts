import 'dotenv/config';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/libsql';

export const db = drizzle({ 
  schema,
  connection: { 
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN!
  }
});

export * from './schema';
