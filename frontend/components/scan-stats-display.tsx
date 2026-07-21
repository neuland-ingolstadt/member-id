'use client'

import NumberFlow from '@number-flow/react'
import {
	BarChart3,
	CheckCircle,
	Copy,
	RotateCcw,
	ShieldX,
	Users
} from 'lucide-react'
import { TerminalWindow } from '@/components/terminal-window'
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
		<TerminalWindow
			title="neuland@verify:~/stats"
			headerRight={
				stats.totalScans > 0 ? (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="h-7 border-destructive/40 px-2 text-xs text-destructive hover:bg-destructive/10"
							>
								<RotateCcw className="mr-1 h-3 w-3" />
								clear
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent className="border-terminal-window-border bg-terminal-window font-mono">
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
				) : undefined
			}
		>
			<div className="p-4 font-mono">
				<div className="mb-3 flex items-center gap-2 text-xs text-terminal-text/50">
					<BarChart3 className="h-3.5 w-3.5 text-terminal-cyan" />
					Session activity overview
				</div>
				<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
					<div className="border border-terminal-window-border bg-terminal-card p-3 text-center transition-colors hover:border-terminal-cyan/40">
						<div className="mb-2 flex items-center justify-center">
							<Users className="h-5 w-5 text-terminal-cyan" />
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

					<div className="border border-terminal-window-border bg-terminal-card p-3 text-center transition-colors hover:border-terminal-cyan/40">
						<div className="mb-2 flex items-center justify-center">
							<CheckCircle className="h-5 w-5 text-terminal-cyan" />
						</div>
						<div className="text-2xl font-bold text-terminal-cyan">
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

					<div className="border border-terminal-window-border bg-terminal-card p-3 text-center transition-colors hover:border-destructive/40">
						<div className="mb-2 flex items-center justify-center">
							<ShieldX className="h-5 w-5 text-destructive" />
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

					<div className="border border-terminal-window-border bg-terminal-card p-3 text-center transition-colors hover:border-sky-400/40">
						<div className="mb-2 flex items-center justify-center">
							<Copy className="h-5 w-5 text-sky-400" />
						</div>
						<div className="text-2xl font-bold text-sky-400">
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
		</TerminalWindow>
	)
}
