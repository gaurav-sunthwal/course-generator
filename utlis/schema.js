import { pgTable, varchar, integer, text } from "drizzle-orm/pg-core";

// Difine the Courses table structure

export const coursesTable = pgTable("courses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  chapters: text("chapters").notNull(),
  tags: text("tags").notNull(),
  courseId: varchar("courseId").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt", { length: 255 }).notNull(),
  updatedAt: varchar("updatedAt", { length: 255 }).notNull(),
});

export const courseDetails = pgTable("courseDetails", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  estimatedReadingTime: varchar("estimatedReadingTime", {
    length: 255,
  }).notNull(),
  content: text("chapters").notNull(),
  codeExamples: text("codeExamples").notNull(),
  importantNotes: text("importantNotes").notNull(),
  chapterId: varchar("chapterId").notNull(),
  courseId: varchar("courseId").notNull(),
});

// Define the Users table structure
// export const usersTable = pgTable("users", {
//   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
//   name: varchar("name", { length: 255 }).notNull(),
//   email: varchar("email", { length: 255 }).notNull().unique(),
//   password: varchar("password", { length: 255 }).notNull(),
//   isAdmin: boolean("isAdmin").notNull().default(false),
// });
