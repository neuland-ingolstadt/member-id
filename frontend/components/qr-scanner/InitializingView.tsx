'use client'

import { ScanHistoryList } from '@/components/scan-history'
import { ScanStatsDisplay } from '@/components/scan-stats-display'
import { Card, CardContent } from '@/components/ui/card'
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
		<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
			<div className="lg:col-span-3 space-y-6">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-center py-12">
							<div className="text-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
								<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
									Initializing QR Scanner...
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
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
