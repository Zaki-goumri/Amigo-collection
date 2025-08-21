import 'dotenv/config';
import { db } from "@/db";
import { admins, products } from "@/db/schema";
import bcrypt from "bcrypt";

async function main() {
	const adminEmail = process.env.ADMIN_EMAIL || "admin@amigo.com";
	const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe_123";
	const passwordHash = await bcrypt.hash(adminPassword, 10);

	// upsert admin
	try {
		await db.insert(admins).values({ email: adminEmail, passwordHash }).run();
		console.log(`Admin created: ${adminEmail}`);
	} catch (e) {
		console.log("Admin exists - skipping");
	}

	// sample products
	const sampleProducts = [
		{
			slug: "silk-midi-dress",
			name: "Silk Midi Dress",
			description: "A timeless silk midi dress with elegant drape.",
			priceCents: 25900,
			category: "dresses",
			sizes: ["XS", "S", "M", "L"],
			colors: ["Black", "Ivory"],
			inStock: true,
		},
		{
			slug: "cashmere-cardigan",
			name: "Cashmere Cardigan",
			description: "Luxurious cashmere cardigan with pearl buttons.",
			priceCents: 18900,
			category: "knitwear",
			sizes: ["XS", "S", "M", "L"],
			colors: ["Charcoal", "Oat"],
			inStock: true,
		},
	];

	for (const p of sampleProducts) {
		try {
			const res = await db.insert(products).values(p).run();
			const productId = Number(res.lastInsertRowid);
			console.log(`Seeded product: ${p.name} (id=${productId})`);
		} catch (e) {
			console.log(`Product exists - skipping: ${p.slug}`);
		}
	}
}

main().then(() => {
	console.log("Seed complete");
	process.exit(0);
}); 