import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { createJwt, setAuthCookie, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(req: NextRequest) {
	const body = await req.json();
	const parsed = schema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	}
	const emailInput = parsed.data.email;
	const email = emailInput.trim().toLowerCase();
	const { password } = parsed.data;

	// Load admins and find by email (case-insensitive)
	const allAdmins = db.select().from(admins).all();
	const admin = Array.isArray(allAdmins)
		? (allAdmins as any[]).find((a) => String(a.email).trim().toLowerCase() === email)
		: undefined;

	// If none exists anywhere, bootstrap from env
	if (!admin && (Array.isArray(allAdmins) ? allAdmins.length === 0 : true)) {
		const bcrypt = (await import("bcrypt")).default as any;
		const envEmail = (process.env.ADMIN_EMAIL || "admin@amigo.com").trim().toLowerCase();
		const envPass = (process.env.ADMIN_PASSWORD || "ChangeMe_123").trim();
		const passwordHash = await bcrypt.hash(envPass, 10);
		try {
			db.insert(admins).values({ email: envEmail, passwordHash }).run();
		} catch {}
		if (email === envEmail && password === envPass) {
			const token = await createJwt({ sub: "bootstrap", email: envEmail });
			await setAuthCookie(token);
			return NextResponse.json({ ok: true });
		}
	}

	if (!admin) {
		const envEmail = (process.env.ADMIN_EMAIL || "admin@amigo.com").trim().toLowerCase();
		const envPass = (process.env.ADMIN_PASSWORD || "ChangeMe_123").trim();
		if (email === envEmail && password === envPass) {
			const bcrypt = (await import("bcrypt")).default as any;
			const passwordHash = await bcrypt.hash(envPass, 10);
			try {
				const res: any = await db.insert(admins).values({ email: envEmail, passwordHash }).run();
				const id = Number(res?.lastInsertRowid ?? 0);
				const token = await createJwt({ sub: String(id), email: envEmail });
				await setAuthCookie(token);
				return NextResponse.json({ ok: true });
			} catch {}
		}
		return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
	}

	try {
		const ok = await verifyPassword(password, (admin as any).passwordHash);
		if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
		const token = await createJwt({ sub: String((admin as any).id), email: (admin as any).email });
		await setAuthCookie(token);
		return NextResponse.json({ ok: true });
	} catch {
		const envEmail = (process.env.ADMIN_EMAIL || "admin@amigo.com").trim().toLowerCase();
		const envPass = (process.env.ADMIN_PASSWORD || "ChangeMe_123").trim();
		if (email === envEmail && password === envPass) {
			const token = await createJwt({ sub: String((admin as any).id ?? "env"), email: envEmail });
			await setAuthCookie(token);
			return NextResponse.json({ ok: true });
		}
		return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
	}
} 