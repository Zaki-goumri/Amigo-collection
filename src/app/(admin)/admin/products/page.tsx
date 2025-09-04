import Link from "next/link";
import { db } from "@/db";
import { products } from "@/db/schema";
import AdminProductActions from "@/components/AdminProductActions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
	const rows = await db.select().from(products).all();
	const list = Array.isArray(rows) ? rows : [];
	return (
		<main className="min-h-screen bg-black text-white px-6 md:px-10 xl:px-20 py-12">
			<header className="flex items-center justify-between mb-8">
				<h1 className="font-serif text-4xl">Products</h1>
				<Link href="/admin/products/new" className="border border-white px-4 py-2 uppercase tracking-widest hover:bg-white hover:text-black">New</Link>
			</header>
			<table className="w-full text-sm">
				<thead className="text-left text-neutral-400">
					<tr>
						<th className="py-2">ID</th>
						<th>Name</th>
						<th>Price</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{list.map((p) => (
						<tr key={p.id} className="border-t border-white/10">
							<td className="py-2">{p.id}</td>
							<td>{p.name}</td>
							<td>{(p.priceCents / 100).toFixed(2)} DA</td>
							<td className="text-right">
								<AdminProductActions id={p.id} name={p.name} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</main>
	);
} 