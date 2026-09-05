import type { ReactNode } from "react";

// Intentionally minimal: this app has no routes outside `/[locale]/...`
// (the proxy in src/proxy.ts redirects every request to a locale-prefixed
// path), so the actual <html>/<body> tags live in app/[locale]/layout.tsx
// where the active locale is known. This root layout only exists because
// Next.js requires one file at this level.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
