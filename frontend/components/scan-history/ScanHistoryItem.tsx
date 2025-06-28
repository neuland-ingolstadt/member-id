'use client'

import {
	CheckCircle,
	Clock,
	Info,
	ShieldX,
	Smartphone,
	Ticket,
	Trash2,
	User,
	X
} from 'lucide-react'
import { memo, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { ScanRecord } from '@/hooks/use-scan-history'
import { getQRTypeDisplayName } from './utils'

interface ScanHistoryItemProps {
	scan: ScanRecord
	isLast: boolean
	onRemoveScan: (scanId: string) => void
}

export const ScanHistoryItem = memo(function ScanHistoryItem({
	scan,
	isLast,
	onRemoveScan
}: ScanHistoryItemProps) {
	const [isOpen, setIsOpen] = useState(false)

	const handleDelete = () => {
		onRemoveScan(scan.id)
		setIsOpen(false)
	}

	return (
		<div className="w-full">
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<div
						className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer ${
							scan.result.success
								? scan.isDuplicate
									? 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10'
									: 'border-green-200 bg-green-50/50 hover:bg-green-50 dark:border-green-800 dark:bg-green-900/10'
								: 'border-red-200 bg-red-50/50 hover:bg-red-50 dark:border-red-800 dark:bg-red-900/10'
						}`}
					>
						<div className="flex items-start gap-3">
							{/* Status Icon */}
							<div className="flex-shrink-0 mt-1">
								{scan.result.success ? (
									<CheckCircle className="h-5 w-5 text-green-500" />
								) : (
									<ShieldX className="h-5 w-5 text-red-500" />
								)}
							</div>

							{/* Scan Info */}
							<div className="flex-1 min-w-0 overflow-hidden">
								<div className="flex items-center gap-2 mb-1 min-w-0">
									{scan.result.success && scan.result.payload ? (
										<p className="font-medium text-gray-900 dark:text-white truncate min-w-0">
											{scan.result.payload.name}
										</p>
									) : (
										<p className="font-medium text-red-700 dark:text-red-400 truncate min-w-0">
											Invalid Neuland ID
										</p>
									)}

									{/* Duplicate Warning */}
									{scan.isDuplicate && (
										<Badge
											variant="outline"
											className="text-xs border-blue-400 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 flex items-center flex-shrink-0"
										>
											<Info className="h-3 w-3 mr-1" />
											<span className="hidden sm:inline">Already Verified</span>
											<span className="sm:hidden">Duplicate</span>
										</Badge>
									)}
								</div>

								<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
									{new Date(scan.timestamp).toLocaleString()}
								</p>

								{/* QR Data Preview */}
								<div className="mt-2 min-w-0">
									<p className="text-xs text-gray-600 dark:text-gray-400 font-mono truncate break-all">
										{scan.result.success && scan.result.payload
											? getQRTypeDisplayName(scan.result.payload.type)
											: scan.qrData.length > 30
												? `${scan.qrData.slice(0, 30)}...`
												: scan.qrData}
									</p>
								</div>
							</div>
						</div>
					</div>
				</DialogTrigger>
				<DialogContent
					className="max-w-2xl max-h-[80vh] overflow-y-auto"
					onPointerDownOutside={(e) => e.preventDefault()}
				>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							{scan.result.success ? (
								<CheckCircle className="h-5 w-5 text-green-500" />
							) : (
								<ShieldX className="h-5 w-5 text-red-500" />
							)}
							{scan.result.success && scan.result.payload
								? scan.result.payload.name
								: 'Invalid Neuland ID'}
							{scan.isDuplicate && (
								<Badge
									variant="outline"
									className="text-xs border-blue-400 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20"
								>
									Already Verified
								</Badge>
							)}
						</DialogTitle>
					</DialogHeader>

					{scan.result.success && scan.result.payload ? (
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
								<div>
									<div className="flex items-center gap-2 mb-1">
										<User className="h-4 w-4 text-gray-500" />
										<span className="font-medium text-gray-700 dark:text-gray-300">
											Name
										</span>
									</div>
									<p className="text-gray-900 dark:text-white pl-6">
										{scan.result.payload.name}
									</p>
								</div>

								<div>
									<div className="flex items-center gap-2 mb-1">
										<ShieldX className="h-4 w-4 text-gray-500" />
										<span className="font-medium text-gray-700 dark:text-gray-300">
											User ID
										</span>
									</div>
									<p className="text-gray-600 dark:text-gray-400 font-mono text-xs pl-6 break-all">
										{scan.result.payload.sub}
									</p>
								</div>

								<div>
									<div className="flex items-center gap-2 mb-1">
										{scan.result.payload.type === 'app' ? (
											<Smartphone className="h-4 w-4 text-gray-500" />
										) : scan.result.payload.type === 'apple_wallet' ? (
											<Ticket className="h-4 w-4 text-gray-500" />
										) : scan.result.payload.type === 'android_wallet' ? (
											<Smartphone className="h-4 w-4 text-gray-500" />
										) : (
											<ShieldX className="h-4 w-4 text-gray-500" />
										)}
										<span className="font-medium text-gray-700 dark:text-gray-300">
											QR Type
										</span>
									</div>
									<p className="text-gray-600 dark:text-gray-400 text-xs pl-6">
										{getQRTypeDisplayName(scan.result.payload.type)}
									</p>
								</div>

								<div>
									<div className="flex items-center gap-2 mb-1">
										<Clock className="h-4 w-4 text-gray-500" />
										<span className="font-medium text-gray-700 dark:text-gray-300">
											Scanned At
										</span>
									</div>
									<p className="text-gray-600 dark:text-gray-400 text-xs pl-6">
										{new Date(scan.timestamp).toLocaleString()}
									</p>
								</div>

								<div>
									<div className="flex items-center gap-2 mb-1">
										<Clock className="h-4 w-4 text-gray-500" />
										<span className="font-medium text-gray-700 dark:text-gray-300">
											Issued
										</span>
									</div>
									<p className="text-gray-600 dark:text-gray-400 text-xs pl-6">
										{new Date(scan.result.payload.iat * 1000).toLocaleString()}
									</p>
								</div>

								<div>
									<div className="flex items-center gap-2 mb-1">
										<Clock className="h-4 w-4 text-gray-500" />
										<span className="font-medium text-gray-700 dark:text-gray-300">
											Expires
										</span>
									</div>
									<p className="text-gray-600 dark:text-gray-400 text-xs pl-6">
										{new Date(scan.result.payload.exp * 1000).toLocaleString()}
									</p>
								</div>
							</div>

							{/* Full QR Data */}
							<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
								<p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Full Data:
								</p>

								{/* Info box for truncated data */}
								{scan.qrData === '[QR data truncated for security]' ? (
									<Alert className="mb-3 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
										<Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
										<AlertTitle className="text-blue-800 dark:text-blue-200">
											Data Hidden for Security
										</AlertTitle>
										<AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
											The Neuland ID data has been hidden to protect sensitive
											information.
										</AlertDescription>
									</Alert>
								) : (
									<div className="bg-gray-100 dark:bg-gray-800 rounded p-3 max-h-48 overflow-auto">
										<code className="text-xs text-gray-800 dark:text-gray-200 break-all whitespace-pre-wrap">
											{scan.qrData}
										</code>
									</div>
								)}
							</div>

							{/* Delete Button */}
							<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
								<div className="flex justify-start gap-2">
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												variant="destructive"
												size="sm"
												className="flex items-center gap-2"
											>
												<Trash2 className="h-4 w-4" />
												Delete Scan
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Delete Scan Record</AlertDialogTitle>
												<AlertDialogDescription>
													Are you sure you want to delete this scan record? This
													action cannot be undone.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onClick={handleDelete}
													className="bg-red-600 hover:bg-red-700"
												>
													Delete
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							<Alert
								variant="destructive"
								className="bg-red-500/10 border-red-500"
							>
								<AlertTitle className="flex items-center gap-2">
									<b>{scan.result.error}</b>
								</AlertTitle>
								<AlertDescription className="flex items-center gap-2">
									{scan.result.payload ? (
										<p>
											Even there is data returned, it is NOT a valid member
											pass.
										</p>
									) : (
										<p>Not a valid member pass.</p>
									)}
								</AlertDescription>
							</Alert>

							{/* Show payload if available even on error */}
							{scan.result.payload && (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
									<div>
										<div className="flex items-center gap-2 mb-1">
											<User className="h-4 w-4 text-gray-500" />
											<span className="font-medium text-gray-700 dark:text-gray-300">
												Name
											</span>
										</div>
										<p className="text-gray-900 dark:text-white pl-6">
											{scan.result.payload.name}
										</p>
									</div>

									<div>
										<div className="flex items-center gap-2 mb-1">
											<ShieldX className="h-4 w-4 text-gray-500" />
											<span className="font-medium text-gray-700 dark:text-gray-300">
												User ID
											</span>
										</div>
										<p className="text-gray-600 dark:text-gray-400 font-mono text-xs pl-6 break-all">
											{scan.result.payload.sub}
										</p>
									</div>

									<div>
										<div className="flex items-center gap-2 mb-1">
											{scan.result.payload.type === 'app' ? (
												<Smartphone className="h-4 w-4 text-gray-500" />
											) : scan.result.payload.type === 'apple_wallet' ? (
												<Ticket className="h-4 w-4 text-gray-500" />
											) : scan.result.payload.type === 'android_wallet' ? (
												<Smartphone className="h-4 w-4 text-gray-500" />
											) : (
												<ShieldX className="h-4 w-4 text-gray-500" />
											)}
											<span className="font-medium text-gray-700 dark:text-gray-300">
												QR Type
											</span>
										</div>
										<p className="text-gray-600 dark:text-gray-400 text-xs pl-6">
											{getQRTypeDisplayName(scan.result.payload.type)}
										</p>
									</div>

									{scan.result.payload.iat && (
										<div>
											<div className="flex items-center gap-2 mb-1">
												<Clock className="h-4 w-4 text-gray-500" />
												<span className="font-medium text-gray-700 dark:text-gray-300">
													Issued
												</span>
											</div>
											<p className="text-gray-600 dark:text-gray-400 text-xs pl-6">
												{new Date(
													scan.result.payload.iat * 1000
												).toLocaleString()}
											</p>
										</div>
									)}

									{scan.result.payload.exp && (
										<div>
											<div className="flex items-center gap-2 mb-1">
												<Clock className="h-4 w-4 text-gray-500" />
												<span className="font-medium text-gray-700 dark:text-gray-300">
													Expires
												</span>
											</div>
											<p className="text-gray-600 dark:text-gray-400 text-xs pl-6">
												{new Date(
													scan.result.payload.exp * 1000
												).toLocaleString()}
											</p>
										</div>
									)}
								</div>
							)}

							<div>
								<div className="flex items-center gap-2 mb-1">
									<Clock className="h-4 w-4 text-gray-500" />
									<span className="font-medium text-gray-700 dark:text-gray-300">
										Scanned At
									</span>
								</div>
								<p className="text-gray-600 dark:text-gray-400 text-xs pl-6">
									{new Date(scan.timestamp).toLocaleString()}
								</p>
							</div>

							{/* Full QR Data */}
							<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
								<p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Full Data:
								</p>

								{/* Info box for truncated data */}
								{scan.qrData === '[QR data truncated for security]' ? (
									<Alert className="mb-3 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
										<Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
										<AlertTitle className="text-blue-800 dark:text-blue-200">
											Data Hidden for Security
										</AlertTitle>
										<AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
											The Neuland ID data has been hidden to protect sensitive
											information.
										</AlertDescription>
									</Alert>
								) : (
									<div className="bg-gray-100 dark:bg-gray-800 rounded p-3 max-h-48 overflow-auto">
										<code className="text-xs text-gray-800 dark:text-gray-200 break-all whitespace-pre-wrap">
											{scan.qrData}
										</code>
									</div>
								)}
							</div>

							{/* Delete Button */}
							<div className="pt-4 border-t border-gray-200 dark:border-gray-700">
								<div className="flex justify-end gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setIsOpen(false)}
										className="flex items-center gap-2"
									>
										<X className="h-4 w-4" />
										Close
									</Button>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												variant="destructive"
												size="sm"
												className="flex items-center gap-2"
											>
												<Trash2 className="h-4 w-4" />
												Delete Scan
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Delete Scan Record</AlertDialogTitle>
												<AlertDialogDescription>
													Are you sure you want to delete this scan record? This
													action cannot be undone.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onClick={handleDelete}
													className="bg-red-600 hover:bg-red-700"
												>
													Delete
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
			{!isLast && <Separator className="my-2" />}
		</div>
	)
})
