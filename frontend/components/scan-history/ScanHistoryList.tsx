'use client'

import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ScanRecord } from '@/hooks/use-scan-history'
import { ExportCsvButton } from './ExportCsvButton'
import { ScanHistoryItem } from './ScanHistoryItem'

interface ScanHistoryListProps {
	scanHistory: ScanRecord[]
	onRemoveScan: (scanId: string) => void
}

export function ScanHistoryList({
	scanHistory,
	onRemoveScan
}: ScanHistoryListProps) {
	if (scanHistory.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-lg font-semibold flex items-center gap-2">
						<div className="p-2 bg-primary rounded-full text-background">
							<Clock className="h-5 w-5" />
						</div>
						Scan History
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8 text-gray-500 dark:text-gray-400">
						<Clock className="h-12 w-12 mx-auto mb-3 opacity-50 transition-transform duration-300 hover:rotate-12" />
						<p className="text-sm">No scans recorded yet</p>
						<p className="text-xs mt-1">
							Scan Member IDs to see them listed here
						</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center">
				<div className="flex items-center gap-2">
					<Clock className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
					<CardTitle className="text-lg font-semibold">Scan History</CardTitle>
					<Badge variant="secondary">{scanHistory.length}</Badge>
				</div>
				<div className="ml-auto flex items-center gap-2">
					<ExportCsvButton scanHistory={scanHistory} />
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<ScrollArea className="h-[60vh] w-full">
					<div className="space-y-2 p-4 w-full">
						{scanHistory.map((scan, index) => (
							<ScanHistoryItem
								key={scan.id}
								scan={scan}
								isLast={index === scanHistory.length - 1}
								onRemoveScan={onRemoveScan}
							/>
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	)
}
