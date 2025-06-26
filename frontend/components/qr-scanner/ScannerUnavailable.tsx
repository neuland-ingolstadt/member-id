'use client'

import { AlertTriangle } from 'lucide-react'
import { ScanHistoryList } from '@/components/scan-history'
import { ScanStatsDisplay } from '@/components/scan-stats-display'
import { Card, CardContent } from '@/components/ui/card'
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
				<Card className="border-destructive/50 bg-white dark:bg-gray-800">
					<CardContent className="p-6">
						<div className="flex items-center justify-center py-12">
							<div className="text-center max-w-md">
								<div className="mb-4 bg-destructive/10 rounded-full p-3 w-20 h-20 flex items-center justify-center mx-auto">
									<AlertTriangle className="h-12 w-12 text-destructive" />
								</div>
								<h3 className="text-xl font-bold text-destructive mb-2">
									QR Scanner Unavailable
								</h3>
								<p className="text-gray-600 dark:text-gray-400 mb-4">
									The public key required for verification could not be loaded.
								</p>
								{errorMessage && (
									<div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
										<p className="text-destructive text-sm">
											<strong>Error:</strong> {errorMessage}
										</p>
									</div>
								)}
								<p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
									Please check your internet connection and try refreshing the
									page.
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
