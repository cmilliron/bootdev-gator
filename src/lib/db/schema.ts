import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  ...timestamps,
  name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  ...timestamps,
});

export type Feed = typeof feeds.$inferSelect; // feeds is the table object in schema.ts
export type User = typeof users.$inferSelect; // feeds is the table object in schema.ts
