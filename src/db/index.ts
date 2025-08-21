import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const client = createClient({
  url: process.env.DATABASE_URL?.replace('file:', '') || 'file:./amigo.db'
});

export const db = drizzle(client, { schema });