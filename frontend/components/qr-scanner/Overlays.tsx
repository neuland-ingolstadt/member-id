'use client'

import { CheckCircle, Info, ShieldX, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ScanRecord } from '@/hooks/use-scan-history'
import { QRType, type VerificationResult } from '@/lib/qr-verifier'

export function VerifyingOverlay() {
	return (
		<div className="absolute inset-0 z-10 flex items-center justify-center bg-terminal-overlay">
			<div className="flex flex-col items-center space-y-4 border border-terminal-window-border bg-terminal-window p-6 font-mono">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-terminal-cyan border-t-transparent" />
				<p className="text-sm font-medium text-terminal-text">
					<span className="text-terminal-cyan">&gt;</span> verifying signature
					<span className="blinking-cursor">_</span>
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
		<div className="absolute inset-0 z-20 flex animate-fade-in items-center justify-center bg-terminal-darkGreen/90 backdrop-blur-sm">
			{showCloseButton && onClose && (
				<Button
					variant="ghost"
					size="icon"
					onClick={onClose}
					className="absolute right-4 top-4 text-terminal-cyan hover:bg-terminal-cyan/10"
					type="button"
					aria-label="Close success message"
				>
					<X className="h-5 w-5" />
				</Button>
			)}
			<div className="mx-auto max-w-xs animate-scale-up p-6 text-center font-mono text-terminal-text">
				<div className="mx-auto mb-4 flex h-20 w-20 animate-bounce-gentle items-center justify-center border border-terminal-cyan/40 bg-terminal-cyan/10 p-3">
					<CheckCircle
						className="h-12 w-12 text-terminal-cyan"
						strokeWidth={2.5}
					/>
				</div>
				<h3 className="mb-1 text-2xl font-bold text-terminal-cyan">
					[ OK ] Verified
				</h3>
				<p className="text-base text-terminal-text/80">
					Signature valid · membership authenticated
				</p>
				{result.payload && (
					<div className="mt-3 border-t border-terminal-cyan/30 pt-3">
						<p className="text-lg font-semibold text-terminal-text">
							{result.payload.name}
						</p>
						<p className="mt-1 text-sm text-terminal-text/60">
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
		<div className="absolute inset-0 z-20 flex animate-fade-in items-center justify-center bg-[#0a2540]/90 backdrop-blur-sm">
			{showCloseButton && onClose && (
				<Button
					variant="ghost"
					size="icon"
					onClick={onClose}
					className="absolute right-4 top-4 text-sky-300 hover:bg-sky-300/10"
					type="button"
					aria-label="Close duplicate message"
				>
					<X className="h-5 w-5" />
				</Button>
			)}
			<div className="mx-auto max-w-xs animate-scale-up p-6 text-center font-mono text-white">
				<div className="mx-auto mb-4 flex h-20 w-20 animate-bounce-gentle items-center justify-center border border-sky-400/40 bg-sky-400/10 p-3">
					<Info className="h-12 w-12 text-sky-300" strokeWidth={2.5} />
				</div>
				<h3 className="mb-1 text-2xl font-bold text-sky-300">
					[ WARN ] Already Verified
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
					className="absolute right-4 top-4 text-white hover:bg-white/20"
					type="button"
					aria-label="Close error message"
				>
					<X className="h-5 w-5" />
				</Button>
			)}
			<div className="mx-auto max-w-xs animate-scale-up p-6 text-center font-mono text-white">
				<div className="mx-auto mb-4 flex h-20 w-20 animate-bounce-gentle items-center justify-center border border-white/30 bg-white/10 p-3">
					<ShieldX className="h-12 w-12" strokeWidth={2.5} />
				</div>
				<h3 className="mb-1 text-2xl font-bold">[ ERR ] Invalid</h3>
				<p className="text-base text-white/90">
					Neuland ID verification failed
				</p>
				<p className="mt-1 text-xs text-white/90">{message}</p>
			</div>
		</div>
	)
}
