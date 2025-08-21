import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import "../globals.css";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export const metadata: Metadata = {
	title: "Amigo",
	description: "Amigo - Luxury womenswear",
};

export const locales = ["fr", "en", "ar"] as const;
export type Locale = (typeof locales)[number];

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const sans = Inter({ subsets: ["latin"] });

async function getMessages(locale: string) {
	try {
		const messages = (await import(`@/locales/${locale}/common.json`)).default;
		return messages;
	} catch (error) {
		return null;
	}
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
	const { locale } = params;
	if (!locales.includes(locale as Locale)) notFound();
	const messages = await getMessages(locale);
	if (!messages) notFound();
	const dir = locale === "ar" ? "rtl" : "ltr";
	return (
		<html lang={locale} dir={dir} className={`${serif.className} ${sans.className} bg-black text-white`}>
			<body className="antialiased">
				<NextIntlClientProvider locale={locale} messages={messages}>
					<Navbar />
					{children}
					<Footer />
				</NextIntlClientProvider>
			</body>
		</html>
	);
} 