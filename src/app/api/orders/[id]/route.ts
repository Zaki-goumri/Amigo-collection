import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

const schema = z.object({ status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]) });

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
	const body = await req.json();
	const parsed = schema.safeParse(body);
	if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
	db.update(orders).set({ status: parsed.data.status }).where(eq(orders.id, Number(params.id))).run();
	return NextResponse.json({ ok: true });
} 