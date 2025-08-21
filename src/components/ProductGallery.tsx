"use client";
import { useState } from "react";

type Image = { url: string; width: number; height: number; alt: string };

export default function ProductGallery({ images }: { images: Image[] }) {
	const [index, setIndex] = useState(0);
	if (!images || images.length === 0) {
		return <div className="aspect-[3/4] bg-neutral-900" />;
	}
	const current = images[Math.max(0, Math.min(index, images.length - 1))];
	return (
		<div className="space-y-3">
			<div className="aspect-[3/4] bg-neutral-900">
				<img src={current.url} alt={current.alt} className="w-full h-full object-cover" />
			</div>
			<div className="grid grid-cols-4 gap-2">
				{images.map((img, i) => (
					<button key={i} onClick={() => setIndex(i)} className={`h-16 overflow-hidden border ${i === index ? 'border-white' : 'border-white/20'}`}>
						<img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
					</button>
				))}
			</div>
		</div>
	);
} 