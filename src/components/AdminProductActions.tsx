"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
	id: number;
	name: string;
};

export default function AdminProductActions({ id, name }: Props) {
	const router = useRouter();
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	async function handleDelete() {
		setIsDeleting(true);
		try {
			const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
			if (res.ok) {
				router.refresh();
			} else {
				alert("Failed to delete product");
			}
		} catch (error) {
			alert("Failed to delete product");
		} finally {
			setIsDeleting(false);
			setShowDeleteConfirm(false);
		}
	}

	return (
		<>
			<div className="flex justify-end gap-2">
				<Link 
					href={`/admin/products/${id}/edit`} 
					className="underline hover:text-neutral-400"
				>
					Edit
				</Link>
				<button
					onClick={() => setShowDeleteConfirm(true)}
					className="text-red-500 hover:text-red-400 underline"
					disabled={isDeleting}
				>
					{isDeleting ? "Deleting..." : "Delete"}
				</button>
			</div>

			{/* Delete Confirmation Dialog */}
			{showDeleteConfirm && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-black border border-white/20 p-6 max-w-md w-full mx-4">
						<h2 className="text-xl font-serif mb-4">Delete Product</h2>
						<p className="text-neutral-400 mb-6">
							Are you sure you want to delete "{name}"? This action cannot be undone.
						</p>
						<div className="flex gap-4">
							<button
								onClick={handleDelete}
								disabled={isDeleting}
								className="bg-red-500 text-white px-6 py-3 uppercase tracking-widest hover:bg-red-600 disabled:opacity-50"
							>
								{isDeleting ? "Deleting..." : "Delete"}
							</button>
							<button
								onClick={() => setShowDeleteConfirm(false)}
								disabled={isDeleting}
								className="border border-white px-6 py-3 uppercase tracking-widest hover:bg-white hover:text-black disabled:opacity-50"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
