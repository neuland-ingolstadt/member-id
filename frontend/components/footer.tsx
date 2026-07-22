import { ExternalLink } from 'lucide-react'
import { GitHubIcon } from '@/components/github-icon'
import NeulandLogo from '@/components/neuland-logo'

export function Footer() {
	const year = new Date().getFullYear()
	const commitHash = process.env.NEXT_PUBLIC_COMMIT_HASH || 'development'
	const shortCommitHash = commitHash.substring(0, 7)

	return (
		<footer className="my-16 text-center text-muted-foreground">
			<div className="mx-auto max-w-7xl px-4">
				<div className="border-t border-border pt-8">
					<div className="mb-3 flex items-center justify-center gap-2">
						<NeulandLogo className="h-5 w-auto text-foreground" />
					</div>
					<p className="mb-2 text-xs">© {year} Neuland Ingolstadt e.V.</p>
					<p className="mb-4 text-xs text-muted-foreground/80">
						Secure digital membership verification powered by cryptographic
						signatures
					</p>

					<div className="mb-3 flex flex-col items-center justify-center gap-2 text-xs">
						<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
							<div className="flex items-center gap-4">
								<a
									href="https://neuland-ingolstadt.de/legal/impressum"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
								>
									<ExternalLink className="h-3 w-3" />
									Imprint
								</a>
								<a
									href="https://neuland-ingolstadt.de/legal/datenschutz"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
								>
									<ExternalLink className="h-3 w-3" />
									Privacy
								</a>
								<a
									href="https://github.com/neuland-ingolstadt/member-id"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
								>
									<GitHubIcon className="h-3 w-3" />
									GitHub
								</a>
							</div>
						</div>
						<div className="flex items-center gap-1 text-muted-foreground/70">
							<span>Build:</span>
							<code className="bg-muted px-1 py-0.5 font-mono">
								{shortCommitHash}
							</code>
						</div>
						<div className="mt-2 flex items-center gap-1 text-muted-foreground/70">
							Created by{' '}
							<a
								href="https://eggl.dev"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground transition-colors hover:text-foreground"
							>
								Robert Eggl
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}
