"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

export default function LandingPage() {
	const t = useTranslations();
	const locale = useLocale();
	return (
		<main className="min-h-screen bg-black text-white">
			<section className="relative h-[90vh] flex items-center justify-center">
				<motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-[18vw] leading-none tracking-tight font-serif">
					{t("brand")}
				</motion.h1>
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="absolute bottom-16">
					<Link href={`/${locale}/shop`} className="border border-white px-6 py-3 uppercase tracking-widest hover:bg-white hover:text-black transition-colors">{t("cta_explore")}</Link>
				</motion.div>
			</section>

			<section className="px-6 md:px-10 xl:px-20 py-24 grid md:grid-cols-2 gap-16">
				<div className="prose prose-invert max-w-none">
					<h2 className="font-serif text-4xl">{t("story_title")}</h2>
					<p className="text-neutral-300 text-lg">Crafted silhouettes, enduring materials, and quiet confidence. Amigo celebrates modern femininity with editorial minimalism.</p>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div className="aspect-[3/4] overflow-hidden bg-neutral-900" />
					<div className="aspect-[3/4] overflow-hidden mt-10 bg-neutral-900" />
				</div>
			</section>

			<section className="px-6 md:px-10 xl:px-20 py-24">
				<h3 className="font-serif text-3xl mb-10">Featured Collections</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{["silk", "linen", "cashmere"].map((k) => (
						<div key={k} className="group">
							<div className="aspect-[3/4] overflow-hidden bg-neutral-900 transition-transform duration-500 group-hover:scale-105" />
							<div className="mt-3 text-sm uppercase tracking-widest text-neutral-400">{k}</div>
						</div>
					))}
				</div>
			</section>

			<section className="px-6 md:px-10 xl:px-20 py-24">
				<h3 className="font-serif text-3xl mb-10">Testimonials</h3>
				<div className="grid md:grid-cols-3 gap-8 text-neutral-300">
					<blockquote>“Effortless elegance. Every piece feels intentional.”</blockquote>
					<blockquote>“The fabrics are impeccable, the cuts are timeless.”</blockquote>
					<blockquote>“My new wardrobe staples.”</blockquote>
				</div>
			</section>

			<section className="px-6 md:px-10 xl:px-20 py-24 border-t border-white/10">
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					<h3 className="font-serif text-3xl">{t("newsletter_cta")}</h3>
					<form action="/api/newsletter" method="post" className="flex w-full md:w-auto">
						<input name="email" type="email" required placeholder="email" className="bg-black border border-white/20 px-4 py-3 w-full md:w-80 placeholder:text-neutral-500" />
						<button className="border border-white px-6 py-3 uppercase tracking-widest hover:bg-white hover:text-black transition-colors">Sign up</button>
					</form>
				</div>
			</section>

			<footer className="px-6 md:px-10 xl:px-20 py-12 flex items-center justify-between text-sm text-neutral-400">
				<div>© {new Date().getFullYear()} Amigo</div>
				<nav className="flex gap-6">
					<Link href="/fr">FR</Link>
					<Link href="/en">EN</Link>
					<Link href="/ar">AR</Link>
				</nav>
			</footer>
		</main>
	);
} 