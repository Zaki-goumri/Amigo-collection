export function formatPriceDZD(priceCents: number): string {
	const amount = priceCents;
	return `${amount.toFixed(2)} DA`;
} 