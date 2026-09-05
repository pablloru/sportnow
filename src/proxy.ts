import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 renamed the `middleware` file convention to `proxy` — this
// still does exactly one job: rewrite/redirect requests so every route
// resolves under a `[locale]` segment (see src/i18n/routing.ts).
export const proxy = createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
