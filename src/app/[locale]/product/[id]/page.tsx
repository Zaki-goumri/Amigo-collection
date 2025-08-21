import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import { notFound } from "next/navigation";
import ProductActions from "@/components/ProductActions";
import { formatPriceDZD } from "@/lib/currency";
import ProductGallery from "@/components/ProductGallery";

export default async function ProductPage({ params }: { params: { id: string } }) {
	const id = Number(params.id);
	if (!Number.isFinite(id)) notFound();
	const pRows = await db.select().from(products as any).all();
	const p: any = Array.isArray(pRows) ? (pRows as any[]).find((row: any) => Number(row.id) === id) : null;
	if (!p) notFound();
	const imgRows = await db.select().from(productImages as any).all();
	const images: any[] = Array.isArray(imgRows) ? (imgRows as any[]).filter((img: any) => Number(img.productId) === id) : [];
	const sizes = (p.sizes as string[]) || [];
	const colors = (p.colors as string[]) || [];
	return (
		<main className="px-6 md:px-10 xl:px-20 py-16 bg-black text-white">
			<div className="grid md:grid-cols-2 gap-12">
				<div>
					<ProductGallery images={images as any} />
				</div>
				<div>
					<h1 className="font-serif text-5xl mb-3">{p.name}</h1>
					<div className="text-neutral-400 mb-3">{formatPriceDZD(p.priceCents)}</div>
					{!p.inStock && <div className="mb-6 inline-block text-[10px] tracking-widest uppercase bg-white text-black px-2 py-1">Out of stock</div>}
					<ProductActions id={p.id} slug={p.slug} name={p.name} priceCents={p.priceCents} inStock={p.inStock} sizes={sizes} colors={colors} />
					<p className="text-neutral-300 mt-10 leading-relaxed">{p.description}</p>
				</div>
			</div>
		</main>
	);
} 