import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import { productSchema } from "@/lib/validation";

export async function GET() {
	const list = await db.select().from(products as any).all();
	return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
	const json = await req.json();
	const parsed = productSchema.safeParse(json);
	if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	const { images, ...prod } = parsed.data as any;
	try {
		const insertRes: any = await db.insert(products as any).values(prod).run();
		const productId = Number(insertRes?.lastInsertRowid ?? 0);
		if (Array.isArray(images) && images.length) {
			for (const img of images) {
				await db
					.insert(productImages as any)
					.values({ productId, url: img.url, width: img.width, height: img.height, alt: img.alt })
					.run();
			}
		}
		return NextResponse.json({ id: productId });
	} catch (e: any) {
		const code = e?.code || e?.rawCode || e?.cause?.code;
		const message: string = e?.message || "";
		if (
			code === "SQLITE_CONSTRAINT_UNIQUE" ||
			code === 2067 ||
			/UNIQUE constraint failed: products\.slug/i.test(message)
		) {
			return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
		}
		return NextResponse.json({ error: "Unable to create product" }, { status: 500 });
	}
} 