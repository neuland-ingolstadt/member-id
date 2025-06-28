'use client'

import {
	CheckCircle,
	Clock,
	Info,
	ShieldX,
	Smartphone,
	Ticket,
	TriangleAlert,
	User
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { ScanRecord } from '@/hooks/use-scan-history'
import { getRelativeTime } from '@/lib/date'
import { QRType, type VerificationResult } from '@/lib/qr-verifier'
import { DebugInfo } from './DebugInfo'

interface Props {
	result: VerificationResult | null
	duplicateWarning: ScanRecord | null
}

export function ResultCard({ result, duplicateWarning }: Props) {
	if (result) {
		return (
			<Card
				className={` ${
					result.success
						? duplicateWarning
							? 'border-blue-200 bg-white dark:bg-gray-800'
							: 'border-green-200 bg-white dark:bg-gray-800'
						: 'border-destructive/50 bg-white dark:bg-gray-800'
				}`}
			>
				<CardContent className="p-6">
					<div className="flex items-center gap-3 mb-6">
						{result.success ? (
							<div className="flex items-center gap-2">
								<div
									className={`p-2 ${duplicateWarning ? 'bg-blue-600' : 'bg-green-600'} rounded-full text-white`}
								>
									{duplicateWarning ? (
										<Info className="h-6 w-6" />
									) : (
										<CheckCircle className="h-6 w-6" />
									)}
								</div>
								<div>
									<h3
										className={`text-xl font-bold ${duplicateWarning ? 'text-blue-800 dark:text-blue-300' : 'text-green-800 dark:text-green-300'}`}
									>
										{duplicateWarning
											? 'Already Verified'
											: 'Verification Successful'}
									</h3>
									<p
										className={`${duplicateWarning ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'} text-sm`}
									>
										{duplicateWarning?.result?.payload
											? `Originally verified with ${
													duplicateWarning.result.payload.type === QRType.APP
														? 'App Neuland ID'
														: duplicateWarning.result.payload.type ===
																QRType.APPLE_WALLET
															? 'Apple Wallet Pass'
															: duplicateWarning.result.payload.type ===
																	QRType.ANDROID_WALLET
																? 'Android Wallet Pass'
																: duplicateWarning.result.payload.type
												} at ${new Date(duplicateWarning.timestamp).toLocaleTimeString()}`
											: 'Neuland ID signature is valid'}
									</p>
								</div>
							</div>
						) : (
							<div className="flex items-center gap-2">
								<div className="p-2 bg-destructive rounded-full text-destructive-foreground">
									<ShieldX className="h-6 w-6" />
								</div>
								<div>
									<h3 className="text-xl font-bold text-destructive">
										Verification Failed
									</h3>
								</div>
							</div>
						)}
						<div className="ml-auto">
							<Badge
								variant={
									result.success
										? duplicateWarning
											? 'outline'
											: 'default'
										: 'destructive'
								}
								className={`text-sm px-3 py-1 ${duplicateWarning ? 'border-blue-400 text-blue-700 dark:text-blue-300' : ''} flex items-center gap-1.5`}
							>
								{result.success ? (
									duplicateWarning ? (
										<>
											<TriangleAlert className="h-3 w-3" /> Duplicate
										</>
									) : (
										<>
											<CheckCircle className="h-3 w-3" /> Valid
										</>
									)
								) : (
									<>
										<ShieldX className="h-3 w-3" /> Invalid
									</>
								)}
							</Badge>
						</div>
					</div>

					{result.error && (
						<div className="mb-6 space-y-1 p-4 bg-destructive/10 border border-destructive rounded-lg">
							<p className="text-destructive text-sm font-medium font-bold">
								{result.error}
							</p>
							<p className="text-destructive text-xs">
								{result.payload
									? 'Even there is data returned, it is NOT a valid member pass.'
									: 'Not a valid member pass.'}
							</p>
						</div>
					)}

					{result.payload && (
						<div className="space-y-6">
							<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-inner border border-gray-200 dark:border-gray-700">
								<div className="flex items-center gap-4 mb-4">
									<div className="p-3 bg-primary rounded-full text-background">
										<User className="h-6 w-6" />
									</div>
									<div>
										<h4 className="text-lg font-semibold text-gray-900 dark:text-white">
											Identity Information
										</h4>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											Verified credential data
										</p>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<User className="h-4 w-4 text-gray-500" />
											<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
												Name
											</span>
										</div>
										<p className="text-lg font-semibold text-gray-900 dark:text-white pl-6">
											{result.payload.name}
										</p>
									</div>

									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<ShieldX className="h-4 w-4 text-gray-500" />
											<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
												User ID
											</span>
										</div>
										<p className="text-sm font-mono text-gray-600 dark:text-gray-400 pl-6 break-all">
											{result.payload.sub}
										</p>
									</div>

									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4 text-gray-500" />
											<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
												Issued
											</span>
										</div>
										<div className="pl-6 space-y-1">
											<p className="text-sm text-gray-600 dark:text-gray-400">
												{new Date(result.payload.iat * 1000).toLocaleDateString(
													'en-US',
													{
														year: 'numeric',
														month: 'long',
														day: 'numeric',
														hour: '2-digit',
														minute: '2-digit'
													}
												)}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-500">
												{getRelativeTime(new Date(result.payload.iat * 1000))}
											</p>
										</div>
									</div>

									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4 text-gray-500" />
											<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
												Expires
											</span>
										</div>
										<div className="pl-6 space-y-1">
											<p className="text-sm text-gray-600 dark:text-gray-400">
												{new Date(result.payload.exp * 1000).toLocaleDateString(
													'en-US',
													{
														year: 'numeric',
														month: 'long',
														day: 'numeric',
														hour: '2-digit',
														minute: '2-digit'
													}
												)}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-500">
												{getRelativeTime(new Date(result.payload.exp * 1000))}
											</p>
										</div>
									</div>

									<div className="space-y-2">
										<div className="flex items-center gap-2">
											{result.payload.type === QRType.APP ? (
												<Smartphone className="h-4 w-4 text-gray-500" />
											) : result.payload.type === QRType.APPLE_WALLET ? (
												<Ticket className="h-4 w-4 text-gray-500" />
											) : result.payload.type === QRType.ANDROID_WALLET ? (
												<Smartphone className="h-4 w-4 text-gray-500" />
											) : (
												<ShieldX className="h-4 w-4 text-gray-500" />
											)}
											<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
												QR Type
											</span>
										</div>
										<p className="text-sm text-gray-600 dark:text-gray-400 pl-6">
											{result.payload.type === QRType.APP
												? 'App Neuland ID'
												: result.payload.type === QRType.APPLE_WALLET
													? 'Apple Wallet Pass'
													: result.payload.type === QRType.ANDROID_WALLET
														? 'Android Wallet Pass'
														: result.payload.type}
										</p>
									</div>
								</div>
							</div>

							{result.debugInfo && <DebugInfo info={result.debugInfo} />}
						</div>
					)}
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
			<CardContent className="p-6 text-center">
				<p className="font-medium text-gray-900 dark:text-white">
					Scan a Neuland Ingolstadt member's digital ID card to verify.
				</p>
				<p className="text-xs text-gray-600 dark:text-gray-400">
					You can tap on the the code sh Neuland Next
				</p>
			</CardContent>
		</Card>
	)
}
