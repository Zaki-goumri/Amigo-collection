export default function Footer() {
	return (
		<footer className="mt-20 border-t border-white/10 text-sm text-neutral-400">
			<div className="px-6 md:px-10 xl:px-20 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
				<div>© {new Date().getFullYear()} Amigo</div>
				<nav className="flex items-center gap-6">
					<a href="#" className="hover:text-white">About</a>
					<a href="#" className="hover:text-white">Contact</a>
					<a href="#" className="hover:text-white">Privacy</a>
				</nav>
			</div>
		</footer>
	);
} 