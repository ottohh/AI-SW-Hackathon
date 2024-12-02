import {
  pgTable,
  serial,
  text,
  integer,
  json,
  uuid,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  age: integer('age'),
});

export const dataProduct = pgTable('data_product', {
  id: uuid('id').primaryKey().defaultRandom(),
  metadata: json('metadata'),
  zipPath: text('zip_path').notNull(),
});

