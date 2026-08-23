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
	const containerRef = useRef<HTMLDivElement>(null)
	const videoRef = useRef<HTMLVideoElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [isScanning, setIsScanning] = useState(false)
	const [isVisible, setIsVisible] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const lastScanTime = useRef<number>(0)

	// Get settings
	const settings = useSettings()

	const stopCamera = useCallback(() => {
		if (videoRef.current?.srcObject) {
			const stream = videoRef.current.srcObject as MediaStream
			stream.getTracks().forEach((track) => {
				track.stop()
			})
			videoRef.current.srcObject = null
		}
		setIsScanning(false)
	}, [])

	const startCamera = useCallback(async () => {
		try {
			// Check if mediaDevices is supported
			if (!navigator.mediaDevices?.getUserMedia) {
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
				;(constraints.video as MediaTrackConstraints).facingMode = {
					ideal: 'environment'
				}
			}

			let stream: MediaStream | null = null
			try {
				stream = await navigator.mediaDevices.getUserMedia(constraints)
			} catch {
				// Fallback to user-facing camera if environment is not available
				if (!deviceId) {
					;(constraints.video as MediaTrackConstraints).facingMode = {
						ideal: 'user'
					}
					stream = await navigator.mediaDevices.getUserMedia(constraints)
				} else {
					throw new Error('No camera found on this device.')
				}
			}

			if (videoRef.current && stream) {
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

	// Start camera once and manage visibility
	useEffect(() => {
		startCamera()
		return () => {
			stopCamera()
		}
	}, [startCamera, stopCamera])

	// Manage visibility state without stopping camera
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting)
			},
			{ threshold: 0.1 }
		)

		if (containerRef.current) {
			observer.observe(containerRef.current)
		}

		return () => {
			observer.disconnect()
		}
	}, [])

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
		if (!isScanning || isProcessing) return

		let raf: number
		let lastFrameTime = 0

		const tick = (currentTime: number) => {
			// Adjust frame rate based on visibility
			// When visible: ~10 FPS for QR scanning
			// When not visible: ~1 FPS to keep camera alive but reduce CPU usage
			const frameInterval = isVisible ? 100 : 1000

			if (currentTime - lastFrameTime >= frameInterval) {
				captureFrame()
				lastFrameTime = currentTime
			}
			raf = requestAnimationFrame(tick)
		}

		raf = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(raf)
	}, [isScanning, captureFrame, isProcessing, isVisible])

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<p className="mb-4 text-destructive">{error}</p>
				<button
					type="button"
					onClick={startCamera}
					className="border border-terminal-window-border bg-terminal-window px-4 py-2 font-mono text-sm uppercase tracking-wide text-terminal-text transition-colors hover:border-terminal-cyan/40 hover:text-terminal-cyan"
				>
					Try Again
				</button>
			</div>
		)
	}

	return (
		<div ref={containerRef} className="relative w-full">
			<div className="relative mx-auto max-w-md overflow-hidden border border-terminal-window-border bg-black">
				<video
					ref={videoRef}
					autoPlay
					playsInline
					muted
					aria-label="Neuland ID camera feed"
					className="aspect-[4/3] w-full object-cover"
				/>
				<canvas ref={canvasRef} className="hidden" />

				{isScanning && (
					<div className="absolute top-3 right-3">
						<div
							className={`size-3 ${
								isVisible ? 'animate-pulse bg-terminal-cyan' : 'bg-amber-400'
							}`}
						/>
					</div>
				)}

				{!isScanning && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/80">
						<div className="text-center text-terminal-text">
							<div className="mx-auto mb-3 size-8 animate-spin border-2 border-terminal-window-border border-t-terminal-cyan" />
							<p className="font-mono text-sm font-medium">
								Starting camera...
							</p>
						</div>
					</div>
				)}

				{settings.showScanFrame && isVisible && (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
						<div className="relative">
							<div className="relative h-60 w-60 overflow-hidden border-2 border-white/30">
								<div className="absolute -top-1 -left-1 h-8 w-8 animate-pulse-corner border-t-4 border-l-4 border-terminal-cyan" />
								<div className="absolute -top-1 -right-1 h-8 w-8 animate-pulse-corner border-t-4 border-r-4 border-terminal-cyan" />
								<div className="absolute -bottom-1 -left-1 h-8 w-8 animate-pulse-corner border-b-4 border-l-4 border-terminal-cyan" />
								<div className="absolute -right-1 -bottom-1 h-8 w-8 animate-pulse-corner border-r-4 border-b-4 border-terminal-cyan" />
								<div className="absolute inset-6 border border-dashed border-white/20" />
							</div>
						</div>
					</div>
				)}

				{settings.showDebugInfo && isScanning && (
					<div className="absolute bottom-3 left-3 border border-terminal-window-border bg-terminal-bg/80 p-2 font-mono text-xs text-terminal-text">
						<div>FPS: {isVisible ? '~10' : '~1'}</div>
						<div>Status: {isVisible ? 'Active' : 'Background'}</div>
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

			<div className="mt-4 text-center">
				<p className="text-sm font-medium text-terminal-text/80">
					Hold a Neuland ID up to the camera to scan it.
				</p>
				<p className="mt-1 text-xs text-terminal-text/45">
					{settings.showScanFrame
						? 'Position the digital code within the frame for automatic detection.'
						: 'Point the camera at the digital code for automatic detection.'}
				</p>
			</div>
		</div>
	)
}
