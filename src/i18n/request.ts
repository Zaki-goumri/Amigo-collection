import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
	let locale = await requestLocale;
	if (!locale) {
		locale = "fr";
	}
	const messages = (await import(`@/locales/${locale}/common.json`)).default;
	return {
		locale,
		messages,
	};
}); 