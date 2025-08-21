import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterEmails } from "@/db/schema";

export async function POST(req: NextRequest) {
	let email: string | null = null;
	const contentType = req.headers.get("content-type") || "";
	if (contentType.includes("application/json")) {
		const body = await req.json();
		email = body?.email ?? null;
	} else {
		const form = await req.formData();
		email = String(form.get("email"));
	}
	if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
	try {
		db.insert(newsletterEmails).values({ email }).run();
		return NextResponse.json({ ok: true });
	} catch (e) {
		return NextResponse.json({ ok: true });
	}
} 