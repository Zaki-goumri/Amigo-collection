"use client";
import { useState, useMemo } from "react";
import { useCartStore } from "@/store/cart";

type Props = {
	id: number;
	slug: string;
	name: string;
	priceCents: number;
	inStock: boolean;
	sizes: string[];
	colors: string[];
};

export default function ProductActions({ id, slug, name, priceCents, inStock, sizes, colors }: Props) {
	const addItem = useCartStore((s) => s.addItem);
	const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
	const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
	const [qty, setQty] = useState<number>(1);

	function clamp(n: number) {
		if (Number.isNaN(n) || n < 1) return 1;
		if (n > 99) return 99;
		return n;
	}

	const canAdd = inStock && (sizes.length === 0 || !!selectedSize) && (colors.length === 0 || !!selectedColor);

	function addToCart() {
		if (!canAdd) return;
		addItem({ productId: id, slug, name, priceCents, qty: clamp(qty), size: selectedSize, color: selectedColor });
	}

	return (
		<div className="space-y-6">
			{sizes.length > 0 && (
				<div>
					<div className="uppercase text-sm tracking-widest mb-2">Size</div>
					<div className="flex gap-2">
						{sizes.map((s) => (
							<button
								key={s}
								onClick={() => setSelectedSize(s)}
								className={`border px-3 py-2 text-sm transition-colors ${selectedSize === s ? "border-white bg-white text-black" : "border-white/30 hover:bg-white hover:text-black"}`}
							>
								{s}
							</button>
						))}
					</div>
					{!selectedSize && <div className="mt-2 text-xs text-red-400">Please select a size</div>}
				</div>
			)}
			{colors.length > 0 && (
				<div>
					<div className="uppercase text-sm tracking-widest mb-2">Color</div>
					<div className="flex gap-2">
						{colors.map((c) => (
							<button
								key={c}
								onClick={() => setSelectedColor(c)}
								className={`border px-3 py-2 text-sm transition-colors ${selectedColor === c ? "border-white bg-white text-black" : "border-white/30 hover:bg-white hover:text-black"}`}
							>
								{c}
							</button>
						))}
					</div>
					{!selectedColor && <div className="mt-2 text-xs text-red-400">Please select a color</div>}
				</div>
			)}
			<div className="flex items-center gap-3">
				<div className="flex items-center border border-white/30">
					<button type="button" onClick={() => setQty((q) => clamp(q - 1))} className="px-3 py-2">-</button>
					<input
						type="number"
						min={1}
						max={99}
						value={qty}
						onChange={(e) => setQty(clamp(parseInt(e.target.value, 10)))}
						className="w-14 bg-black text-center outline-none"
					/>
					<button type="button" onClick={() => setQty((q) => clamp(q + 1))} className="px-3 py-2">+</button>
				</div>
				<button
					disabled={!canAdd}
					onClick={addToCart}
					className="border border-white px-6 py-3 uppercase tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Add to cart
				</button>
			</div>
		</div>
	);
} 