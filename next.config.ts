import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Deploying to plain Apache/PHP shared hosting (no Node.js runtime
  // available there) rather than a Node-capable host — so this ships
  // as a fully static export instead of a server-rendered build.
  // Every route already has generateStaticParams (see the route
  // table `npm run build` prints), so this doesn't lose any pages;
  // the one thing it gives up is next-intl's proxy/middleware (static
  // export can't run server middleware at all) — public/index.html
  // covers its one real job, the bare "/" -> "/ru/" redirect.
  output: "export",
  trailingSlash: true,
  // Static export has no image-optimization server to call, so
  // next/image just serves the original files unresized/unconverted.
  // All images in V1 are local files under /public/images (see
  // scripts/gen_placeholders.py) — no remote image host is needed yet.
  // Add `images.remotePatterns` here once a real News/Sports API
  // supplies remote image URLs.
  images: { unoptimized: true },
};

export default withNextIntl(nextConfig);
