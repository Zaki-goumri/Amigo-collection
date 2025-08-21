"use client";
import { useState } from "react";

export default function NewProductPage() {
	const [status, setStatus] = useState<string | null>(null);
	const [form, setForm] = useState({ slug: "", name: "", description: "", priceCents: 0, category: "", sizes: "XS,S,M,L", colors: "Black,White", inStock: true });

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		const payload = {
			slug: form.slug,
			name: form.name,
			description: form.description,
			priceCents: Number(form.priceCents),
			category: form.category,
			sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
			colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
			inStock: form.inStock,
			images: [],
		};
		const res = await fetch(`/api/products`, { method: "POST", body: JSON.stringify(payload) });
		setStatus(res.ok ? "Created" : "Failed");
	}

	return (
		<main className="min-h-screen bg-black text-white px-6 md:px-10 xl:px-20 py-12">
			<h1 className="font-serif text-4xl mb-6">New Product</h1>
			<form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6">
				<input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} name="slug" placeholder="slug" className="bg-black border border-white/20 px-4 py-3" />
				<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} name="name" placeholder="name" className="bg-black border border-white/20 px-4 py-3" />
				<input value={form.priceCents} onChange={(e) => setForm({ ...form, priceCents: Number(e.target.value) })} name="priceCents" placeholder="priceCents" type="number" className="bg-black border border-white/20 px-4 py-3" />
				<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} name="category" placeholder="category" className="bg-black border border-white/20 px-4 py-3" />
				<input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} name="sizes" placeholder="sizes (comma separated)" className="bg-black border border-white/20 px-4 py-3" />
				<input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} name="colors" placeholder="colors (comma separated)" className="bg-black border border-white/20 px-4 py-3" />
				<label className="flex items-center gap-2 text-sm"><input checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} type="checkbox" name="inStock" /> In stock</label>
				<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} name="description" placeholder="description" className="md:col-span-2 h-40 bg-black border border-white/20 px-4 py-3" />
				<button className="border border-white px-6 py-3 uppercase tracking-widest hover:bg-white hover:text-black">Create</button>
				{status && <p className="text-sm text-neutral-400">{status}</p>}
			</form>
		</main>
	);
} 