"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useCartStore } from "@/store/cart";

export default function CheckoutPage() {
	const { items, load, hydrated, clear } = useCartStore();
	useEffect(() => {
		load();
	}, [load]);
	const total = useMemo(() => items.reduce((sum, i) => sum + i.priceCents * i.qty, 0), [items]);
	const [status, setStatus] = useState<string | null>(null);

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const payload = {
			name: String(formData.get("name")),
			phone: String(formData.get("phone")),
			wilaya: String(formData.get("wilaya")),
			address: String(formData.get("address")),
			items: items.map((i) => ({ productId: i.productId, qty: i.qty, priceCents: i.priceCents, size: i.size, color: i.color })),
		};
		const res = await fetch("/api/orders", { method: "POST", body: JSON.stringify(payload) });
		if (res.ok) {
			const data = await res.json();
			setStatus(`Order placed. Total ${(data.totalCents / 100).toFixed(2)} €`);
			clear();
		} else {
			setStatus("Could not place order.");
		}
	}

	if (!hydrated) return null;
	return (
		<main className="px-6 md:px-10 xl:px-20 py-16 bg-black text-white">
			<h1 className="font-serif text-5xl mb-8">Checkout</h1>
			<form onSubmit={onSubmit} className="grid md:grid-cols-3 gap-8">
				<section className="md:col-span-2 space-y-4">
					<input name="name" required placeholder="Name" className="w-full bg-black border border-white/20 px-4 py-3" />
					<input name="phone" required placeholder="Phone" className="w-full bg-black border border-white/20 px-4 py-3" />
					<input name="wilaya" required placeholder="Wilaya" className="w-full bg-black border border-white/20 px-4 py-3" />
					<input name="address" required placeholder="Address" className="w-full bg-black border border-white/20 px-4 py-3" />
					<button className="border border-white px-6 py-3 uppercase tracking-widest hover:bg-white hover:text-black">Place order</button>
					{status && <p className="text-sm text-neutral-400">{status}</p>}
				</section>
				<aside className="border border-white/20 p-6 self-start">
					<div className="flex justify-between text-sm text-neutral-400">
						<span>Total</span>
						<span>{(total / 100).toFixed(2)} €</span>
					</div>
				</aside>
			</form>
		</main>
	);
} 