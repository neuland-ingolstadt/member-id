'use client'

import { Clock } from 'lucide-react'
import { TerminalWindow } from '@/components/terminal-window'
import { Badge } from '@/components/ui/badge'
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
			<TerminalWindow title="neuland@verify:~/history">
				<div className="p-6 text-center font-mono text-terminal-text/50">
					<Clock className="mx-auto mb-3 h-12 w-12 opacity-50 transition-transform duration-300 hover:rotate-12" />
					<p className="text-sm">
						<span className="text-terminal-cyan">&gt;</span> No scans recorded
						yet
					</p>
					<p className="mt-1 text-xs text-terminal-text/40">
						Scan Neuland IDs to see them listed here
						<span className="blinking-cursor ml-1">_</span>
					</p>
				</div>
			</TerminalWindow>
		)
	}

	return (
		<TerminalWindow
			title="neuland@verify:~/history"
			headerRight={
				<div className="flex items-center gap-2">
					<Badge
						variant="secondary"
						className="border border-terminal-window-border bg-terminal-card font-mono text-xs"
					>
						{scanHistory.length}
					</Badge>
					<ExportCsvButton scanHistory={scanHistory} />
				</div>
			}
		>
			<div className="h-[60vh] overflow-y-auto scrollbar-thin">
				<div className="space-y-2 p-4 font-mono">
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
		</TerminalWindow>
	)
}
