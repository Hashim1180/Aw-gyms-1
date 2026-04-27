import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { appointments } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const appointmentRouter = createRouter({
  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(appointments).orderBy(desc(appointments.createdAt));
  }),

  create: publicQuery
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(1),
      date: z.string().min(1),
      time: z.string().min(1),
      service: z.string().default("general"),
      message: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(appointments).values(input);
      return { id: Number(result[0].insertId), ...input };
    }),

  updateStatus: adminQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(appointments).set({ status: input.status }).where(eq(appointments.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(appointments).where(eq(appointments.id, input.id));
      return { success: true };
    }),
});
