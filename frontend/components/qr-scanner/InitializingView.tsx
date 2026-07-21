'use client'

import { ScanHistoryList } from '@/components/scan-history'
import { ScanStatsDisplay } from '@/components/scan-stats-display'
import { TerminalWindow } from '@/components/terminal-window'
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
				<TerminalWindow title="neuland@verify:~/boot">
					<div className="flex items-center justify-center py-12">
						<div className="text-center font-mono">
							<div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-terminal-cyan border-t-transparent" />
							<p className="text-sm font-medium text-terminal-text">
								<span className="text-terminal-cyan">&gt;</span> Loading public
								key
								<span className="blinking-cursor">_</span>
							</p>
							<p className="mt-2 text-xs text-terminal-text/40">
								Initializing QR Scanner...
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
