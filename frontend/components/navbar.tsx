'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NeulandLogo from '@/components/neuland-logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

export function Navbar() {
	const pathname = usePathname()
	const onInfoPage = pathname === '/learn-more'

	return (
		<nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
			<div className="container mx-auto px-4 py-3">
				<div className="flex items-center justify-between">
					<Link
						href="/"
						className="flex items-center gap-3 transition-opacity hover:opacity-80"
					>
						<NeulandLogo className="h-8 w-auto text-foreground sm:h-9" />
						<div className="hidden sm:block">
							<p className="text-sm font-medium text-muted-foreground">
								ID Verification
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
