import type { ReactNode } from "react";

// Intentionally minimal: this app has no routes outside `/[locale]/...`
// (the static public/index.html handles the bare "/" -> "/ru/" redirect
// — see next.config.ts for why that's a static file instead of
// middleware here), so the actual <html>/<body> tags live in
// app/[locale]/layout.tsx where the active locale is known. This root
// layout only exists because Next.js requires one file at this level.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
