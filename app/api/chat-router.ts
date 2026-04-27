import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { chatMessages } from "@db/schema";
import { eq, desc } from "drizzle-orm";

const WHATSAPP_NUMBER = "+923497814918";

function generateAIResponse(message: string, name?: string): { response: string; intent: string } {
  const lower = message.toLowerCase();
  const greeting = name ? `Hello ${name}! ` : "Hello! ";

  if (lower.includes("price") || lower.includes("cost") || lower.includes("how much") || lower.includes("expensive")) {
    return {
      response: `${greeting}Our premium gym memberships start from PKR 5,000/month. Personal training packages begin at PKR 15,000/month. Equipment pricing varies — would you like me to connect you with our sales team on WhatsApp for detailed quotes?`,
      intent: "pricing",
    };
  }

  if (lower.includes("join") || lower.includes("membership") || lower.includes("sign up") || lower.includes("register")) {
    return {
      response: `${greeting}I'd love to help you join AW Gyms! We offer Premium, Elite, and Platinum memberships with full access to our luxury facilities, personal training, and nutrition consulting. Shall I book a tour for you or connect you directly via WhatsApp to complete your registration?`,
      intent: "membership",
    };
  }

  if (lower.includes("book") || lower.includes("appointment") || lower.includes("schedule") || lower.includes("tour") || lower.includes("visit")) {
    return {
      response: `${greeting}I'd be delighted to schedule a visit for you! Our luxury facility is open 5AM–11PM daily. You can book through the appointment form on our website, or I can connect you directly on WhatsApp at ${WHATSAPP_NUMBER} for instant booking. What date works best for you?`,
      intent: "appointment",
    };
  }

  if (lower.includes("equipment") || lower.includes("machine") || lower.includes("dumbbell") || lower.includes("treadmill") || lower.includes("product")) {
    return {
      response: `${greeting}We stock premium fitness equipment including hex dumbbells, Olympic benches, treadmills, ellipticals, and gym flooring. We also carry Optimum Nutrition supplements. All products come with warranty and free delivery in major cities. Would you like a product catalog sent to your WhatsApp?`,
      intent: "products",
    };
  }

  if (lower.includes("trainer") || lower.includes("coach") || lower.includes("personal training") || lower.includes("program")) {
    return {
      response: `${greeting}Our certified personal trainers specialize in strength training, HIIT, bodybuilding, and rehabilitation. Packages start at PKR 15,000/month with 3 sessions per week. We also offer customized nutrition plans. Ready to transform your physique? Let me connect you with our head trainer on WhatsApp!`,
      intent: "training",
    };
  }

  if (lower.includes("location") || lower.includes("address") || lower.includes("where") || lower.includes("find")) {
    return {
      response: `${greeting}AW Gyms is located in the heart of the city with premium parking and valet service. We also offer virtual consultations if you prefer. Would you like the exact address sent to your WhatsApp, or shall I book a guided tour for you?`,
      intent: "location",
    };
  }

  if (lower.includes("supplement") || lower.includes("protein") || lower.includes("creatine") || lower.includes("whey")) {
    return {
      response: `${greeting}We are an authorized retailer of Optimum Nutrition Gold Standard Whey (PKR 12,500) and Gold Creatine (PKR 4,500). All supplements are 100% authentic with batch verification. Would you like to place an order or get it delivered? I can connect you on WhatsApp for quick ordering!`,
      intent: "supplements",
    };
  }

  if (lower.includes("hour") || lower.includes("open") || lower.includes("time") || lower.includes("close")) {
    return {
      response: `${greeting}AW Gyms operates 5:00 AM to 11:00 PM, seven days a week. Platinum members enjoy 24/7 access with biometric entry. Holiday hours may vary — would you like me to confirm specific dates via WhatsApp?`,
      intent: "hours",
    };
  }

  if (lower.includes("thank") || lower.includes("bye") || lower.includes("ok") || lower.includes("thanks")) {
    return {
      response: `${greeting}You're very welcome! Remember, your transformation begins with a single step. If you need anything at all — booking, product orders, or just motivation — I'm here 24/7. You can also reach us directly on WhatsApp at ${WHATSAPP_NUMBER}. Stay strong! 💪`,
      intent: "closing",
    };
  }

  return {
    response: `${greeting}Welcome to AW Gyms — where luxury meets performance! I can help you with memberships, personal training, equipment purchases, supplement orders, booking appointments, or answering any questions. What can I assist you with today? You can also reach us on WhatsApp at ${WHATSAPP_NUMBER} for instant support.`,
    intent: "general",
  };
}

export const chatRouter = createRouter({
  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(chatMessages).orderBy(desc(chatMessages.createdAt));
  }),

  send: publicQuery
    .input(z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      message: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { response, intent } = generateAIResponse(input.message, input.name);

      const result = await db.insert(chatMessages).values({
        ...input,
        response,
        intent,
      });

      return {
        id: Number(result[0].insertId),
        response,
        intent,
        whatsappLink: `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}`,
      };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(chatMessages).where(eq(chatMessages.id, input.id));
      return { success: true };
    }),
});
