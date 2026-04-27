import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { videos } from "@db/schema";
import { eq } from "drizzle-orm";

export const videoRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(videos).orderBy(videos.sortOrder);
  }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(1),
        url: z.string().min(1),
        section: z.enum(["hero", "atmosphere", "ai", "footer", "promo"]),
        active: z.boolean().default(true),
        sortOrder: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [video] = await db.insert(videos).values(input).$returningId();
      return { id: video.id, ...input };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        url: z.string().optional(),
        section: z.enum(["hero", "atmosphere", "ai", "footer", "promo"]).optional(),
        active: z.boolean().optional(),
        sortOrder: z.number().optional(),
      })
    )
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
