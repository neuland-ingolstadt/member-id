import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type TerminalPanelProps = {
	children: ReactNode
	className?: string
	title?: string
	subtitle?: string
	titleAside?: ReactNode
	showCorners?: boolean
}

function TerminalCorners() {
	return (
		<>
			<span className="terminal-corner terminal-corner--tl" aria-hidden />
			<span className="terminal-corner terminal-corner--tr" aria-hidden />
			<span className="terminal-corner terminal-corner--bl" aria-hidden />
			<span className="terminal-corner terminal-corner--br" aria-hidden />
		</>
	)
}

export function TerminalPanel({
	children,
	className,
	title,
	subtitle,
	titleAside,
	showCorners = true
}: TerminalPanelProps) {
	return (
		<div
			className={cn(
				'group relative overflow-hidden border border-terminal-window-border bg-terminal-window',
				className
			)}
		>
			{showCorners ? <TerminalCorners /> : null}

			{title ? (
				<div className="relative z-10 border-b border-terminal-window-border/50 px-4 py-1.5">
					<div className="flex items-center justify-between gap-3">
						<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-terminal-text/65">
							<span className="text-terminal-cyan/75">//</span> {title}
						</p>
						{titleAside}
					</div>
					{subtitle ? (
						<p className="mt-0.5 font-mono text-[10px] normal-case tracking-normal text-terminal-text/45">
							{subtitle}
						</p>
					) : null}
				</div>
			) : null}

			<div className="relative z-10">{children}</div>
		</div>
	)
}
