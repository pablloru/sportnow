import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // All demo images in V1 are local files under /public/images (see
  // scripts/gen_placeholders.py) — no remote image host is needed yet.
  // Add `images.remotePatterns` here once a real News/Sports API
  // supplies remote image URLs.
};

export default withNextIntl(nextConfig);
