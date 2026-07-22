import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type PageShellProps = {
	children: ReactNode
	className?: string
}

export function PageShell({ children, className }: PageShellProps) {
	return (
		<div className={cn('relative flex min-h-screen flex-col', className)}>
			<div className="pointer-events-none fixed inset-0 -z-10 neuland-grid-bg neuland-glow" />
			{children}
		</div>
	)
}
