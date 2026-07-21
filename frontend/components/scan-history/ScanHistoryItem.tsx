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
						className={`w-full cursor-pointer border p-4 text-left transition-all ${
							scan.result.success
								? scan.isDuplicate
									? 'border-sky-400/30 bg-sky-400/5 hover:border-sky-400/50 hover:bg-sky-400/10'
									: 'border-terminal-cyan/30 bg-terminal-cyan/5 hover:border-terminal-cyan/50 hover:bg-terminal-cyan/10'
								: 'border-destructive/30 bg-destructive/5 hover:border-destructive/50 hover:bg-destructive/10'
						}`}
					>
						<div className="flex items-start gap-3">
							<div className="mt-1 flex-shrink-0">
								{scan.result.success ? (
									<CheckCircle className="h-5 w-5 text-terminal-cyan" />
								) : (
									<ShieldX className="h-5 w-5 text-destructive" />
								)}
							</div>

							<div className="min-w-0 flex-1 overflow-hidden">
								<div className="mb-1 flex min-w-0 items-center gap-2">
									{scan.result.success && scan.result.payload ? (
										<p className="min-w-0 truncate font-medium text-terminal-text">
											{scan.result.payload.name}
										</p>
									) : (
										<p className="min-w-0 truncate font-medium text-destructive">
											Invalid Neuland ID
										</p>
									)}

									{scan.isDuplicate && (
										<Badge
											variant="outline"
											className="flex flex-shrink-0 items-center border-sky-400 bg-sky-400/10 text-xs text-sky-400"
										>
											<Info className="mr-1 h-3 w-3" />
											<span className="hidden sm:inline">Already Verified</span>
											<span className="sm:hidden">Duplicate</span>
										</Badge>
									)}
								</div>

								<p className="truncate text-xs text-terminal-text/40">
									{new Date(scan.timestamp).toLocaleString()}
								</p>

								<div className="mt-2 min-w-0">
									<p className="truncate break-all font-mono text-xs text-terminal-text/50">
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
					className="max-h-[80vh] max-w-2xl overflow-y-auto border-terminal-window-border bg-terminal-window font-mono"
					onPointerDownOutside={(e) => e.preventDefault()}
				>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-terminal-text">
							{scan.result.success ? (
								<CheckCircle className="h-5 w-5 text-terminal-cyan" />
							) : (
								<ShieldX className="h-5 w-5 text-destructive" />
							)}
							{scan.result.success && scan.result.payload
								? scan.result.payload.name
								: 'Invalid Neuland ID'}
							{scan.isDuplicate && (
								<Badge
									variant="outline"
									className="border-sky-400 bg-sky-400/10 text-xs text-sky-400"
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
									<div className="mb-1 flex items-center gap-2">
										<User className="h-4 w-4 text-terminal-cyan/70" />
										<span className="font-medium text-terminal-text/70">
											Name
										</span>
									</div>
									<p className="pl-6 text-terminal-text">
										{scan.result.payload.name}
									</p>
								</div>

								<div>
									<div className="mb-1 flex items-center gap-2">
										<ShieldX className="h-4 w-4 text-terminal-cyan/70" />
										<span className="font-medium text-terminal-text/70">
											User ID
										</span>
									</div>
									<p className="break-all pl-6 font-mono text-xs text-terminal-text/60">
										{scan.result.payload.sub}
									</p>
								</div>

								<div>
									<div className="mb-1 flex items-center gap-2">
										{scan.result.payload.type === 'app' ? (
											<Smartphone className="h-4 w-4 text-terminal-cyan/70" />
										) : scan.result.payload.type === 'apple_wallet' ? (
											<Ticket className="h-4 w-4 text-terminal-cyan/70" />
										) : scan.result.payload.type === 'android_wallet' ? (
											<Smartphone className="h-4 w-4 text-terminal-cyan/70" />
										) : (
											<ShieldX className="h-4 w-4 text-terminal-cyan/70" />
										)}
										<span className="font-medium text-terminal-text/70">
											QR Type
										</span>
									</div>
									<p className="pl-6 text-xs text-terminal-text/60">
										{getQRTypeDisplayName(scan.result.payload.type)}
									</p>
								</div>

								<div>
									<div className="mb-1 flex items-center gap-2">
										<Clock className="h-4 w-4 text-terminal-cyan/70" />
										<span className="font-medium text-terminal-text/70">
											Scanned At
										</span>
									</div>
									<p className="pl-6 text-xs text-terminal-text/60">
										{new Date(scan.timestamp).toLocaleString()}
									</p>
								</div>

								<div>
									<div className="mb-1 flex items-center gap-2">
										<Clock className="h-4 w-4 text-terminal-cyan/70" />
										<span className="font-medium text-terminal-text/70">
											Issued
										</span>
									</div>
									<p className="pl-6 text-xs text-terminal-text/60">
										{new Date(scan.result.payload.iat * 1000).toLocaleString()}
									</p>
								</div>

								<div>
									<div className="mb-1 flex items-center gap-2">
										<Clock className="h-4 w-4 text-terminal-cyan/70" />
										<span className="font-medium text-terminal-text/70">
											Expires
										</span>
									</div>
									<p className="pl-6 text-xs text-terminal-text/60">
										{new Date(scan.result.payload.exp * 1000).toLocaleString()}
									</p>
								</div>
							</div>

							<div className="border-t border-terminal-window-border pt-4">
								<p className="mb-2 text-sm font-medium text-terminal-text/70">
									Full Data:
								</p>

								{scan.qrData === '[QR data truncated for security]' ? (
									<Alert className="mb-3 border-sky-400/30 bg-sky-400/10">
										<Info className="h-4 w-4 text-sky-400" />
										<AlertTitle className="text-sky-300">
											Data Hidden for Security
										</AlertTitle>
										<AlertDescription className="text-sm text-sky-300/80">
											The Neuland ID data has been hidden to protect sensitive
											information.
										</AlertDescription>
									</Alert>
								) : (
									<div className="max-h-48 overflow-auto border border-terminal-window-border bg-terminal-card p-3">
										<code className="whitespace-pre-wrap break-all text-xs text-terminal-text/80">
											{scan.qrData}
										</code>
									</div>
								)}
							</div>

							<div className="border-t border-terminal-window-border pt-4">
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
											<User className="h-4 w-4 text-terminal-cyan/70" />
											<span className="font-medium text-terminal-text/70">
												Name
											</span>
										</div>
										<p className="pl-6 text-terminal-text">
											{scan.result.payload.name}
										</p>
									</div>

									<div>
										<div className="flex items-center gap-2 mb-1">
											<ShieldX className="h-4 w-4 text-terminal-cyan/70" />
											<span className="font-medium text-terminal-text/70">
												User ID
											</span>
										</div>
										<p className="break-all pl-6 font-mono text-xs text-terminal-text/60">
											{scan.result.payload.sub}
										</p>
									</div>

									<div>
										<div className="flex items-center gap-2 mb-1">
											{scan.result.payload.type === 'app' ? (
												<Smartphone className="h-4 w-4 text-terminal-cyan/70" />
											) : scan.result.payload.type === 'apple_wallet' ? (
												<Ticket className="h-4 w-4 text-terminal-cyan/70" />
											) : scan.result.payload.type === 'android_wallet' ? (
												<Smartphone className="h-4 w-4 text-terminal-cyan/70" />
											) : (
												<ShieldX className="h-4 w-4 text-terminal-cyan/70" />
											)}
											<span className="font-medium text-terminal-text/70">
												QR Type
											</span>
										</div>
										<p className="pl-6 text-xs text-terminal-text/60">
											{getQRTypeDisplayName(scan.result.payload.type)}
										</p>
									</div>

									{scan.result.payload.iat && (
										<div>
											<div className="flex items-center gap-2 mb-1">
												<Clock className="h-4 w-4 text-terminal-cyan/70" />
												<span className="font-medium text-terminal-text/70">
													Issued
												</span>
											</div>
											<p className="pl-6 text-xs text-terminal-text/60">
												{new Date(
													scan.result.payload.iat * 1000
												).toLocaleString()}
											</p>
										</div>
									)}

									{scan.result.payload.exp && (
										<div>
											<div className="flex items-center gap-2 mb-1">
												<Clock className="h-4 w-4 text-terminal-cyan/70" />
												<span className="font-medium text-terminal-text/70">
													Expires
												</span>
											</div>
											<p className="pl-6 text-xs text-terminal-text/60">
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
									<Clock className="h-4 w-4 text-terminal-cyan/70" />
									<span className="font-medium text-terminal-text/70">
										Scanned At
									</span>
								</div>
								<p className="pl-6 text-xs text-terminal-text/60">
									{new Date(scan.timestamp).toLocaleString()}
								</p>
							</div>

							{/* Full QR Data */}
							<div className="border-t border-terminal-window-border pt-4">
								<p className="text-sm font-medium text-terminal-text/70 mb-2">
									Full Data:
								</p>

								{/* Info box for truncated data */}
								{scan.qrData === '[QR data truncated for security]' ? (
									<Alert className="mb-3 border-sky-400/30 bg-sky-400/10">
										<Info className="h-4 w-4 text-sky-400" />
										<AlertTitle className="text-sky-300">
											Data Hidden for Security
										</AlertTitle>
										<AlertDescription className="text-sm text-sky-300/80">
											The Neuland ID data has been hidden to protect sensitive
											information.
										</AlertDescription>
									</Alert>
								) : (
									<div className="max-h-48 overflow-auto border border-terminal-window-border bg-terminal-card p-3">
										<code className="whitespace-pre-wrap break-all text-xs text-terminal-text/80">
											{scan.qrData}
										</code>
									</div>
								)}
							</div>

							{/* Delete Button */}
							<div className="border-t border-terminal-window-border pt-4">
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
