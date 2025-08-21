import { createNavigation } from "next-intl/navigation";

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation({
	locales: ["fr", "en", "ar"],
	localePrefix: "always", // Or "as-needed"
});