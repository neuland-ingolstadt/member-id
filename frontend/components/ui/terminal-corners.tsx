import { cn } from '@/lib/utils'

type TerminalCornersProps = {
	size?: 'sm' | 'md'
	className?: string
}

const corners = ['tl', 'tr', 'bl', 'br'] as const

export function TerminalCorners({
	size = 'md',
	className
}: TerminalCornersProps) {
	const box = size === 'sm' ? 'h-3 w-3' : 'h-12 w-12'
	const arm = size === 'sm' ? 8 : 24
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
			{corners.map(corner => (
				<div
					key={corner}
					className={cn('absolute', box, {
						'top-0 left-0': corner === 'tl',
						'top-0 right-0': corner === 'tr',
						'bottom-0 left-0': corner === 'bl',
						'bottom-0 right-0': corner === 'br'
					})}
				>
					<div
						className={cn('absolute w-px', colorClass, {
							'top-0 left-0': corner === 'tl' || corner === 'tr',
							'bottom-0 left-0': corner === 'bl',
							'bottom-0 right-0': corner === 'br'
						})}
						style={{ height: arm }}
					/>
				</div>
			))}
		</div>
	)
}
