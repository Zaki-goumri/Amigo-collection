"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export default function Navbar() {
	const locale = useLocale();
	const pathname = usePathname();
	function switchLocale(target: string) {
		const parts = pathname.split("/").filter(Boolean);
		if (parts.length > 0) {
			parts[0] = target;
		}
		return "/" + parts.join("/");
	}
	return (
		<header className="sticky top-0 z-50 bg-black/70 backdrop-blur border-b border-white/10">
			<div className="px-6 md:px-10 xl:px-20 h-14 flex items-center justify-between">
				<Link href={`/${locale}`} className="font-serif text-xl">Amigo</Link>
				<nav className="flex items-center gap-6 text-sm">
					<Link href={`/${locale}/shop`}>Shop</Link>
					<Link href={`/${locale}/cart`}>Cart</Link>
					<div className="flex items-center gap-2">
						<select defaultValue={locale} onChange={(e) => { window.location.assign(switchLocale(e.target.value)); }} className="bg-black border border-white/20 px-2 py-1 text-xs">
							<option value="fr">FR</option>
							<option value="en">EN</option>
							<option value="ar">AR</option>
						</select>
					</div>
				</nav>
			</div>
		</header>
	);
} 