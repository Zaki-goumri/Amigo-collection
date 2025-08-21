"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useCartStore } from "@/store/cart";
import { formatPriceDZD } from "@/lib/currency";

const WILAYAS = [
	"Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar","Blida","Bouira",
	"Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger","Djelfa","Jijel","Sétif","Saïda",
	"Skikda","Sidi Bel Abbès","Annaba","Guelma","Constantine","Médéa","Mostaganem","Msila","Mascara","Ouargla",
	"Oran","El Bayadh","Illizi","Bordj Bou Arréridj","Boumerdès","El Tarf","Tindouf","Tissemsilt","El Oued","Khenchela",
	"Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma","Aïn Témouchent","Ghardaïa","Relizane"
];

export default function CheckoutPage() {
	const { items, load, hydrated, clear } = useCartStore();
	useEffect(() => {
		load();
	}, [load]);
	const safeItems = Array.isArray(items) ? items : [];
	const total = useMemo(() => safeItems.reduce((sum, i) => sum + i.priceCents * i.qty, 0), [safeItems]);
	const [status, setStatus] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatus(null);
		if (safeItems.length === 0) {
			setStatus("Your cart is empty.");
			return;
		}
		setBusy(true);
		try {
			const form = e.currentTarget;
			const formData = new FormData(form);
			const payload = {
				name: String(formData.get("name")),
				phone: String(formData.get("phone1")),
				phone2: String(formData.get("phone2") || ""),
				wilaya: String(formData.get("wilaya")),
				address: String(formData.get("address")),
				items: safeItems.map((i) => ({ productId: i.productId, qty: i.qty, priceCents: i.priceCents, size: i.size, color: i.color })),
			};
			const res = await fetch("/api/orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
			const data = await res.json().catch(() => ({}));
			if (res.ok) {
				setStatus(`Order placed. Total ${formatPriceDZD(data.totalCents ?? total)}`);
				clear();
			} else {
				setStatus(data?.error ? `Error: ${data.error}` : "Could not place order.");
			}
		} finally {
			setBusy(false);
		}
	}

	if (!hydrated) return null;
	return (
		<main className="px-6 md:px-10 xl:px-20 py-16 bg-black text-white">
			<h1 className="font-serif text-5xl mb-8">Checkout</h1>
			<form onSubmit={onSubmit} className="grid md:grid-cols-3 gap-8">
				<section className="md:col-span-2 space-y-4">
					<input name="name" required placeholder="Name" className="w-full bg-black border border-white/20 px-4 py-3" />
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<input name="phone1" required placeholder="Phone number 1" className="w-full bg-black border border-white/20 px-4 py-3" />
						<input name="phone2" placeholder="Phone number 2 (optional)" className="w-full bg-black border border-white/20 px-4 py-3" />
					</div>
					<select name="wilaya" required className="w-full bg-black border border-white/20 px-4 py-3">
						<option value="">Select wilaya</option>
						{WILAYAS.map((w) => (
							<option key={w} value={w}>{w}</option>
						))}
					</select>
					<input name="address" required placeholder="Address" className="w-full bg-black border border-white/20 px-4 py-3" />
					<button disabled={busy} className="border border-white px-6 py-3 uppercase tracking-widest hover:bg-white hover:text-black disabled:opacity-50">{busy ? "Placing…" : "Place order"}</button>
					{status && <p className="text-sm text-neutral-400">{status}</p>}
				</section>
				<aside className="border border-white/20 p-6 self-start">
					<div className="flex justify-between text-sm text-neutral-400">
						<span>Total</span>
						<span>{formatPriceDZD(total)}</span>
					</div>
				</aside>
			</form>
		</main>
	);
} 