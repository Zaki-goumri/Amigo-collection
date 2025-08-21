import 'dotenv/config';
import { db } from "@/db";
import { admins } from "@/db/schema";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt: any = require("bcrypt");

async function main() {
	const email = process.env.ADMIN_EMAIL || "admin@amigo.com";
	const password = process.env.ADMIN_PASSWORD || "ChangeMe_123";
	const reset = process.env.RESET_ADMIN === "true";

	const passwordHash = await bcrypt.hash(password, 10);

	if (reset) {
		db.insert(admins)
			.values({ email, passwordHash })
			.onConflictDoUpdate({ target: admins.email, set: { passwordHash } })
			.run();
		console.log(`Admin upserted (password reset): ${email}`);
		return;
	}

	const res = db
		.insert(admins)
		.values({ email, passwordHash })
		.onConflictDoNothing()
		.run();
	if ((res as any).changes === 0) {
		console.log(`Admin already exists: ${email}`);
	} else {
		console.log(`Admin created: ${email}`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
}); 