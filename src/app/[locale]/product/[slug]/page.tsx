import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default function ProductPage({ params }: { params: { slug: string } }) {
	const [p] = db.select().from(products).where(eq(products.slug, params.slug)).all();
	if (!p) notFound();
	return (
		<main className="px-6 md:px-10 xl:px-20 py-16 bg-black text-white">
			<div className="grid md:grid-cols-2 gap-12">
				<div className="aspect-[3/4] bg-neutral-900">
					<img src={`https://picsum.photos/seed/${p.slug}/1200/1600`} alt={p.name} className="w-full h-full object-cover" />
				</div>
				<div>
					<h1 className="font-serif text-5xl mb-3">{p.name}</h1>
					<div className="text-neutral-400 mb-8">{(p.priceCents / 100).toFixed(2)} €</div>
					<div className="space-y-6">
						<div>
							<div className="uppercase text-sm tracking-widest mb-2">Size</div>
							<div className="flex gap-2">
								{(p.sizes as unknown as string[]).map((s) => (
									<button key={s} className="border border-white/30 px-3 py-2 text-sm hover:bg-white hover:text-black transition-colors">{s}</button>
								))}
							</div>
						</div>
						<div>
							<div className="uppercase text-sm tracking-widest mb-2">Color</div>
							<div className="flex gap-2">
								{(p.colors as unknown as string[]).map((c) => (
									<button key={c} className="border border-white/30 px-3 py-2 text-sm hover:bg-white hover:text-black transition-colors">{c}</button>
								))}
							</div>
						</div>
						<button className="mt-6 border border-white px-6 py-3 uppercase tracking-widest hover:bg-white hover:text-black transition-colors">Add to cart</button>
					</div>
					<p className="text-neutral-300 mt-10 leading-relaxed">{p.description}</p>
				</div>
			</div>
		</main>
	);
} 