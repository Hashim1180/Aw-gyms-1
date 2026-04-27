import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products, contacts, aiLogs } from "@db/schema";
import { sql } from "drizzle-orm";

export const dashboardRouter = createRouter({
  stats: adminQuery.query(async () => {
    const db = getDb();
    const productCount = await db.select({ count: sql<number>`count(*)` }).from(products);
    const contactCount = await db.select({ count: sql<number>`count(*)` }).from(contacts);
    const aiLogCount = await db.select({ count: sql<number>`count(*)` }).from(aiLogs);
    const convertedCount = await db.select({ count: sql<number>`count(*)` }).from(aiLogs).where(sql`${aiLogs.converted} = true`);
    
    const totalProducts = productCount[0]?.count ?? 0;
    const totalContacts = contactCount[0]?.count ?? 0;
    const totalAiLogs = aiLogCount[0]?.count ?? 0;
    const totalConverted = convertedCount[0]?.count ?? 0;
    const conversionRate = totalAiLogs > 0 ? Math.round((totalConverted / totalAiLogs) * 100) : 0;
    
    return {
      totalProducts,
      totalContacts,
      totalAiLogs,
      conversionRate,
      revenue: totalConverted * 4999, // Simulated revenue
    };
  }),
});
