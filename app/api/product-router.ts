import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const productRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(products).orderBy(desc(products.createdAt));
  }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(products).where(eq(products.featured, true)).orderBy(desc(products.createdAt));
  }),

  byCategory: publicQuery.input(z.object({ category: z.string() })).query(async ({ input }) => {
    const db = getDb();
    return db.select().from(products).where(eq(products.category, input.category)).orderBy(desc(products.createdAt));
  }),

  getById: publicQuery.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = getDb();
    const rows = await db.select().from(products).where(eq(products.id, input.id));
    return rows[0] || null;
  }),

  create: adminQuery
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      price: z.string().min(1),
      image: z.string().min(1),
      category: z.string().default("equipment"),
      featured: z.boolean().default(false),
      inStock: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(products).values(input);
      return { id: Number(result[0].insertId), ...input };
    }),

  update: adminQuery
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      price: z.string().optional(),
      image: z.string().optional(),
      category: z.string().optional(),
      featured: z.boolean().optional(),
      inStock: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(products).set(data).where(eq(products.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),
});
