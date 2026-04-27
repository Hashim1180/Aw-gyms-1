import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { videos } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const videoRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(videos).orderBy(desc(videos.createdAt));
  }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(videos).where(eq(videos.featured, true)).orderBy(desc(videos.createdAt));
  }),

  create: adminQuery
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      url: z.string().min(1),
      thumbnail: z.string().optional(),
      category: z.string().default("promo"),
      featured: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(videos).values(input);
      return { id: Number(result[0].insertId), ...input };
    }),

  update: adminQuery
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      url: z.string().optional(),
      thumbnail: z.string().optional(),
      category: z.string().optional(),
      featured: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(videos).set(data).where(eq(videos.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(videos).where(eq(videos.id, input.id));
      return { success: true };
    }),
});
