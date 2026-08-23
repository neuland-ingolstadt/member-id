import { EXTERNAL_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'

type FooterProps = {
	className?: string
}

export function Footer({ className }: FooterProps) {
	const year = new Date().getFullYear()
	const commitHash = process.env.NEXT_PUBLIC_COMMIT_HASH || 'development'
	const shortCommitHash = commitHash.substring(0, 7)

	return (
		<footer
			className={cn(
				'border-t border-terminal-window-border/60 py-6 text-center font-mono text-xs text-terminal-text/45',
				className
			)}
		>
			<nav className="flex flex-wrap items-center justify-center gap-4">
				<a
					href={EXTERNAL_LINKS.IMPRESSUM}
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors hover:text-terminal-cyan"
				>
					Impressum
				</a>
				<span aria-hidden="true" className="text-terminal-window-border">
					|
				</span>
				<a
					href={EXTERNAL_LINKS.DATENSCHUTZ}
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors hover:text-terminal-cyan"
				>
					Datenschutz
				</a>
				<span aria-hidden="true" className="text-terminal-window-border">
					|
				</span>
				<a
					href={EXTERNAL_LINKS.REPOSITORY}
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors hover:text-terminal-cyan"
				>
					GitHub
				</a>
			</nav>
			<p className="mt-3">
				Build:{' '}
				<span className="border border-terminal-window-border/80 px-1.5 py-0.5 font-mono text-terminal-text/60">
					{shortCommitHash}
				</span>
			</p>
			<p className="mt-2">
				Copyright © {year}
				<br />
				by{' '}
				<a
					href="https://eggl.dev"
					target="_blank"
					rel="noopener noreferrer"
					className="transition-colors hover:text-terminal-cyan"
				>
					Robert Eggl
				</a>{' '}
				and Neuland Ingolstadt e.V.
			</p>
		</footer>
	)
}
