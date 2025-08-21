"use client";
import { create } from "zustand";
import { get as idbGet, set as idbSet } from "idb-keyval";

type CartItem = {
	productId: number;
	slug: string;
	name: string;
	priceCents: number;
	qty: number;
	size?: string;
	color?: string;
	imageUrl?: string;
};

type CartState = {
	items: CartItem[];
	hydrated: boolean;
	addItem: (item: CartItem) => void;
	removeItem: (productId: number, variantKey?: string) => void;
	clear: () => void;
	load: () => Promise<void>;
};

const STORAGE_KEY = "amigo_cart";

export const useCartStore = create<CartState>((set, get) => ({
	items: [],
	hydrated: false,
	addItem: (item) => {
		const items = [...get().items];
		const idx = items.findIndex((i) => i.productId === item.productId && i.size === item.size && i.color === item.color);
		if (idx >= 0) items[idx].qty += item.qty; else items.push(item);
		set({ items });
		void idbSet(STORAGE_KEY, items);
	},
	removeItem: (productId) => {
		const items = get().items.filter((i) => i.productId !== productId);
		set({ items });
		void idbSet(STORAGE_KEY, items);
	},
	clear: () => {
		set({ items: [] });
		void idbSet(STORAGE_KEY, []);
	},
	load: async () => {
		const saved = (await idbGet(STORAGE_KEY)) as CartItem[] | undefined;
		if (Array.isArray(saved)) set({ items: saved, hydrated: true }); else set({ hydrated: true });
	},
})); 