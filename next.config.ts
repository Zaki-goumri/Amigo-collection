import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "res.cloudinary.com" },
			{ protocol: "https", hostname: "www.louisvuitton.com" },
			{ protocol: "https", hostname: "us.louisvuitton.com" },
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default withNextIntl(nextConfig);
