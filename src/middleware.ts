import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const intlMiddleware = createMiddleware({
	locales: ["fr", "en", "ar"],
	defaultLocale: "fr",
	localePrefix: "always"
});

const PUBLIC_FILE = /\.(.*)$/;

async function isAuthenticated(req: NextRequest): Promise<boolean> {
	const token = req.cookies.get("amigo_admin_token")?.value;
	if (!token) return false;
	try {
		await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
		return true;
	} catch {
		return false;
	}
}

export default async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// Skip i18n handling for admin routes
	if (!pathname.startsWith("/admin")) {
		const intlResponse = intlMiddleware(req);
		if (intlResponse) return intlResponse;
	}

	if (
		pathname.startsWith("/admin") &&
		!pathname.startsWith("/admin/login") &&
		!PUBLIC_FILE.test(pathname)
	) {
		const ok = await isAuthenticated(req);
		if (!ok) {
			const url = new URL("/admin/login", req.url);
			return NextResponse.redirect(url);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}; 