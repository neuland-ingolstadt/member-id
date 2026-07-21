'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NeulandLogo from '@/components/neuland-logo'
import { ThemeToggle } from '@/components/theme-toggle'

export function Navbar() {
	const pathname = usePathname()
	const onInfoPage = pathname === '/learn-more'

	return (
		<header className="terminal-nav fixed left-0 right-0 top-0 z-50 border-b border-terminal-window-border/80 bg-terminal-bg/80 py-3 backdrop-blur-md">
			<div className="container mx-auto flex items-center justify-between px-4 py-1 sm:px-6">
				<Link href="/" className="flex items-center no-underline">
					<NeulandLogo className="h-8 w-auto text-terminal-text sm:h-10" />
					<span className="ml-3 hidden font-mono text-xs tracking-widest text-terminal-text/60 sm:inline">
						ID_VERIFY
					</span>
				</Link>

				<nav className="flex items-center gap-4 md:gap-6">
					{onInfoPage ? (
						<Link
							href="/"
							className="group relative hidden font-mono tracking-wider text-terminal-text no-underline transition-colors hover:text-terminal-cyan sm:inline"
						>
							$ scan
							<span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 transform bg-terminal-cyan transition-transform duration-300 group-hover:scale-x-100" />
						</Link>
					) : (
						<Link
							href="/learn-more"
							className="group relative hidden font-mono tracking-wider text-terminal-text no-underline transition-colors hover:text-terminal-cyan sm:inline"
						>
							$ man verify
							<span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 transform bg-terminal-cyan transition-transform duration-300 group-hover:scale-x-100" />
						</Link>
					)}
					<a
						href="https://neuland-ingolstadt.de"
						target="_blank"
						rel="noreferrer noopener"
						className="group relative hidden font-mono tracking-wider text-terminal-text no-underline transition-colors hover:text-terminal-cyan md:inline"
					>
						neuland.de
						<span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 transform bg-terminal-cyan transition-transform duration-300 group-hover:scale-x-100" />
					</a>
					{onInfoPage ? (
						<Link
							href="/"
							className="inline-flex items-center border border-terminal-window-border bg-terminal-window px-3 py-1.5 font-mono text-xs font-semibold text-terminal-text no-underline transition-colors hover:border-terminal-cyan/50 sm:hidden"
						>
							$ scan
						</Link>
					) : (
						<Link
							href="/learn-more"
							className="inline-flex items-center border border-terminal-window-border bg-terminal-window px-3 py-1.5 font-mono text-xs font-semibold text-terminal-text no-underline transition-colors hover:border-terminal-cyan/50 sm:hidden"
						>
							$ man
						</Link>
					)}
					<ThemeToggle />
				</nav>
			</div>
		</header>
	)
}
