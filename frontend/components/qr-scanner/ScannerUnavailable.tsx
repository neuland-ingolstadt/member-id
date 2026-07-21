'use client'

import { AlertTriangle } from 'lucide-react'
import { ScanHistoryList } from '@/components/scan-history'
import { ScanStatsDisplay } from '@/components/scan-stats-display'
import { TerminalWindow } from '@/components/terminal-window'
import type { ScanRecord, ScanStats } from '@/hooks/use-scan-history'

interface ScannerUnavailableProps {
	stats: ScanStats
	scanHistory: ScanRecord[]
	errorMessage: string | null
	onClearHistory: () => void
	onRemoveScan: (id: string) => void
}

export function ScannerUnavailable({
	stats,
	scanHistory,
	errorMessage,
	onClearHistory,
	onRemoveScan
}: ScannerUnavailableProps) {
	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
			<div className="space-y-6 lg:col-span-3">
				<TerminalWindow title="neuland@verify:~/error">
					<div className="flex items-center justify-center p-6 py-12">
						<div className="max-w-md text-center font-mono">
							<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center border border-destructive/40 bg-destructive/10 p-3">
								<AlertTriangle className="h-12 w-12 text-destructive" />
							</div>
							<h3 className="mb-2 text-xl font-bold text-destructive">
								[ ERR ] Scanner Unavailable
							</h3>
							<p className="mb-4 text-terminal-text/60">
								The public key required for verification could not be loaded.
							</p>
							{errorMessage && (
								<div className="border border-destructive/30 bg-destructive/10 p-4 text-left">
									<p className="text-sm text-destructive">
										<span className="font-bold">Error:</span> {errorMessage}
									</p>
								</div>
							)}
							<p className="mt-4 text-sm text-terminal-text/40">
								Please check your internet connection and try refreshing the
								page.
							</p>
						</div>
					</div>
				</TerminalWindow>
			</div>
			<div className="space-y-6 lg:col-span-2">
				<ScanStatsDisplay stats={stats} onClearHistory={onClearHistory} />
				<ScanHistoryList
					scanHistory={scanHistory}
					onRemoveScan={onRemoveScan}
				/>
			</div>
		</div>
	)
}
