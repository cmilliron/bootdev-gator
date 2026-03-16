import { pgTable, timestamp, uuid, text, unique } from "drizzle-orm/pg-core";

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
  user_id: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  ...timestamps,
});

export const feedFollows = pgTable(
  "feed_follows",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    ...timestamps,
    user_id: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    feed_id: uuid("feed_id")
      .references(() => feeds.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [unique().on(t.user_id, t.feed_id)],
);

export type Feed = typeof feeds.$inferSelect; // feeds is the table object in schema.ts
export type User = typeof users.$inferSelect; // user is the table object in schema.ts
export type FeedFollow = typeof feedFollows.$inferSelect; // feedFollow is the table object in schema.ts
export type FollowFeedForPrint = FeedFollow & Feed & User;
