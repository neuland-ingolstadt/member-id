import { ExternalLink, Github } from 'lucide-react'
import SvgIcon from '@/components/neuland-palm'

export function Footer() {
	const year = new Date().getFullYear()

	// Get commit hash from environment variable (set during build)
	const commitHash = process.env.NEXT_PUBLIC_COMMIT_HASH || 'development'
	const shortCommitHash = commitHash.substring(0, 7)

	return (
		<footer className="my-16 text-center text-gray-500 dark:text-gray-400">
			<div className="max-w-7xl mx-auto">
				<div className="border-t border-gray-200 dark:border-gray-700 pt-8">
					<div className="flex items-center justify-center gap-2 mb-3">
						<SvgIcon size={20} color="currentColor" />
						<span className="text-sm font-medium">
							Member ID Verification System
						</span>
					</div>
					<p className="text-xs mb-2">© {year} Neuland Ingolstadt e.V.</p>
					<p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
						Secure digital membership verification powered by cryptographic
						signatures
					</p>

					{/* Links and additional info */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
						<div className="flex items-center gap-4">
							<a
								href="https://neuland-ingolstadt.de/legal/impressum"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
							>
								<ExternalLink className="h-3 w-3" />
								Imprint
							</a>
							<a
								href="https://neuland-ingolstadt.de/legal/datenschutz"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
							>
								<ExternalLink className="h-3 w-3" />
								Privacy
							</a>
							<a
								href="https://github.com/neuland-ingolstadt/member-id"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
							>
								<Github className="h-3 w-3" />
								GitHub
							</a>
						</div>

						{/* Commit hash */}
						<div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
							<span>Build:</span>
							<code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono">
								{shortCommitHash}
							</code>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}
