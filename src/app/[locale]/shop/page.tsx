import Link from "next/link";
import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import { formatPriceDZD } from "@/lib/currency";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = {
	q?: string;
	category?: string;
	after?: string; // last seen id for keyset pagination
	limit?: string;
};

export default async function ShopPage({ params, searchParams }: { params: { locale: string }; searchParams: SearchParams }) {
	const locale = params.locale;
	const q = (searchParams.q || "").trim().toLowerCase();
	const category = (searchParams.category || "").trim().toLowerCase();
	const afterId = searchParams.after ? Number(searchParams.after) : undefined;
	const limit = Math.max(1, Math.min(48, Number(searchParams.limit ?? 12))) || 12;

	const all = await db.select().from(products as any).orderBy((products as any).id).all();
	const imgRows = await db.select().from(productImages as any).all();
	const imgs = Array.isArray(imgRows) ? imgRows as any[] : [];
	const firstImageByProductId = new Map<number, any>();
	for (const img of imgs) {
		const pid = Number((img as any).productId);
		if (!firstImageByProductId.has(pid)) firstImageByProductId.set(pid, img);
	}

	let filtered = all as any[];
	if (q) {
		filtered = filtered.filter((p) =>
			p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
		);
	}
	if (category) {
		filtered = filtered.filter((p) => p.category.toLowerCase() === category);
	}
	if (typeof afterId === "number" && !Number.isNaN(afterId)) {
		filtered = filtered.filter((p) => p.id > afterId);
	}

	const list = filtered.slice(0, limit);
	const categories = Array.from(new Set((all as any[]).map((r) => r.category))).filter(Boolean) as string[];
	const nextAfter = list.length > 0 ? String(list[list.length - 1]!.id) : undefined;

	function buildUrl(overrides: Partial<SearchParams>) {
		const sp = new URLSearchParams();
		const merged: SearchParams = { q: searchParams.q, category: searchParams.category, limit: String(limit), ...overrides };
		if (merged.q) sp.set("q", merged.q);
		if (merged.category) sp.set("category", merged.category);
		if (merged.after) sp.set("after", merged.after);
		if (merged.limit) sp.set("limit", merged.limit);
		const qs = sp.toString();
		return `/${locale}/shop${qs ? `?${qs}` : ""}`;
	}

	return (
		<main className="px-6 md:px-10 xl:px-20 py-16 bg-black text-white">
			<header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
				<h1 className="font-serif text-5xl">Shop</h1>
				<form action={`/${locale}/shop`} method="get" className="flex gap-3 items-center">
					<input name="q" defaultValue={searchParams.q} placeholder="Search" className="bg-black border border-white/20 px-4 py-2" />
					<select name="category" defaultValue={searchParams.category} className="bg-black border border-white/20 px-4 py-2">
						<option value="">All categories</option>
						{categories.map((c) => (
							<option key={c} value={c}>{c}</option>
						))}
					</select>
					<input type="hidden" name="limit" value={String(limit)} />
					<button className="border border-white px-4 py-2 uppercase tracking-widest hover:bg-white hover:text-black">Apply</button>
				</form>
			</header>

			<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
				{list.map((p) => {
					const firstImg = firstImageByProductId.get(Number(p.id));
					return (
						<Link href={`/${locale}/product/${p.id}`} key={p.id} className="group">
							<div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden">
								{!p.inStock && <span className="absolute left-2 top-2 z-10 text-[10px] tracking-widest uppercase bg-white text-black px-2 py-1">Out of stock</span>}
								{firstImg ? (
									<img src={firstImg.url} alt={firstImg.alt || p.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
								) : (
									<div className="w-full h-full bg-neutral-800" />
								)}
							</div>
							<div className="mt-3 text-sm tracking-wide">{p.name}</div>
							<div className="text-neutral-400 text-sm">{formatPriceDZD(p.priceCents)}</div>
						</Link>
					);
				})}
			</div>

			<div className="mt-10 flex justify-center">
				{nextAfter && list.length === limit && (
					<Link href={buildUrl({ after: nextAfter })} className="border border-white px-6 py-3 uppercase tracking-widest hover:bg-white hover:text-black">Load more</Link>
				)}
			</div>
		</main>
	);
} 