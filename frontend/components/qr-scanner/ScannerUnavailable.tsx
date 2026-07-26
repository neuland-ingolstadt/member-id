'use client'

import { AlertTriangle } from 'lucide-react'
import { ScanHistoryList } from '@/components/scan-history'
import { ScanStatsDisplay } from '@/components/scan-stats-display'
import { TerminalPanel } from '@/components/ui/terminal-panel'
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
		<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
			<div className="lg:col-span-3 space-y-6">
				<TerminalPanel title="Scanner Unavailable">
					<div className="flex items-center justify-center p-6 py-12">
						<div className="max-w-md text-center">
							<div className="mx-auto mb-4 flex size-20 items-center justify-center border border-destructive/30 bg-destructive/10">
								<AlertTriangle className="size-12 text-destructive" />
							</div>
							<h3 className="mb-2 text-xl font-bold text-destructive">
								QR Scanner Unavailable
							</h3>
							<p className="mb-4 text-terminal-text/60">
								The public key required for verification could not be loaded.
							</p>
							{errorMessage && (
								<div className="border border-destructive/20 bg-destructive/10 p-4">
									<p className="text-sm text-destructive">
										<strong>Error:</strong> {errorMessage}
									</p>
								</div>
							)}
							<p className="mt-4 text-sm text-terminal-text/45">
								Please check your internet connection and try refreshing the
								page.
							</p>
						</div>
					</div>
				</TerminalPanel>
			</div>
			<div className="lg:col-span-2 space-y-6">
				<ScanStatsDisplay stats={stats} onClearHistory={onClearHistory} />
				<ScanHistoryList
					scanHistory={scanHistory}
					onRemoveScan={onRemoveScan}
				/>
			</div>
		</div>
	)
}
