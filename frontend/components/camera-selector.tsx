'use client'

import { Camera, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export interface CameraDevice {
	deviceId: string
	label: string
	kind: string
}

interface CameraSelectorProps {
	onCameraChange: (deviceId: string) => void
	currentDeviceId?: string
	className?: string
}

export function CameraSelector({
	onCameraChange,
	currentDeviceId,
	className
}: CameraSelectorProps) {
	const [cameras, setCameras] = useState<CameraDevice[]>([])
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const getCameras = async () => {
			try {
				setError(null)

				// Check if mediaDevices is supported
				if (
					!navigator.mediaDevices ||
					!navigator.mediaDevices.enumerateDevices
				) {
					throw new Error('Camera API not supported')
				}

				// Request camera permission first to get labeled devices
				try {
					await navigator.mediaDevices.getUserMedia({
						video: {
							facingMode: { ideal: 'environment' }
						}
					})
				} catch {
					// Fallback to any camera if environment facing mode fails
					await navigator.mediaDevices.getUserMedia({ video: true })
				}

				const devices = await navigator.mediaDevices.enumerateDevices()
				const videoDevices = devices
					.filter((device) => device.kind === 'videoinput')
					.map((device) => ({
						deviceId: device.deviceId,
						label: device.label || `Camera ${device.deviceId.slice(0, 8)}...`,
						kind: device.kind
					}))

				setCameras(videoDevices)

				// If no current device is selected and we have cameras, select the first one
				if (!currentDeviceId && videoDevices.length > 0) {
					onCameraChange(videoDevices[0].deviceId)
				}
			} catch (err) {
				console.error('Error getting cameras:', err)
				setError(err instanceof Error ? err.message : 'Failed to get cameras')
			}
		}

		getCameras()
	}, [currentDeviceId, onCameraChange])

	// Don't render if there's only one camera or no cameras
	if (cameras.length <= 1) {
		return null
	}

	if (error) {
		return (
			<div className={`flex items-center gap-2 text-red-500 ${className}`}>
				<Camera className="h-4 w-4" />
				<span className="text-sm">Camera error</span>
			</div>
		)
	}

	const currentCamera =
		cameras.find((camera) => camera.deviceId === currentDeviceId) || cameras[0]

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className={`flex items-center gap-1.5 h-8 px-2.5 text-xs ${className}`}
				>
					<Camera className="h-3.5 w-3.5" />
					<span className="text-xs truncate max-w-24">
						{currentCamera.label}
					</span>
					<ChevronDown className="h-3 w-3" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-48">
				{cameras.map((camera) => (
					<DropdownMenuItem
						key={camera.deviceId}
						onClick={() => onCameraChange(camera.deviceId)}
						className="flex items-center gap-2 text-sm"
					>
						<Camera className="h-4 w-4" />
						<span className="truncate">{camera.label}</span>
						{camera.deviceId === currentDeviceId && (
							<span className="ml-auto text-xs text-muted-foreground">
								Current
							</span>
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
