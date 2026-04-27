import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { contacts } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const contactRouter = createRouter({
  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }),

  create: publicQuery
    .input(
      z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        message: z.string().optional(),
        source: z.enum(["website", "whatsapp", "ai", "form"]).default("website"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [contact] = await db.insert(contacts).values(input).$returningId();
      return { id: contact.id, ...input };
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "converted", "closed"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(contacts).set({ status: input.status }).where(eq(contacts.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(contacts).where(eq(contacts.id, input.id));
      return { success: true };
    }),
});
