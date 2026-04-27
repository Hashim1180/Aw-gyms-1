import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { siteSettings } from "@db/schema";
import { eq } from "drizzle-orm";

export const settingsRouter = createRouter({
  get: publicQuery.input(z.object({ key: z.string() })).query(async ({ input }) => {
    const db = getDb();
    const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, input.key));
    return rows[0]?.value || null;
  }),

  getAll: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(siteSettings);
  }),

  set: adminQuery
    .input(z.object({
      key: z.string().min(1),
      value: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, input.key));
      if (existing.length > 0) {
        await db.update(siteSettings).set({ value: input.value }).where(eq(siteSettings.key, input.key));
      } else {
        await db.insert(siteSettings).values(input);
      }
      return { success: true };
    }),
});
