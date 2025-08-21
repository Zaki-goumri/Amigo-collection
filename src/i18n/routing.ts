import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["fr", "en", "ar"],
	defaultLocale: "fr",
});

export const { Link, getPathname, redirect, usePathname, useRouter } = routing; 