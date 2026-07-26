'use client'

import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { TerminalPanel } from '@/components/ui/terminal-panel'
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
			<TerminalPanel title="Scan History">
				<div className="py-8 text-center text-terminal-text/50">
					<Clock className="mx-auto mb-3 size-12 opacity-50 transition-transform duration-300 hover:rotate-12" />
					<p className="text-sm">No scans recorded yet</p>
					<p className="mt-1 text-xs">
						Scan Neuland IDs to see them listed here
					</p>
				</div>
			</TerminalPanel>
		)
	}

	return (
		<TerminalPanel
			title="Scan History"
			subtitle={`${scanHistory.length} records`}
		>
			<div className="flex items-center justify-end gap-2 border-b border-terminal-window-border px-4 py-2">
				<Badge variant="secondary">{scanHistory.length}</Badge>
				<ExportCsvButton scanHistory={scanHistory} />
			</div>
			<div className="h-[60vh] overflow-y-auto">
				<div className="space-y-2 p-4">
					{scanHistory.map((scan, index) => (
						<ScanHistoryItem
							key={scan.id}
							scan={scan}
							isLast={index === scanHistory.length - 1}
							onRemoveScan={onRemoveScan}
						/>
					))}
				</div>
			</div>
		</TerminalPanel>
	)
}
