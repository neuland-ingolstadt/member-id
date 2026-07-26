import { NeulandPalm } from '@/components/neuland-palm'
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
				'border-t border-terminal-window-border/60 py-8 text-center font-mono text-xs text-terminal-text/45',
				className
			)}
		>
			<div className="mx-auto flex max-w-7xl flex-col items-center gap-3">
				<div className="flex items-center gap-2 text-sm font-medium text-terminal-text/70">
					<NeulandPalm className="h-5 w-auto" />
					<span>Neuland ID Verification System</span>
				</div>

				<p>© {year} Neuland Ingolstadt e.V.</p>
				<p className="max-w-md text-terminal-text/35">
					Secure digital membership verification powered by cryptographic
					signatures
				</p>

				<nav className="mt-1 flex flex-wrap items-center justify-center gap-4">
					<a
						href={EXTERNAL_LINKS.IMPRESSUM}
						target="_blank"
						rel="noopener noreferrer"
						className="transition-colors hover:text-terminal-cyan"
					>
						Imprint
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
						Privacy
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

				<div className="flex items-center gap-1 text-terminal-text/35">
					<span>Build:</span>
					<code className="rounded border border-terminal-window-border/50 bg-terminal-window-bg/40 px-1.5 py-0.5 font-mono">
						{shortCommitHash}
					</code>
				</div>

				<p className="text-terminal-text/35">
					Created by{' '}
					<a
						href="https://eggl.dev"
						target="_blank"
						rel="noopener noreferrer"
						className="text-terminal-text/45 transition-colors hover:text-terminal-cyan"
					>
						Robert Eggl
					</a>
				</p>
			</div>
		</footer>
	)
}
