import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  grade: integer("grade"),
  role: text("role").default("student"),
  stars: integer("stars").default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  grade: true,
});

// Topics model
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  grade: integer("grade").notNull(),
  category: text("category").notNull(),
  order: integer("order").notNull(),
  island: text("island").notNull(),
  isLocked: boolean("is_locked").default(true),
});

export const insertTopicSchema = createInsertSchema(topics).pick({
  name: true,
  description: true,
  grade: true,
  category: true,
  order: true,
  island: true,
  isLocked: true,
});

// Progress model
export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  topicId: integer("topic_id").notNull(),
  watchCompleted: boolean("watch_completed").default(false),
  testCompleted: boolean("test_completed").default(false),
  practiceCompleted: boolean("practice_completed").default(false),
  teachCompleted: boolean("teach_completed").default(false),
  starsEarned: integer("stars_earned").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProgressSchema = createInsertSchema(progress).pick({
  userId: true,
  topicId: true,
  watchCompleted: true,
  testCompleted: true,
  practiceCompleted: true,
  teachCompleted: true,
  starsEarned: true,
});

// Define the types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type Topic = typeof topics.$inferSelect;

export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = typeof progress.$inferSelect;
