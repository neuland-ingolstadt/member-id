'use client'

import { useCallback, useEffect, useState } from 'react'
import { CameraSelector } from '@/components/camera-selector'
import { FloatingSettingsButton } from '@/components/floating-settings-button'
import { QRCodeReader } from '@/components/qr-reader'
import { ScanHistoryList } from '@/components/scan-history'
import { ScanStatsDisplay } from '@/components/scan-stats-display'
import { Card, CardContent } from '@/components/ui/card'
import type { ScanRecord } from '@/hooks/use-scan-history'
import { useScanHistory } from '@/hooks/use-scan-history'
import { useSettings } from '@/hooks/use-settings'
import {
	getPublicKeyError,
	initializePublicKey,
	isPublicKeyAvailable,
	type VerificationResult,
	verifyQRCode
} from '@/lib/qr-verifier'
import { soundManager } from '@/lib/sound'
import { InitializingView } from './InitializingView'
import {
	DuplicateOverlay,
	ErrorOverlay,
	SuccessOverlay,
	VerifyingOverlay
} from './Overlays'
import { ResultCard } from './ResultCard'
import { ScannerUnavailable } from './ScannerUnavailable'

export function QRScanner() {
	const [verificationResult, setVerificationResult] =
		useState<VerificationResult | null>(null)
	const [isVerifying, setIsVerifying] = useState(false)
	const [showSuccess, setShowSuccess] = useState(false)
	const [showError, setShowError] = useState(false)
	const [showDuplicate, setShowDuplicate] = useState(false)
	const [duplicateWarning, setDuplicateWarning] = useState<ScanRecord | null>(
		null
	)
	const [isInitializing, setIsInitializing] = useState(true)
	const [publicKeyAvailable, setPublicKeyAvailable] = useState(false)
	const [publicKeyError, setPublicKeyError] = useState<string | null>(null)
	const [selectedCameraId, setSelectedCameraId] = useState<string | undefined>(
		undefined
	)

	const { scanHistory, stats, addScan, clearHistory, removeScan } =
		useScanHistory()

	// Get settings
	const settings = useSettings()

	useEffect(() => {
		const initPublicKey = async () => {
			try {
				await initializePublicKey()
				setPublicKeyAvailable(isPublicKeyAvailable())
				setPublicKeyError(getPublicKeyError())
			} catch (error) {
				console.error('Failed to initialize public key:', error)
				setPublicKeyAvailable(false)
				setPublicKeyError(getPublicKeyError())
			} finally {
				setIsInitializing(false)
			}
		}

		initPublicKey()
	}, [])

	const handleQRScan = useCallback(
		async (data: string) => {
			if (!publicKeyAvailable) return

			const trimmedData = data?.trim()
			if (!trimmedData || trimmedData.length < 10) return

			setIsVerifying(true)
			setShowSuccess(false)
			setShowError(false)
			setShowDuplicate(false)
			setDuplicateWarning(null)

			try {
				const result = await verifyQRCode(trimmedData, {
					onlyAllowAppQRCodes: settings.onlyAllowAppQRCodes,
					strictValidation: settings.strictValidation
				})
				setVerificationResult(result)

				const { isDuplicate, scanRecord, originalScan } = addScan(
					trimmedData,
					result
				)

				if (isDuplicate && originalScan) {
					if (scanRecord?.result?.success) {
						setDuplicateWarning(originalScan)
						setShowDuplicate(true)
						// Play duplicate sound for duplicate
						if (settings.soundOnScan) {
							soundManager.playDuplicateSound(settings.soundVolume)
						}
						// Use settings for auto-close timing
						if (settings.autoCloseResults) {
							setTimeout(
								() => setShowDuplicate(false),
								settings.resultDisplayTime
							)
						}
					} else {
						setShowError(true)
						// Play error sound
						if (settings.soundOnScan) {
							soundManager.playErrorSound(settings.soundVolume)
						}
						if (settings.autoCloseResults) {
							setTimeout(() => setShowError(false), settings.resultDisplayTime)
						}
					}
				} else if (result.success) {
					setShowSuccess(true)
					// Play success sound for new successful scan
					if (settings.soundOnScan) {
						soundManager.playSuccessSound(settings.soundVolume)
					}
					if (settings.autoCloseResults) {
						setTimeout(() => setShowSuccess(false), settings.resultDisplayTime)
					}
				} else {
					setShowError(true)
					// Play error sound
					if (settings.soundOnScan) {
						soundManager.playErrorSound(settings.soundVolume)
					}
					if (settings.autoCloseResults) {
						setTimeout(() => setShowError(false), settings.resultDisplayTime)
					}
				}
			} catch (error) {
				const errorResult = {
					success: false,
					error:
						error instanceof Error ? error.message : 'Unknown error occurred',
					payload: null
				}
				setVerificationResult(errorResult)

				const { isDuplicate, originalScan } = addScan(trimmedData, errorResult)

				if (isDuplicate && originalScan && originalScan.result.success) {
					setDuplicateWarning(originalScan)
					setShowDuplicate(true)
					// Play duplicate sound for duplicate
					if (settings.soundOnScan) {
						soundManager.playDuplicateSound(settings.soundVolume)
					}
					if (settings.autoCloseResults) {
						setTimeout(
							() => setShowDuplicate(false),
							settings.resultDisplayTime
						)
					}
				} else {
					setShowError(true)
					// Play error sound
					if (settings.soundOnScan) {
						soundManager.playErrorSound(settings.soundVolume)
					}
					if (settings.autoCloseResults) {
						setTimeout(() => setShowError(false), settings.resultDisplayTime)
					}
				}
			} finally {
				setIsVerifying(false)
			}
		},
		[
			addScan,
			publicKeyAvailable,
			settings.soundOnScan,
			settings.soundVolume,
			settings.autoCloseResults,
			settings.resultDisplayTime,
			settings.onlyAllowAppQRCodes,
			settings.strictValidation
		]
	)

	const handleCameraChange = useCallback((deviceId: string) => {
		setSelectedCameraId(deviceId)
	}, [])

	if (isInitializing) {
		return (
			<InitializingView
				stats={stats}
				scanHistory={scanHistory}
				onClearHistory={clearHistory}
				onRemoveScan={removeScan}
			/>
		)
	}

	if (!publicKeyAvailable) {
		return (
			<ScannerUnavailable
				stats={stats}
				scanHistory={scanHistory}
				onClearHistory={clearHistory}
				onRemoveScan={removeScan}
				errorMessage={publicKeyError}
			/>
		)
	}

	return (
		<>
			<FloatingSettingsButton />
			<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
				<div className="lg:col-span-3 space-y-6">
					<Card>
						<CardContent className="p-6">
							<div className="relative">
								{/* Camera selector positioned at top-left with better spacing */}
								<div className="absolute bottom-12 right-4 z-20">
									<CameraSelector
										onCameraChange={handleCameraChange}
										currentDeviceId={selectedCameraId}
										className="bg-background/90 backdrop-blur-md border border-border/60 shadow-lg hover:bg-background/95 transition-colors"
									/>
								</div>

								<QRCodeReader
									onScan={handleQRScan}
									deviceId={selectedCameraId}
								/>
								{isVerifying && <VerifyingOverlay />}
								{showSuccess &&
									verificationResult?.success &&
									!showDuplicate && (
										<SuccessOverlay
											result={verificationResult}
											onClose={() => setShowSuccess(false)}
											showCloseButton={!settings.autoCloseResults}
										/>
									)}
								{showDuplicate && duplicateWarning && (
									<DuplicateOverlay
										warning={duplicateWarning}
										onClose={() => setShowDuplicate(false)}
										showCloseButton={!settings.autoCloseResults}
									/>
								)}
								{showError &&
									verificationResult &&
									!verificationResult.success &&
									!showDuplicate && (
										<ErrorOverlay
											message={verificationResult.error ?? ''}
											onClose={() => setShowError(false)}
											showCloseButton={!settings.autoCloseResults}
										/>
									)}
							</div>
						</CardContent>
					</Card>
					<ResultCard
						result={verificationResult}
						duplicateWarning={duplicateWarning}
					/>
				</div>
				<div className="lg:col-span-2 space-y-6">
					<ScanStatsDisplay stats={stats} onClearHistory={clearHistory} />
					<ScanHistoryList
						scanHistory={scanHistory}
						onRemoveScan={removeScan}
					/>
				</div>
			</div>
		</>
	)
}
