import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { aiLogs } from "@db/schema";
import { desc } from "drizzle-orm";

export const aiLogRouter = createRouter({
  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(aiLogs).orderBy(desc(aiLogs.createdAt));
  }),

  create: publicQuery
    .input(
      z.object({
        sessionId: z.string().min(1),
        userMessage: z.string().optional(),
        aiResponse: z.string().optional(),
        intent: z.enum(["product_inquiry", "pricing", "general", "support", "sales"]).optional(),
        converted: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [log] = await db.insert(aiLogs).values(input).$returningId();
      return { id: log.id, ...input };
    }),

  stats: adminQuery.query(async () => {
    const db = getDb();
    const allLogs = await db.select().from(aiLogs);
    const total = allLogs.length;
    const converted = allLogs.filter((l) => l.converted).length;
    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;
    return { total, converted, conversionRate };
  }),
});
