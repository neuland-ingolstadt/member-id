'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NeulandPalm } from '@/components/neuland-palm'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

export function Navbar() {
	const pathname = usePathname()
	const onInfoPage = pathname === '/learn-more'

	const logo = (
		<>
			<NeulandPalm className="h-9 w-auto text-terminal-text" />
			<div className="font-mono leading-tight">
				<span className="block text-sm font-semibold tracking-wide text-terminal-text">
					Neuland
				</span>
				<span className="block text-[10px] uppercase tracking-[0.25em] text-terminal-text/50">
					ID Verificator
				</span>
			</div>
		</>
	)

	return (
		<header className="sticky top-0 z-50 border-b border-terminal-window-border bg-terminal-nav shadow-[0_1px_0_0_rgba(74,222,128,0.06)]">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
				<Link
					href="/"
					className="group flex shrink-0 items-center gap-3 no-underline"
				>
					{logo}
				</Link>

				<div className="flex shrink-0 items-center gap-2 sm:gap-3">
					{onInfoPage ? (
						<Button variant="outline" size="sm" asChild>
							<Link href="/">Back to Scanner</Link>
						</Button>
					) : (
						<Button variant="outline" size="sm" asChild>
							<Link href="/learn-more">Learn More</Link>
						</Button>
					)}
					<ThemeToggle />
				</div>
			</div>
		</header>
	)
}
