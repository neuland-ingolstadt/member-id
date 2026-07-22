import type { ReactNode } from 'react'
import { TerminalCorners } from '@/components/ui/terminal-corners'
import { cn } from '@/lib/utils'

type TerminalPanelProps = {
	children: ReactNode
	className?: string
	title?: string
	subtitle?: string
}

export function TerminalPanel({
	children,
	className,
	title,
	subtitle
}: TerminalPanelProps) {
	return (
		<div
			className={cn(
				'group relative overflow-hidden border border-terminal-window-border bg-terminal-window',
				className
			)}
		>
			<div className="pointer-events-none absolute inset-0 z-0">
				<div className="absolute inset-0 bg-gradient-to-br from-terminal-cyan/[0.04] via-transparent to-terminal-cyan/[0.06]" />
				<TerminalCorners />
			</div>

			{title ? (
				<div className="relative z-10 bg-terminal-window-title/80 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-terminal-text/80">
					<span className="text-terminal-cyan">//</span> {title}
					{subtitle ? (
						<span className="mt-0.5 block text-[10px] normal-case tracking-normal text-terminal-text/50">
							{subtitle}
						</span>
					) : null}
				</div>
			) : null}

			<div className="relative z-10">{children}</div>
		</div>
	)
}
