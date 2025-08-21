"use client";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";

export default function CartPage() {
	const { items, hydrated, load, clear } = useCartStore();
	useEffect(() => {
		load();
	}, [load]);
	const total = useMemo(() => items.reduce((sum, i) => sum + i.priceCents * i.qty, 0), [items]);
	if (!hydrated) return null;
	return (
		<main className="px-6 md:px-10 xl:px-20 py-16 bg-black text-white">
			<h1 className="font-serif text-5xl mb-8">Cart</h1>
			{items.length === 0 ? (
				<div>
					<p className="text-neutral-400">Your cart is empty.</p>
					<Link href="../shop" className="inline-block mt-4 border border-white px-6 py-3 uppercase tracking-widest hover:bg-white hover:text-black">Continue shopping</Link>
				</div>
			) : (
				<div className="grid md:grid-cols-3 gap-8">
					<div className="md:col-span-2 space-y-6">
						{items.map((i) => (
							<div key={`${i.productId}-${i.size}-${i.color}`} className="flex gap-4 items-center">
								<div className="w-24 h-32 bg-neutral-900" />
								<div className="flex-1">
									<div className="font-medium">{i.name}</div>
									<div className="text-neutral-400 text-sm">{i.size} {i.color}</div>
								</div>
								<div className="text-sm">× {i.qty}</div>
								<div>{(i.priceCents / 100).toFixed(2)} €</div>
							</div>
						))}
					</div>
					<aside className="border border-white/20 p-6 self-start">
						<div className="flex justify-between text-sm text-neutral-400">
							<span>Subtotal</span>
							<span>{(total / 100).toFixed(2)} €</span>
						</div>
						<Link href="../checkout" className="mt-6 block text-center border border-white px-6 py-3 uppercase tracking-widest hover:bg-white hover:text-black">Checkout</Link>
						<button onClick={clear} className="mt-3 block w-full text-center border border-white/30 px-6 py-3 uppercase tracking-widest hover:bg-white hover:text-black">Clear</button>
					</aside>
				</div>
			)}
		</main>
	);
} 