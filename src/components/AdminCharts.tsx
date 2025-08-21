"use client";
import {
	ResponsiveContainer,
	BarChart as RBarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	LineChart,
	Line,
} from "recharts";
import { formatPriceDZD } from "@/lib/currency";

type WilayaRow = { wilaya: string; total: number; count: number };
type ProductRow = { productId: number; name: string; qty: number };
type StatusRow = { status: string; count: number };
type RevenueRow = { day: string; total: number };

export default function AdminCharts({
	wilayaChart,
	productChart,
	statusChart,
	revenueByDay,
	totalRevenue,
	totalOrders,
	totalItems,
	avgOrderValue,
}: {
	wilayaChart: WilayaRow[];
	productChart: ProductRow[];
	statusChart: StatusRow[];
	revenueByDay: RevenueRow[];
	totalRevenue: number;
	totalOrders: number;
	totalItems: number;
	avgOrderValue: number;
}) {
	return (
		<div className="space-y-10">
			<section className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="border border-white/10 p-4"><div className="text-neutral-400 text-xs uppercase tracking-widest">Revenue</div><div className="text-2xl mt-1">{formatPriceDZD(totalRevenue)}</div></div>
				<div className="border border-white/10 p-4"><div className="text-neutral-400 text-xs uppercase tracking-widest">Orders</div><div className="text-2xl mt-1">{totalOrders}</div></div>
				<div className="border border-white/10 p-4"><div className="text-neutral-400 text-xs uppercase tracking-widest">Items Sold</div><div className="text-2xl mt-1">{totalItems}</div></div>
				<div className="border border-white/10 p-4"><div className="text-neutral-400 text-xs uppercase tracking-widest">Avg Order Value</div><div className="text-2xl mt-1">{formatPriceDZD(avgOrderValue)}</div></div>
			</section>

			<section className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="border border-white/10 p-4"><h3 className="font-serif text-xl mb-3">Top Wilayas by Revenue</h3><div className="h-64">
					<ResponsiveContainer width="100%" height="100%">
						<RBarChart data={wilayaChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
							<CartesianGrid strokeDasharray="3 3" stroke="#222" />
							<XAxis dataKey="wilaya" stroke="#aaa" tick={{ fill: '#aaa' }} hide />
							<YAxis stroke="#aaa" tick={{ fill: '#aaa' }} hide />
							<Tooltip contentStyle={{ background: '#000', border: '1px solid #333' }} formatter={(v: number) => [formatPriceDZD(Number(v)), 'Revenue']} />
							<Bar dataKey="total" fill="#fff" />
						</RBarChart>
					</ResponsiveContainer>
				</div></div>
				<div className="border border-white/10 p-4"><h3 className="font-serif text-xl mb-3">Best Products (Qty)</h3><div className="h-64">
					<ResponsiveContainer width="100%" height="100%">
						<RBarChart data={productChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
							<CartesianGrid strokeDasharray="3 3" stroke="#222" />
							<XAxis dataKey="name" stroke="#aaa" tick={{ fill: '#aaa' }} hide />
							<YAxis stroke="#aaa" tick={{ fill: '#aaa' }} />
							<Tooltip contentStyle={{ background: '#000', border: '1px solid #333' }} />
							<Bar dataKey="qty" fill="#fff" />
						</RBarChart>
					</ResponsiveContainer>
				</div></div>
			</section>

			<section className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="border border-white/10 p-4"><h3 className="font-serif text-xl mb-3">Orders by Status</h3><div className="h-64">
					<ResponsiveContainer width="100%" height="100%">
						<RBarChart data={statusChart}>
							<CartesianGrid strokeDasharray="3 3" stroke="#222" />
							<XAxis dataKey="status" stroke="#aaa" tick={{ fill: '#aaa' }} />
							<YAxis stroke="#aaa" tick={{ fill: '#aaa' }} />
							<Tooltip contentStyle={{ background: '#000', border: '1px solid #333' }} />
							<Bar dataKey="count" fill="#fff" />
						</RBarChart>
					</ResponsiveContainer>
				</div></div>
				<div className="border border-white/10 p-4"><h3 className="font-serif text-xl mb-3">Revenue by Day (Last 30)</h3><div className="h-64">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={revenueByDay}>
							<CartesianGrid strokeDasharray="3 3" stroke="#222" />
							<XAxis dataKey="day" stroke="#aaa" tick={{ fill: '#aaa' }} hide />
							<YAxis stroke="#aaa" tick={{ fill: '#aaa' }} />
							<Tooltip contentStyle={{ background: '#000', border: '1px solid #333' }} formatter={(v: number) => [formatPriceDZD(Number(v)), 'Revenue']} />
							<Line type="monotone" dataKey="total" stroke="#fff" dot={false} />
						</LineChart>
					</ResponsiveContainer>
				</div></div>
			</section>
		</div>
	);
} 