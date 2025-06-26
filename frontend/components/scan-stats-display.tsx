'use client'

import {
	BarChart3,
	CheckCircle,
	Copy,
	RotateCcw,
	Shield,
	Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
		<Card>
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-primary rounded-full text-background">
							<BarChart3 className="h-5 w-5" />
						</div>
						<div>
							<CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
								Scan Statistics
							</CardTitle>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Session activity overview
							</p>
						</div>
					</div>
					{stats.totalScans > 0 && (
						<Button
							variant="outline"
							size="sm"
							onClick={onClearHistory}
							className="text-destructive hover:bg-destructive/10"
						>
							<RotateCcw className="h-4 w-4 mr-1" />
							Clear
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
					{/* Total Scans */}
					<div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-primary/20 hover:border-primary/30">
						<div className="flex items-center justify-center mb-2">
							<Users className="h-5 w-5 text-primary" />
						</div>
						<div className="text-2xl font-bold text-gray-900 dark:text-white">
							{stats.totalScans}
						</div>
						<div className="text-xs text-gray-600 dark:text-gray-400 break-words">
							Total Scans
						</div>
					</div>

					{/* Valid Scans */}
					<div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-green-500/20 hover:border-green-500/30">
						<div className="flex items-center justify-center mb-2">
							<CheckCircle className="h-5 w-5 text-green-500" />
						</div>
						<div className="text-2xl font-bold text-green-600 dark:text-green-500">
							{stats.validScans}
						</div>
						<div className="text-xs text-gray-600 dark:text-gray-400 break-words">
							Valid ({validRate}%)
						</div>
					</div>

					{/* Invalid Scans */}
					<div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-red-500/20 hover:border-red-500/30">
						<div className="flex items-center justify-center mb-2">
							<Shield className="h-5 w-5 text-destructive" />
						</div>
						<div className="text-2xl font-bold text-red-600 dark:text-red-500">
							{stats.invalidScans}
						</div>
						<div className="text-xs text-gray-600 dark:text-gray-400 break-words">
							Invalid ({100 - validRate}%)
						</div>
					</div>

					{/* Duplicate Scans */}
					<div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out  hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/30">
						<div className="flex items-center justify-center mb-2">
							<Copy className="h-5 w-5 text-blue-600" />
						</div>
						<div className="text-2xl font-bold text-blue-600 dark:text-blue-500">
							{stats.duplicateScans}
						</div>
						<div className="text-xs text-gray-600 dark:text-gray-400 break-words leading-tight">
							<div>Duplicates</div>
							<div>({duplicateRate}%)</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
