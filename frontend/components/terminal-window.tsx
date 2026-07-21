import type React from 'react'
import { cn } from '@/lib/utils'

interface TerminalWindowProps {
	title: string
	children: React.ReactNode
	className?: string
	headerRight?: React.ReactNode
	showCorners?: boolean
}

function TrafficLights() {
	return (
		<div className="flex items-center gap-1.5">
			<span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
			<span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
			<span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
		</div>
	)
}

function CornerAccents() {
	return (
		<>
			<div className="terminal-corner left-0 top-0 h-12 w-12">
				<div className="absolute left-0 top-0 h-px w-6 bg-terminal-cyan/30" />
				<div className="absolute left-0 top-0 h-6 w-px bg-terminal-cyan/30" />
			</div>
			<div className="terminal-corner right-0 top-0 h-12 w-12">
				<div className="absolute right-0 top-0 h-px w-6 bg-terminal-cyan/30" />
				<div className="absolute right-0 top-0 h-6 w-px bg-terminal-cyan/30" />
			</div>
			<div className="terminal-corner bottom-0 left-0 h-12 w-12">
				<div className="absolute bottom-0 left-0 h-px w-6 bg-terminal-cyan/30" />
				<div className="absolute bottom-0 left-0 h-6 w-px bg-terminal-cyan/30" />
			</div>
			<div className="terminal-corner bottom-0 right-0 h-12 w-12">
				<div className="absolute bottom-0 right-0 h-px w-6 bg-terminal-cyan/30" />
				<div className="absolute bottom-0 right-0 h-6 w-px bg-terminal-cyan/30" />
			</div>
			<div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-terminal-cyan/[0.03] via-transparent to-transparent" />
		</>
	)
}

export function TerminalWindow({
	title,
	children,
	className,
	headerRight,
	showCorners = true
}: TerminalWindowProps) {
	return (
		<div className={cn('terminal-window mb-0', className)}>
			{showCorners && <CornerAccents />}
			<div className="relative z-10 flex items-center overflow-hidden bg-terminal-windowTitle px-4 py-2 text-terminal-text">
				<TrafficLights />
				<div className="ml-4 flex-1 text-center font-mono text-sm font-semibold opacity-90">
					{title}
				</div>
				{headerRight ? (
					<div className="ml-2 flex items-center">{headerRight}</div>
				) : (
					<div className="w-[52px]" />
				)}
			</div>
			<div className="relative z-10">{children}</div>
		</div>
	)
}
