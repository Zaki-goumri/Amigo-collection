"use client";
import { useEffect, useState } from "react";
import { http } from "@/lib/http";
import Link from "next/link";

export default function AdminOrdersPage() {
	const [data, setData] = useState<any[]>([]);
	useEffect(() => {
		let mounted = true;
		http.get("/api/orders").then((r) => { if (mounted) setData(Array.isArray(r.data) ? r.data : []); });
		return () => { mounted = false; };
	}, []);
	async function updateStatus(id: number, status: string) {
		await http.patch(`/api/orders/${id}`, { status });
		const r = await http.get("/api/orders");
		setData(Array.isArray(r.data) ? r.data : []);
	}
	return (
		<main className="min-h-screen bg-black text-white px-6 md:px-10 xl:px-20 py-12">
			<h1 className="font-serif text-4xl mb-6">Orders</h1>
			<table className="w-full text-sm">
				<thead className="text-left text-neutral-400">
					<tr>
						<th className="py-2">ID</th>
						<th>Customer</th>
						<th>Total</th>
						<th>Status</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{data.map((o: any) => (
						<tr key={o.id} className="border-t border-white/10">
							<td className="py-2"><Link href={`/admin/orders/${o.id}`} className="underline">{o.id}</Link></td>
							<td>{o.customerName}</td>
							<td>{(o.totalCents / 100).toFixed(2)} DA</td>
							<td>
								<select className="bg-black border border-white/20 px-2 py-1" defaultValue={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
									{["pending","confirmed","shipped","delivered","cancelled"].map((s) => (
										<option key={s} value={s}>{s}</option>
									))}
								</select>
							</td>
							<td><Link href={`/admin/orders/${o.id}`} className="underline">View</Link></td>
						</tr>
					))}
				</tbody>
			</table>
		</main>
	);
} 