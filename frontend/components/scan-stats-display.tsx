'use client'

import NumberFlow from '@number-flow/react'
import { CheckCircle, Copy, RotateCcw, ShieldX, Users } from 'lucide-react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { TerminalPanel } from '@/components/ui/terminal-panel'
import type { ScanStats } from '@/hooks/use-scan-history'

interface ScanStatsDisplayProps {
	stats: ScanStats
	onClearHistory: () => void
}

export function ScanStatsDisplay({
	stats,
	onClearHistory
}: ScanStatsDisplayProps) {
	const validRate =
		stats.totalScans > 0
			? Math.round((stats.validScans / stats.totalScans) * 100)
			: 0
	const duplicateRate =
		stats.totalScans > 0
			? Math.round((stats.duplicateScans / stats.totalScans) * 100)
			: 0

	return (
		<TerminalPanel title="Scan Statistics" subtitle="Session activity overview">
			<div className="space-y-4 p-5">
				{stats.totalScans > 0 && (
					<div className="flex justify-end">
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="text-destructive hover:bg-destructive/10 group"
								>
									<RotateCcw className="group-hover:-rotate-12 transition-transform duration-300" />
									Clear
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Clear Scan History</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure you want to clear all scan history? This will
										permanently delete all scan records and cannot be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={onClearHistory}
										className="bg-destructive hover:bg-destructive/90"
									>
										Clear All
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				)}

				<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
					<div className="border border-terminal-window-border bg-terminal-card p-3 text-center transition-colors hover:border-terminal-cyan/30">
						<div className="mb-2 flex items-center justify-center">
							<Users className="size-5 text-terminal-cyan" />
						</div>
						<div className="text-2xl font-bold text-terminal-text">
							<NumberFlow
								value={stats.totalScans}
								format={{ notation: 'compact' }}
								transformTiming={{ duration: 600, easing: 'ease-out' }}
								spinTiming={{ duration: 800, easing: 'ease-out' }}
							/>
						</div>
						<div className="break-words text-xs text-terminal-text/50">
							Total Scans
						</div>
					</div>

					<div className="border border-terminal-window-border bg-terminal-card p-3 text-center transition-colors hover:border-terminal-cyan/30">
						<div className="mb-2 flex items-center justify-center">
							<CheckCircle className="size-5 text-terminal-cyan" />
						</div>
						<div className="text-2xl font-bold text-terminal-lightGreen">
							<NumberFlow
								value={stats.validScans}
								format={{ notation: 'compact' }}
								transformTiming={{ duration: 600, easing: 'ease-out' }}
								spinTiming={{ duration: 800, easing: 'ease-out' }}
							/>
						</div>
						<div className="break-words text-xs text-terminal-text/50">
							Valid ({validRate}%)
						</div>
					</div>

					<div className="border border-terminal-window-border bg-terminal-card p-3 text-center transition-colors hover:border-terminal-cyan/30">
						<div className="mb-2 flex items-center justify-center">
							<ShieldX className="size-5 text-destructive" />
						</div>
						<div className="text-2xl font-bold text-destructive">
							<NumberFlow
								value={stats.invalidScans}
								format={{ notation: 'compact' }}
								transformTiming={{ duration: 600, easing: 'ease-out' }}
								spinTiming={{ duration: 800, easing: 'ease-out' }}
							/>
						</div>
						<div className="break-words text-xs text-terminal-text/50">
							Invalid ({100 - validRate}%)
						</div>
					</div>

					<div className="border border-terminal-window-border bg-terminal-card p-3 text-center transition-colors hover:border-terminal-cyan/30">
						<div className="mb-2 flex items-center justify-center">
							<Copy className="size-5 text-terminal-cyan" />
						</div>
						<div className="text-2xl font-bold text-terminal-cyan">
							<NumberFlow
								value={stats.duplicateScans}
								format={{ notation: 'compact' }}
								transformTiming={{ duration: 600, easing: 'ease-out' }}
								spinTiming={{ duration: 800, easing: 'ease-out' }}
							/>
						</div>
						<div className="break-words text-xs leading-tight text-terminal-text/50">
							<div>Duplicates</div>
							<div>({duplicateRate}%)</div>
						</div>
					</div>
				</div>
			</div>
		</TerminalPanel>
	)
}
