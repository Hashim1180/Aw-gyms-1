import { authRouter } from "./auth-router";
import { productRouter } from "./product-router";
import { videoRouter } from "./video-router";
import { appointmentRouter } from "./appointment-router";
import { chatRouter } from "./chat-router";
import { settingsRouter } from "./settings-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  product: productRouter,
  video: videoRouter,
  appointment: appointmentRouter,
  chat: chatRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
