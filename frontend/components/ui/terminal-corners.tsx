import { cn } from '@/lib/utils'

type TerminalCornersProps = {
	size?: 'sm' | 'md'
	className?: string
}

export function TerminalCorners({
	size = 'md',
	className
}: TerminalCornersProps) {
	const box = size === 'sm' ? 'h-8 w-8' : 'h-12 w-12'
	const arm = size === 'sm' ? 16 : 24
	const colorClass =
		'bg-terminal-cyan/30 transition-colors duration-200 group-hover:bg-terminal-cyan/55'

	return (
		<div
			className={cn(
				'pointer-events-none absolute inset-0 z-0 [&_*]:pointer-events-none',
				className
			)}
			aria-hidden="true"
		>
			{/* top-left */}
			<div className={cn('absolute top-0 left-0', box)}>
				<div className={cn('absolute top-0 left-0 h-px', colorClass)} style={{ width: arm }} />
				<div className={cn('absolute top-0 left-0 w-px', colorClass)} style={{ height: arm }} />
			</div>
			{/* top-right */}
			<div className={cn('absolute top-0 right-0', box)}>
				<div className={cn('absolute top-0 right-0 h-px', colorClass)} style={{ width: arm }} />
				<div className={cn('absolute top-0 right-0 w-px', colorClass)} style={{ height: arm }} />
			</div>
			{/* bottom-left */}
			<div className={cn('absolute bottom-0 left-0', box)}>
				<div className={cn('absolute bottom-0 left-0 h-px', colorClass)} style={{ width: arm }} />
				<div className={cn('absolute bottom-0 left-0 w-px', colorClass)} style={{ height: arm }} />
			</div>
			{/* bottom-right */}
			<div className={cn('absolute bottom-0 right-0', box)}>
				<div className={cn('absolute bottom-0 right-0 h-px', colorClass)} style={{ width: arm }} />
				<div className={cn('absolute bottom-0 right-0 w-px', colorClass)} style={{ height: arm }} />
			</div>
		</div>
	)
}
