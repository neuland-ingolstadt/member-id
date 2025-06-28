'use client'

import { CheckCircle, Info, ShieldX, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ScanRecord } from '@/hooks/use-scan-history'
import { QRType, type VerificationResult } from '@/lib/qr-verifier'

export function VerifyingOverlay() {
	return (
		<div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
			<div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center space-y-4">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
				<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
		<div className="absolute inset-0 bg-gradient-to-b from-green-500/90 to-green-600/95 backdrop-blur-sm flex items-center justify-center z-20 rounded-lg shadow-lg animate-fade-in">
			{showCloseButton && onClose && (
				<Button
					variant="ghost"
					size="icon"
					onClick={onClose}
					className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
					type="button"
					aria-label="Close success message"
				>
					<X className="h-5 w-5" />
				</Button>
			)}
			<div className="text-center text-white max-w-xs mx-auto p-6 animate-scale-up">
				<div className="mb-4 bg-white/20 rounded-full p-3 w-20 h-20 flex items-center justify-center mx-auto animate-bounce-gentle">
					<CheckCircle className="h-12 w-12" strokeWidth={2.5} />
				</div>
				<h3 className="text-2xl font-bold mb-1">Verified!</h3>
				<p className="text-white/90 text-base">
					Neuland ID is valid and authenticated
				</p>
				{result.payload && (
					<div className="mt-3 pt-3 border-t border-white/20">
						<p className="text-white font-semibold text-lg">
							{result.payload.name}
						</p>
						<p className="text-white/80 text-sm mt-1">
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
		<div className="absolute inset-0 bg-gradient-to-b from-blue-400/90 to-blue-500/95 backdrop-blur-sm flex items-center justify-center z-20 rounded-lg shadow-lg animate-fade-in">
			{showCloseButton && onClose && (
				<Button
					variant="ghost"
					size="icon"
					onClick={onClose}
					className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
					type="button"
					aria-label="Close duplicate message"
				>
					<X className="h-5 w-5" />
				</Button>
			)}
			<div className="text-center text-white max-w-xs mx-auto p-6 animate-scale-up">
				<div className="mb-4 bg-white/20 rounded-full p-3 w-20 h-20 flex items-center justify-center mx-auto animate-bounce-gentle">
					<Info className="h-12 w-12" strokeWidth={2.5} />
				</div>
				<h3 className="text-2xl font-bold mb-1">Already Verified!</h3>
				{warning.result.success && warning.result.payload ? (
					<p className="text-white/90 text-base">
						<span className="font-semibold text-lg">
							{warning.result.payload.name}
						</span>
					</p>
				) : (
					<p className="text-white/90 text-base">
						This user has already been verified with another Neuland ID
					</p>
				)}
				{warning.result.success && warning.result.payload && (
					<div className="mt-3 pt-3 border-t border-white/20">
						<p className="text-white/80 text-sm">
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
						<p className="text-white/80 text-xs mt-1">
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
		<div className="absolute inset-0 bg-gradient-to-b from-destructive/85 to-destructive/95 backdrop-blur-sm flex items-center justify-center z-20 rounded-lg shadow-lg animate-fade-in">
			{showCloseButton && onClose && (
				<Button
					variant="ghost"
					size="icon"
					onClick={onClose}
					className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
					type="button"
					aria-label="Close error message"
				>
					<X className="h-5 w-5" />
				</Button>
			)}
			<div className="text-center text-white max-w-xs mx-auto p-6 animate-scale-up">
				<div className="mb-4 bg-white/20 rounded-full p-3 w-20 h-20 flex items-center justify-center mx-auto animate-bounce-gentle">
					<ShieldX className="h-12 w-12" strokeWidth={2.5} />
				</div>
				<h3 className="text-2xl font-bold mb-1">Invalid!</h3>
				<p className="text-white/90 text-base">
					Neuland ID verification failed
				</p>
				<p className="text-white/90 text-xs mt-1">{message}</p>
			</div>
		</div>
	)
}
