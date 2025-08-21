import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";

const schema = z.object({ status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]) });

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
	const { id } = await context.params;
	const numericId = Number(id);
	if (!Number.isFinite(numericId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
	const rows = await db.select().from(orders).where(eq(orders.id, numericId)).all();
	const order = Array.isArray(rows) ? rows[0] : null;
	if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
	const items = await db.select().from(orderItems).where(eq(orderItems.orderId, numericId)).all();
	return NextResponse.json({ order, items });
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
	const { id } = await context.params;
	const body = await req.json();
	const parsed = schema.safeParse(body);
	if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
	const res: any = await db.update(orders).set({ status: parsed.data.status }).where(eq(orders.id, Number(id))).run();
	if (res.changes === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json({ ok: true });
} 