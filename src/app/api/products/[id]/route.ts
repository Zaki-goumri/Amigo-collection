import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
	slug: z.string().min(1).optional(),
	name: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
	priceCents: z.number().int().nonnegative().optional(),
	category: z.string().min(1).optional(),
	sizes: z.array(z.string()).min(1).optional(),
	colors: z.array(z.string()).min(1).optional(),
	inStock: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
	const [p] = db.select().from(products).where(eq(products.id, Number(params.id))).all();
	if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(p);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
	const json = await req.json();
	const parsed = schema.safeParse(json);
	if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
	db.update(products).set(parsed.data as any).where(eq(products.id, Number(params.id))).run();
	return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
	db.delete(products).where(eq(products.id, Number(params.id))).run();
	return NextResponse.json({ ok: true });
} 