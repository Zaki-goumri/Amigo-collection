"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminNavbar() {
	const router = useRouter();
	async function logout() {
		await fetch("/api/auth/logout", { method: "POST" });
		router.push("/admin/login");
	}
	return (
		<header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-white/10">
			<div className="px-6 md:px-10 xl:px-20 h-14 flex items-center justify-between">
				<Link href="/admin" className="font-serif text-xl">Amigo Admin</Link>
				<nav className="flex items-center gap-6 text-sm">
					<Link href="/admin">Dashboard</Link>
					<Link href="/admin/products">Products</Link>
					<Link href="/admin/orders">Orders</Link>
					<button onClick={logout} className="border border-white/30 px-3 py-1 text-xs hover:bg-white hover:text-black">Logout</button>
				</nav>
			</div>
		</header>
	);
} 