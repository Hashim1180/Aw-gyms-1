import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  real,
  int,
  boolean,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: real("price").notNull(),
  category: mysqlEnum("category", ["supplements", "equipment", "gear", "accessories"]).notNull(),
  imageUrl: text("image_url"),
  stock: int("stock").default(0),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const videos = mysqlTable("videos", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  url: text("url").notNull(),
  section: mysqlEnum("section", ["hero", "atmosphere", "ai", "footer", "promo"]).notNull(),
  active: boolean("active").default(true),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contacts = mysqlTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  message: text("message"),
  source: mysqlEnum("source", ["website", "whatsapp", "ai", "form"]).default("website"),
  status: mysqlEnum("status", ["new", "contacted", "converted", "closed"]).default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiLogs = mysqlTable("ai_logs", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  userMessage: text("user_message"),
  aiResponse: text("ai_response"),
  intent: mysqlEnum("intent", ["product_inquiry", "pricing", "general", "support", "sales"]),
  converted: boolean("converted").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;
export type AiLog = typeof aiLogs.$inferSelect;
export type InsertAiLog = typeof aiLogs.$inferInsert;
