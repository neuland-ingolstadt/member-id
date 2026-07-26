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
				className={
					result.success
						? duplicateWarning
							? 'border-blue-500/40 bg-terminal-window'
							: 'border-terminal-cyan/40 bg-terminal-window'
						: 'border-destructive/50 bg-terminal-window'
				}
			>
				<CardContent className="p-6">
					<div className="flex items-center gap-3 mb-6">
						{result.success ? (
							<div className="flex items-center gap-2">
								<div
									className={`p-2 rounded-full ${
										duplicateWarning
											? 'bg-blue-600 text-white'
											: 'bg-terminal-cyan text-terminal-onAccent'
									}`}
								>
									{duplicateWarning ? (
										<Info className="h-6 w-6" />
									) : (
										<CheckCircle className="h-6 w-6" />
									)}
								</div>
								<div>
									<h3
										className={`text-xl font-bold ${duplicateWarning ? 'text-blue-400' : 'text-terminal-lightGreen'}`}
									>
										{duplicateWarning
											? 'Already Verified'
											: 'Verification Successful'}
									</h3>
									<p
										className={`${duplicateWarning ? 'text-blue-400/80' : 'text-terminal-cyan/80'} text-sm`}
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
							<div className="rounded-none border border-terminal-window-border bg-terminal-card p-6">
								<div className="flex items-center gap-4 mb-4">
									<div className="p-3 rounded-full bg-terminal-cyan text-terminal-onAccent">
										<User className="h-6 w-6" />
									</div>
									<div>
										<h4 className="text-lg font-semibold text-terminal-lightGreen">
											Identity Information
										</h4>
										<p className="text-sm text-terminal-text/50">
											Verified credential data
										</p>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<User className="h-4 w-4 text-terminal-text/45" />
											<span className="text-sm font-medium text-terminal-text/70">
												Name
											</span>
										</div>
										<p className="text-lg font-semibold text-terminal-text pl-6">
											{result.payload.name}
										</p>
									</div>

									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<ShieldX className="h-4 w-4 text-terminal-text/45" />
											<span className="text-sm font-medium text-terminal-text/70">
												User ID
											</span>
										</div>
										<p className="text-sm font-mono text-terminal-text/55 pl-6 break-all">
											{result.payload.sub}
										</p>
									</div>

									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4 text-terminal-text/45" />
											<span className="text-sm font-medium text-terminal-text/70">
												Issued
											</span>
										</div>
										<div className="pl-6 space-y-1">
											<p className="text-sm text-terminal-text/55">
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
											<p className="text-xs text-terminal-text/40">
												{getRelativeTime(new Date(result.payload.iat * 1000))}
											</p>
										</div>
									</div>

									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4 text-terminal-text/45" />
											<span className="text-sm font-medium text-terminal-text/70">
												Expires
											</span>
										</div>
										<div className="pl-6 space-y-1">
											<p className="text-sm text-terminal-text/55">
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
											<p className="text-xs text-terminal-text/40">
												{getRelativeTime(new Date(result.payload.exp * 1000))}
											</p>
										</div>
									</div>

									<div className="space-y-2">
										<div className="flex items-center gap-2">
											{result.payload.type === QRType.APP ? (
												<Smartphone className="h-4 w-4 text-terminal-text/45" />
											) : result.payload.type === QRType.APPLE_WALLET ? (
												<Ticket className="h-4 w-4 text-terminal-text/45" />
											) : result.payload.type === QRType.ANDROID_WALLET ? (
												<Smartphone className="h-4 w-4 text-terminal-text/45" />
											) : (
												<ShieldX className="h-4 w-4 text-terminal-text/45" />
											)}
											<span className="text-sm font-medium text-terminal-text/70">
												QR Type
											</span>
										</div>
										<p className="text-sm text-terminal-text/55 pl-6">
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
		<Card className="border border-terminal-window-border bg-terminal-window">
			<CardContent className="p-6 text-center">
				<p className="font-medium text-terminal-text">
					Scan a Neuland Ingolstadt member's digital ID card to verify.
				</p>
				<p className="text-xs text-terminal-text/50">
					Tap on the QR code shown in Neuland Next to view it in full-screen
					mode.
				</p>
			</CardContent>
		</Card>
	)
}
