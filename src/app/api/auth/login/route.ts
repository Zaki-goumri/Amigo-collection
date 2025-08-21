import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createJwt, setAuthCookie, verifyPassword } from "@/lib/auth";

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(req: NextRequest) {
	const body = await req.json();
	const parsed = schema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	}
	const { email, password } = parsed.data;
	const [admin] = db.select().from(admins).where(eq(admins.email, email)).all();
	if (!admin) {
		return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
	}
	const ok = await verifyPassword(password, admin.passwordHash);
	if (!ok) {
		return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
	}
	const token = await createJwt({ sub: String(admin.id), email: admin.email });
	await setAuthCookie(token);
	return NextResponse.json({ ok: true });
} 