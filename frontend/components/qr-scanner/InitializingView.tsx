'use client'

import { ScanHistoryList } from '@/components/scan-history'
import { ScanStatsDisplay } from '@/components/scan-stats-display'
import { TerminalPanel } from '@/components/ui/terminal-panel'
import type { ScanRecord, ScanStats } from '@/hooks/use-scan-history'

interface InitializingViewProps {
	stats: ScanStats
	scanHistory: ScanRecord[]
	onClearHistory: () => void
	onRemoveScan: (id: string) => void
}

export function InitializingView({
	stats,
	scanHistory,
	onClearHistory,
	onRemoveScan
}: InitializingViewProps) {
	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
			<div className="space-y-6 lg:col-span-3">
				<TerminalPanel title="Scanner">
					<div className="flex items-center justify-center py-12">
						<div className="text-center">
							<div className="mx-auto mb-4 size-8 animate-spin border-b-2 border-terminal-cyan" />
							<p className="font-mono text-sm font-medium text-terminal-text/70">
								Initializing QR Scanner...
							</p>
						</div>
					</div>
				</TerminalPanel>
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
