import { GitHubIcon } from '@/components/github-icon'

export function Footer() {
	const year = new Date().getFullYear()
	const commitHash = process.env.NEXT_PUBLIC_COMMIT_HASH || 'development'
	const shortCommitHash = commitHash.substring(0, 7)

	return (
		<footer className="relative z-10 font-mono">
			<div className="my-8 grid grid-cols-1 gap-4 border-t border-terminal-window-border pt-6 text-terminal-text sm:grid-cols-3">
				<nav>
					<ul>
						<li className="mb-2">
							<a
								href="https://neuland-ingolstadt.de/legal/impressum"
								target="_blank"
								rel="noopener noreferrer"
								className="group text-terminal-text no-underline"
							>
								<span className="group-hover:animate-cyberpunk">$</span>{' '}
								<span className="text-terminal-cyan">cat</span> impressum
							</a>
						</li>
						<li className="mb-2">
							<a
								href="https://neuland-ingolstadt.de/legal/datenschutz"
								target="_blank"
								rel="noopener noreferrer"
								className="group text-terminal-text no-underline"
							>
								<span className="group-hover:animate-cyberpunk">$</span>{' '}
								<span className="text-terminal-cyan">cat</span> datenschutz
							</a>
						</li>
						<li className="mb-2">
							<a
								href="https://neuland-ingolstadt.de"
								target="_blank"
								rel="noopener noreferrer"
								className="group text-terminal-text no-underline"
							>
								<span className="group-hover:animate-cyberpunk">$</span>{' '}
								<span className="text-terminal-cyan">cd</span> neuland.de
							</a>
						</li>
					</ul>
				</nav>

				<nav>
					<ul>
						<li className="mb-2">
							<a
								href="https://github.com/neuland-ingolstadt/member-id"
								target="_blank"
								rel="noopener noreferrer"
								className="group text-terminal-text no-underline"
							>
								<span className="text-terminal-cyan transition-all duration-300 group-hover:animate-cyberpunk group-hover:text-terminal-text">
									<GitHubIcon className="inline-block h-4 w-4" />
								</span>{' '}
								member-id
							</a>
						</li>
						<li className="mb-2">
							<a
								href="https://github.com/neuland-ingolstadt/"
								target="_blank"
								rel="noopener noreferrer"
								className="group text-terminal-text no-underline"
							>
								<span className="text-terminal-cyan transition-all duration-300 group-hover:animate-cyberpunk group-hover:text-terminal-text">
									<GitHubIcon className="inline-block h-4 w-4" />
								</span>{' '}
								github.com
							</a>
						</li>
						<li className="mb-2">
							<a
								href="https://eggl.dev"
								target="_blank"
								rel="noopener noreferrer"
								className="group text-terminal-text no-underline"
							>
								<span className="group-hover:animate-cyberpunk">$</span>{' '}
								<span className="text-terminal-cyan">whoami</span> Robert Eggl
							</a>
						</li>
					</ul>
				</nav>

				<nav>
					<ul>
						<li className="mb-2 text-terminal-text/70">
							<span className="text-terminal-cyan">#</span> Member ID
							Verificator
						</li>
						<li className="mb-2 text-sm text-terminal-text/50">
							Cryptographic QR verification for Neuland membership passes
						</li>
						<li className="mb-2 text-xs text-terminal-text/40">
							Build:{' '}
							<span className="text-terminal-cyan/70" title="Git commit hash">
								{shortCommitHash}
							</span>
						</li>
					</ul>
				</nav>
			</div>
			<div className="pb-8 pt-2 text-center text-sm text-terminal-text/50">
				© {year} Neuland Ingolstadt e.V.
			</div>
		</footer>
	)
}
