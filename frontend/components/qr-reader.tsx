'use client'

import jsQR from 'jsqr'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSettings } from '@/hooks/use-settings'
import { soundManager } from '@/lib/sound'

interface QRCodeReaderProps {
	onScan: (data: string) => void
	deviceId?: string
}

export function QRCodeReader({ onScan, deviceId }: QRCodeReaderProps) {
	const videoRef = useRef<HTMLVideoElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [isScanning, setIsScanning] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const lastScanTime = useRef<number>(0)

	// Get settings
	const settings = useSettings()

	const stopCamera = useCallback(() => {
		if (videoRef.current?.srcObject) {
			const stream = videoRef.current.srcObject as MediaStream
			stream.getTracks().forEach((track) => track.stop())
			videoRef.current.srcObject = null
		}
		setIsScanning(false)
	}, [])

	const startCamera = useCallback(async () => {
		try {
			// Check if mediaDevices is supported
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				throw new Error(
					'Camera API not supported. Please use HTTPS or a modern browser.'
				)
			}

			const constraints: MediaStreamConstraints = {
				video: {
					width: { ideal: settings.enableHighQualityScan ? 1920 : 1280 },
					height: { ideal: settings.enableHighQualityScan ? 1080 : 720 }
				}
			}

			// If deviceId is provided, use it; otherwise use facingMode
			if (deviceId) {
				;(constraints.video as MediaTrackConstraints).deviceId = {
					exact: deviceId
				}
			} else {
				;(constraints.video as MediaTrackConstraints).facingMode = 'environment'
			}

			const stream = await navigator.mediaDevices.getUserMedia(constraints)
			if (videoRef.current) {
				videoRef.current.srcObject = stream
				setIsScanning(true)
				setError(null)
			}
		} catch (err) {
			let errorMessage = 'Camera access denied or not available'

			if (err instanceof Error) {
				if (err.message.includes('Camera API not supported')) {
					errorMessage =
						"Camera API not supported. Please ensure you're using HTTPS and a modern browser."
				} else if (err.name === 'NotAllowedError') {
					errorMessage =
						'Camera access denied. Please allow camera permissions and try again.'
				} else if (err.name === 'NotFoundError') {
					errorMessage = 'No camera found on this device.'
				} else if (err.name === 'NotReadableError') {
					errorMessage = 'Camera is already in use by another application.'
				} else if (err.name === 'OverconstrainedError') {
					errorMessage = 'Camera constraints could not be satisfied.'
				} else {
					errorMessage = `Camera error: ${err.message}`
				}
			}

			setError(errorMessage)
			console.error('Camera error:', err)
		}
	}, [settings.enableHighQualityScan, deviceId])

	const captureFrame = useCallback(() => {
		if (!videoRef.current || !canvasRef.current || isProcessing) return

		const canvas = canvasRef.current
		const video = videoRef.current
		const ctx = canvas.getContext('2d')

		if (!ctx) return

		// Check if video has valid dimensions before proceeding
		if (video.videoWidth === 0 || video.videoHeight === 0) {
			return // Video not ready yet
		}

		// Use settings throttle
		const now = Date.now()
		if (now - lastScanTime.current < settings.scanThrottleMs) {
			return // Wait based on settings
		}

		canvas.width = video.videoWidth
		canvas.height = video.videoHeight
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
		const code = jsQR(imageData.data, imageData.width, imageData.height)

		if (
			code?.data &&
			typeof code.data === 'string' &&
			code.data.trim().length > 0
		) {
			lastScanTime.current = now
			setIsProcessing(true)

			// Play sound if enabled
			if (settings.soundOnScan) {
				soundManager.playScanSound(settings.soundVolume)
			}

			// Brief delay to prevent multiple rapid scans
			setTimeout(() => {
				onScan(code.data)
				// Reset processing state after scan callback
				setTimeout(() => {
					setIsProcessing(false)
				}, 1000)
			}, 100)
		}
	}, [
		onScan,
		isProcessing,
		settings.scanThrottleMs,
		settings.soundOnScan,
		settings.soundVolume
	])

	useEffect(() => {
		startCamera()
		return () => {
			stopCamera()
		}
	}, [startCamera, stopCamera])

	useEffect(() => {
		if (!isScanning || isProcessing) return

		let raf: number
		let lastFrameTime = 0

		const tick = (currentTime: number) => {
			// Limit to ~10 FPS for QR scanning (reduces CPU usage and blinking)
			if (currentTime - lastFrameTime >= 100) {
				captureFrame()
				lastFrameTime = currentTime
			}
			raf = requestAnimationFrame(tick)
		}

		raf = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(raf)
	}, [isScanning, captureFrame, isProcessing])

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<p className="text-red-500 mb-4">{error}</p>
				<button
					type="button"
					onClick={startCamera}
					className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-600 transition-colors"
				>
					Try Again
				</button>
			</div>
		)
	}

	return (
		<div className="relative w-full">
			<div className="relative overflow-hidden rounded-lg shadow-lg bg-black mx-auto max-w-md">
				<video
					ref={videoRef}
					autoPlay
					playsInline
					muted
					aria-label="QR Code camera feed"
					className="w-full aspect-[4/3] object-cover"
				/>
				<canvas ref={canvasRef} className="hidden" />

				{/* Minimal status overlay */}
				{isScanning && (
					<div className="absolute top-3 right-3">
						<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
					</div>
				)}

				{/* Camera initializing overlay */}
				{!isScanning && (
					<div className="absolute inset-0 bg-black/80 flex items-center justify-center">
						<div className="text-center text-white">
							<div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
							<p className="text-sm font-medium">Starting camera...</p>
						</div>
					</div>
				)}

				{/* QR Code targeting frame - only show if enabled in settings */}
				{settings.showScanFrame && (
					<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
						<div className="relative">
							{/* Main scanner frame */}
							<div className="w-60 h-60 border-2 border-white/30 rounded-lg shadow-lg relative overflow-hidden">
								{/* Corner indicators with pulse animation */}
								<div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-green-500 rounded-tl-lg animate-pulse-corner"></div>
								<div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-green-500 rounded-tr-lg animate-pulse-corner"></div>
								<div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-green-500 rounded-bl-lg animate-pulse-corner"></div>
								<div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-green-500 rounded-br-lg animate-pulse-corner"></div>

								{/* Inner focus guide */}
								<div className="absolute inset-6 border border-dashed border-white/20 rounded"></div>
							</div>
						</div>
					</div>
				)}

				{/* Debug info overlay - only show if enabled in settings */}
				{settings.showDebugInfo && isScanning && (
					<div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs p-2 rounded">
						<div>FPS: ~10</div>
						<div>Throttle: {settings.scanThrottleMs}ms</div>
						<div>
							Quality: {settings.enableHighQualityScan ? 'High' : 'Standard'}
						</div>
						<div>Sound: {settings.soundOnScan ? 'On' : 'Off'}</div>
						<div>App-only: {settings.onlyAllowAppQRCodes ? 'Yes' : 'No'}</div>
						<div>Strict: {settings.strictValidation ? 'Yes' : 'No'}</div>
					</div>
				)}
			</div>

			{/* Bottom instruction text */}
			<div className="mt-4 text-center">
				<p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
					Hold a member card QR code in front of the camera.
				</p>
				<p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
					{settings.showScanFrame
						? 'Position the QR code within the frame for automatic detection.'
						: 'Point the camera at a QR code for automatic detection.'}
				</p>
			</div>
		</div>
	)
}
