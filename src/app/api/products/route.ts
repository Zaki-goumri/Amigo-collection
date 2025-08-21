import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import { productSchema } from "@/lib/validation";

export async function GET() {
	const list = db.query.products.findMany({ with: { productImages: true } as any }).all?.() ?? db.select().from(products).all();
	return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
	const json = await req.json();
	const parsed = productSchema.safeParse(json);
	if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	const { images, ...prod } = parsed.data as any;
	const res = db.insert(products).values(prod).run();
	const productId = Number(res.lastInsertRowid);
	if (images?.length) {
		for (const img of images) {
			db.insert(productImages).values({ ...img, productId }).run();
		}
	}
	return NextResponse.json({ id: productId });
} 