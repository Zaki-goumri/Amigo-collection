"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	async function onSubmit(formData: FormData) {
		setError(null);
		const res = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") }),
		});
		if (res.ok) router.push("/admin/products"); else setError("Invalid credentials");
	}
	return (
		<main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
			<form action={onSubmit} className="w-full max-w-sm space-y-4">
				<h1 className="font-serif text-4xl mb-6 text-center">Admin</h1>
				<input name="email" type="email" required placeholder="Email" className="w-full bg-black border border-white/20 px-4 py-3" />
				<input name="password" type="password" required placeholder="Password" className="w-full bg-black border border-white/20 px-4 py-3" />
				<button className="w-full border border-white px-6 py-3 uppercase tracking-widest hover:bg-white hover:text-black">Login</button>
				{error && <p className="text-sm text-red-400">{error}</p>}
			</form>
		</main>
	);
} 