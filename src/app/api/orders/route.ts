import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { checkoutSchema } from "@/lib/validation";
import { inArray } from "drizzle-orm";

export async function GET() {
	const list = db.select().from(orders).all();
	return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
	const json = await req.json();
	const parsed = checkoutSchema.safeParse(json);
	if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	const { name, phone, wilaya, address, items } = parsed.data;

	const productIds = items.map((i) => i.productId);
	const dbProducts = db.select().from(products).where(inArray(products.id, productIds)).all();
	const productMap = new Map(dbProducts.map((p) => [p.id, p] as const));

	let totalCents = 0;
	for (const item of items) {
		const p = productMap.get(item.productId);
		if (!p) return NextResponse.json({ error: "Unknown product" }, { status: 400 });
		totalCents += p.priceCents * item.qty;
	}

	const res = db.insert(orders).values({ customerName: name, phone, wilaya, address, totalCents, status: "pending" }).run();
	const orderId = Number(res.lastInsertRowid);

	for (const item of items) {
		const p = productMap.get(item.productId)!;
		db.insert(orderItems).values({
			orderId,
			productId: p.id,
			nameSnapshot: p.name,
			priceCents: p.priceCents,
			qty: item.qty,
			size: item.size,
			color: item.color,
		}).run();
	}

	return NextResponse.json({ id: orderId, totalCents });
} 