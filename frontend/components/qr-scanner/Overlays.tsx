'use client'

import { CheckCircle, Info, ShieldX, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ScanRecord } from '@/hooks/use-scan-history'
import { QRType, type VerificationResult } from '@/lib/qr-verifier'

export function VerifyingOverlay() {
	return (
		<div className="absolute inset-0 z-10 flex items-center justify-center bg-terminal-bg/70">
			<div className="flex flex-col items-center space-y-4 border border-terminal-window-border bg-terminal-window p-6">
				<div className="size-8 animate-spin border-b-2 border-terminal-cyan" />
				<p className="font-mono text-sm font-medium text-terminal-text">
					Verifying Neuland ID...
				</p>
			</div>
		</div>
	)
}

interface SuccessProps {
	result: VerificationResult
	onClose?: () => void
	showCloseButton?: boolean
}

export function SuccessOverlay({
	result,
	onClose,
	showCloseButton
}: SuccessProps) {
	return (
		<div className="absolute inset-0 z-20 flex animate-fade-in items-center justify-center bg-terminal-cyan/90 backdrop-blur-sm">
			{showCloseButton && onClose && (
				<Button
					variant="ghost"
					size="icon"
					onClick={onClose}
					className="absolute top-4 right-4 text-terminal-onAccent hover:bg-terminal-onAccent/10"
					type="button"
					aria-label="Close success message"
				>
					<X className="h-5 w-5" />
				</Button>
			)}
			<div className="mx-auto max-w-xs animate-scale-up p-6 text-center text-terminal-onAccent">
				<div className="mx-auto mb-4 flex size-20 animate-bounce-gentle items-center justify-center border border-terminal-onAccent/25 bg-terminal-onAccent/15 p-3">
					<CheckCircle className="h-12 w-12" strokeWidth={2.5} />
				</div>
				<h3 className="mb-1 font-mono text-2xl font-bold text-terminal-onAccent">
					Verified!
				</h3>
				<p className="text-base text-terminal-onAccent/90">
					Neuland ID is valid and authenticated
				</p>
				{result.payload && (
					<div className="mt-3 border-t border-terminal-onAccent/20 pt-3">
						<p className="text-lg font-semibold text-terminal-onAccent">
							{result.payload.name}
						</p>
						<p className="mt-1 text-sm text-terminal-onAccent/80">
							{result.payload.type === QRType.APP
								? 'App Neuland ID'
								: result.payload.type === QRType.APPLE_WALLET
									? 'Apple Wallet Pass'
									: result.payload.type === QRType.ANDROID_WALLET
										? 'Android Wallet Pass'
										: result.payload.type}
						</p>
					</div>
				)}
			</div>
		</div>
	)
}

interface DuplicateProps {
	warning: ScanRecord
	onClose?: () => void
	showCloseButton?: boolean
}

export function DuplicateOverlay({
	warning,
	onClose,
	showCloseButton
}: DuplicateProps) {
	return (
		<div className="absolute inset-0 z-20 flex animate-fade-in items-center justify-center bg-sky-600/90 backdrop-blur-sm">
			{showCloseButton && onClose && (
				<Button
					variant="ghost"
					size="icon"
					onClick={onClose}
					className="absolute top-4 right-4 text-white hover:bg-white/10"
					type="button"
					aria-label="Close duplicate message"
				>
					<X className="h-5 w-5" />
				</Button>
			)}
			<div className="mx-auto max-w-xs animate-scale-up p-6 text-center text-white">
				<div className="mx-auto mb-4 flex size-20 animate-bounce-gentle items-center justify-center border border-white/25 bg-white/15 p-3">
					<Info className="h-12 w-12" strokeWidth={2.5} />
				</div>
				<h3 className="mb-1 font-mono text-2xl font-bold text-white">
					Already Verified!
				</h3>
				{warning.result.success && warning.result.payload ? (
					<p className="text-base text-white/90">
						<span className="text-lg font-semibold">
							{warning.result.payload.name}
						</span>
					</p>
				) : (
					<p className="text-base text-white/90">
						This user has already been verified with another Neuland ID
					</p>
				)}
				{warning.result.success && warning.result.payload && (
					<div className="mt-3 border-t border-white/20 pt-3">
						<p className="text-sm text-white/80">
							Originally verified with{' '}
							<span className="font-semibold">
								{warning.result.payload.type === QRType.APP
									? 'App Neuland ID'
									: warning.result.payload.type === QRType.APPLE_WALLET
										? 'Apple Wallet Pass'
										: warning.result.payload.type === QRType.ANDROID_WALLET
											? 'Android Wallet Pass'
											: warning.result.payload.type}
							</span>
						</p>
						<p className="mt-1 text-xs text-white/80">
							{new Date(warning.timestamp).toLocaleTimeString()}
						</p>
					</div>
				)}
			</div>
		</div>
	)
}

interface ErrorProps {
	message: string
	onClose?: () => void
	showCloseButton?: boolean
}

export function ErrorOverlay({
	message,
	onClose,
	showCloseButton
}: ErrorProps) {
	return (
		<div className="absolute inset-0 z-20 flex animate-fade-in items-center justify-center bg-destructive/90 backdrop-blur-sm">
			{showCloseButton && onClose && (
				<Button
					variant="ghost"
					size="icon"
					onClick={onClose}
					className="absolute top-4 right-4 text-destructive-foreground hover:bg-white/10"
					type="button"
					aria-label="Close error message"
				>
					<X className="h-5 w-5" />
				</Button>
			)}
			<div className="mx-auto max-w-xs animate-scale-up p-6 text-center text-destructive-foreground">
				<div className="mx-auto mb-4 flex size-20 animate-bounce-gentle items-center justify-center border border-white/25 bg-white/15 p-3">
					<ShieldX className="h-12 w-12" strokeWidth={2.5} />
				</div>
				<h3 className="mb-1 font-mono text-2xl font-bold text-destructive-foreground">
					Invalid!
				</h3>
				<p className="text-base text-destructive-foreground/90">
					Neuland ID verification failed
				</p>
				<p className="mt-1 text-xs text-destructive-foreground/90">{message}</p>
			</div>
		</div>
	)
}
