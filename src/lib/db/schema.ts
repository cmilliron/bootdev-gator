import {
  pgTable,
  timestamp,
  uuid,
  text,
  unique,
  PgTable,
} from "drizzle-orm/pg-core";

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
  lastFetchedAt: timestamp("last_fetched_at"),
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

// A post is a single entry from a feed. It should have:

// id - a unique identifier for the post
// created_at - the time the record was created
// updated_at - the time the record was last updated
// title - the title of the post
// url - the URL of the post (this should be unique)
// description - the description of the post
// published_at - the time the post was published
// feed_id - the ID of the feed that the post came from

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  ...timestamps,
  title: text("title").notNull(),
  url: text("url").notNull().unique(),
  description: text("description"),
  publishedAt: timestamp("published_at"),
  feedId: uuid("feed_id")
    .references(() => feeds.id, { onDelete: "cascade" })
    .notNull(),
});

export type Feed = typeof feeds.$inferSelect; // feeds is the table object in schema.ts
export type User = typeof users.$inferSelect; // user is the table object in schema.ts
export type FeedFollow = typeof feedFollows.$inferSelect; // feedFollow is the table object in schema.ts
export type FeedFollowAllData = {
  feed_follows: FeedFollow;
  feeds: Feed;
  users: User;
};
export type Post = typeof posts.$inferSelect;
export type PostForSubmition = typeof posts.$inferInsert;
