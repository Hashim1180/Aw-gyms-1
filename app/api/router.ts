import { authRouter } from "./auth-router";
import { productRouter } from "./product-router";
import { videoRouter } from "./video-router";
import { contactRouter } from "./contact-router";
import { aiLogRouter } from "./ai-log-router";
import { dashboardRouter } from "./dashboard-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  product: productRouter,
  video: videoRouter,
  contact: contactRouter,
  aiLog: aiLogRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
