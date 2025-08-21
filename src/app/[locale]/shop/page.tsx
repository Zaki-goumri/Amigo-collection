import Link from "next/link";
import { db } from "@/db";
import { products, productImages } from "@/db/schema";

export default function ShopPage() {
	const list = db.select().from(products).all();
	return (
		<main className="px-6 md:px-10 xl:px-20 py-16 bg-black text-white">
			<header className="flex items-end justify-between mb-10">
				<h1 className="font-serif text-5xl">Shop</h1>
				<div className="flex gap-3">
					<input placeholder="Search" className="bg-black border border-white/20 px-4 py-2" />
					<select className="bg-black border border-white/20 px-4 py-2"><option>All categories</option></select>
				</div>
			</header>
			<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
				{list.map((p) => (
					<Link href={`./product/${p.slug}`} key={p.id} className="group">
						<div className="aspect-[3/4] bg-neutral-900 overflow-hidden">
							<img src={`https://picsum.photos/seed/${p.slug}/900/1200`} alt={p.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
						</div>
						<div className="mt-3 text-sm tracking-wide">{p.name}</div>
						<div className="text-neutral-400 text-sm">{(p.priceCents / 100).toFixed(2)} €</div>
					</Link>
				))}
			</div>
		</main>
	);
} 