import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware wrappers around next/link, next/navigation.
// Always import Link/useRouter/usePathname from here (never from "next/link"
// or "next/navigation" directly) so URLs are automatically prefixed with
// the current locale, e.g. `/ru/football`.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
