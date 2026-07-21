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
import { TerminalWindow } from '@/components/terminal-window'
import { Badge } from '@/components/ui/badge'
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
		const statusTitle = result.success
			? duplicateWarning
				? 'neuland@verify:~/result --warn'
				: 'neuland@verify:~/result --ok'
			: 'neuland@verify:~/result --err'

		return (
			<TerminalWindow title={statusTitle}>
				<div className="p-4 font-mono sm:p-6">
					<div className="mb-6 flex items-center gap-3">
						{result.success ? (
							<div className="flex items-center gap-2">
								<div
									className={`border p-2 ${
										duplicateWarning
											? 'border-sky-400/40 bg-sky-400/10 text-sky-400'
											: 'border-terminal-cyan/40 bg-terminal-cyan/10 text-terminal-cyan'
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
										className={`text-xl font-bold ${
											duplicateWarning ? 'text-sky-400' : 'text-terminal-cyan'
										}`}
									>
										{duplicateWarning
											? 'Already Verified'
											: 'Verification Successful'}
									</h3>
									<p className="text-sm text-terminal-text/60">
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
								<div className="border border-destructive/50 bg-destructive/10 p-2 text-destructive">
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
								className={`flex items-center gap-1.5 px-3 py-1 text-sm ${
									duplicateWarning ? 'border-sky-400 text-sky-400' : ''
								}`}
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
						<div className="mb-6 space-y-1 border border-destructive/40 bg-destructive/10 p-4">
							<p className="text-sm font-bold text-destructive">
								{result.error}
							</p>
							<p className="text-xs text-destructive/80">
								{result.payload
									? 'Even there is data returned, it is NOT a valid member pass.'
									: 'Not a valid member pass.'}
							</p>
						</div>
					)}

					{result.payload && (
						<div className="space-y-6">
							<div className="border border-terminal-window-border bg-terminal-card p-4 sm:p-6">
								<div className="mb-4 flex items-center gap-4">
									<div className="border border-terminal-cyan/30 bg-terminal-cyan/10 p-3 text-terminal-cyan">
										<User className="h-6 w-6" />
									</div>
									<div>
										<h4 className="text-lg font-semibold text-terminal-text">
											Identity Information
										</h4>
										<p className="text-sm text-terminal-text/50">
											Verified credential data
										</p>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<User className="h-4 w-4 text-terminal-cyan/70" />
											<span className="text-sm font-medium text-terminal-text/70">
												Name
											</span>
										</div>
										<p className="pl-6 text-lg font-semibold text-terminal-text">
											{result.payload.name}
										</p>
									</div>

									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<ShieldX className="h-4 w-4 text-terminal-cyan/70" />
											<span className="text-sm font-medium text-terminal-text/70">
												User ID
											</span>
										</div>
										<p className="break-all pl-6 font-mono text-sm text-terminal-text/60">
											{result.payload.sub}
										</p>
									</div>

									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4 text-terminal-cyan/70" />
											<span className="text-sm font-medium text-terminal-text/70">
												Issued
											</span>
										</div>
										<div className="space-y-1 pl-6">
											<p className="text-sm text-terminal-text/60">
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
											<Clock className="h-4 w-4 text-terminal-cyan/70" />
											<span className="text-sm font-medium text-terminal-text/70">
												Expires
											</span>
										</div>
										<div className="space-y-1 pl-6">
											<p className="text-sm text-terminal-text/60">
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
												<Smartphone className="h-4 w-4 text-terminal-cyan/70" />
											) : result.payload.type === QRType.APPLE_WALLET ? (
												<Ticket className="h-4 w-4 text-terminal-cyan/70" />
											) : result.payload.type === QRType.ANDROID_WALLET ? (
												<Smartphone className="h-4 w-4 text-terminal-cyan/70" />
											) : (
												<ShieldX className="h-4 w-4 text-terminal-cyan/70" />
											)}
											<span className="text-sm font-medium text-terminal-text/70">
												QR Type
											</span>
										</div>
										<p className="pl-6 text-sm text-terminal-text/60">
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
				</div>
			</TerminalWindow>
		)
	}

	return (
		<TerminalWindow title="neuland@verify:~/awaiting">
			<div className="p-6 text-center font-mono">
				<p className="font-medium text-terminal-text">
					<span className="text-terminal-cyan">&gt;</span> Scan a Neuland
					Ingolstadt member&apos;s digital ID card to verify.
				</p>
				<p className="mt-2 text-xs text-terminal-text/50">
					Tap on the QR code shown in Neuland Next to view it in full-screen
					mode.
					<span className="blinking-cursor ml-1">_</span>
				</p>
			</div>
		</TerminalWindow>
	)
}
