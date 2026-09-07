import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FavoriteToast } from "@/components/layout/FavoriteToast";
import "../globals.css";
// Condensed display face for headlines/scores/kickers — the "sports
// broadcast" texture the rest of the chrome is built around. Loaded from
// @fontsource (bundled as a local static asset, no runtime request to
// Google Fonts) rather than next/font/google, which needs to reach
// fonts.googleapis.com at build time; each weight file below already
// covers Latin + Cyrillic, so it renders identically in both locales.
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/600.css";
import "@fontsource/oswald/700.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("defaultTitle"),
      template: `%s — ${t("siteName")}`,
    },
    description: t("defaultDescription"),
    alternates: { canonical: `/${locale}`, languages: localeAlternates((l) => `/${l}`) },
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      title: t("defaultTitle"),
      description: t("defaultDescription"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("defaultTitle"),
      description: t("defaultDescription"),
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Sets data-theme (which globals.css keys its light-theme
         * overrides off of) from localStorage before the page paints,
         * so a returning visitor who chose light mode never sees a
         * flash of dark first. Deliberately a plain inline script, not
         * a React-rendered attribute — the server has no idea what a
         * given visitor's browser has stored, so this can only run
         * client-side, synchronously, ahead of everything else. See
         * src/lib/theme.ts for the same logic used after this point. */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('sportsnew:theme');" +
              "if(t!=='light'&&t!=='dark'){t='dark'}" +
              "document.documentElement.setAttribute('data-theme',t);}catch(e){}})();",
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-[var(--background)] font-sans text-[var(--foreground)] antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FavoriteToast />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
