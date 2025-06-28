'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SvgIcon from '@/components/neuland-palm'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

export function Navbar() {
	const pathname = usePathname()
	const onInfoPage = pathname === '/learn-more'

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
			<div className="container mx-auto px-4 py-3">
				<div className="flex items-center justify-between">
					<Link
						href="/"
						className="flex items-center gap-3 hover:opacity-80 transition-opacity"
					>
						<div className="w-8 h-8 bg-gradient-to-br from-purple-700 to-purple-900 text-white rounded-lg flex items-center justify-center shadow-md">
							<SvgIcon size={20} color="currentColor" />
						</div>
						<div className="hidden sm:block">
							<h1 className="font-semibold text-gray-900 dark:text-white text-lg">
								Neuland ID Verificator
							</h1>
							<p className="text-xs text-gray-600 dark:text-gray-400">
								Neuland Ingolstadt e.V.
							</p>
						</div>
					</Link>
					<div className="flex items-center gap-2">
						{onInfoPage ? (
							<Button variant="outline" asChild>
								<Link href="/">Back to Scanner</Link>
							</Button>
						) : (
							<Button variant="outline" asChild>
								<Link href="/learn-more">Learn More</Link>
							</Button>
						)}
						<ThemeToggle />
					</div>
				</div>
			</div>
		</nav>
	)
}
