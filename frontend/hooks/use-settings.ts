import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ScannerSettings {
	// Audio settings
	soundOnScan: boolean
	soundVolume: number // 0-1
	
	// QR Code validation settings
	onlyAllowAppQRCodes: boolean
	strictValidation: boolean
	
	// UI settings
	showScanFrame: boolean
	showDebugInfo: boolean
	autoCloseResults: boolean
	resultDisplayTime: number // milliseconds
	
	// Performance settings
	scanThrottleMs: number
	enableHighQualityScan: boolean
}

const defaultSettings: ScannerSettings = {
	soundOnScan: true,
	soundVolume: 0.7,
	onlyAllowAppQRCodes: true,
	strictValidation: false,
	showScanFrame: true,
	showDebugInfo: false,
	autoCloseResults: true,
	resultDisplayTime: 2500,
	scanThrottleMs: 1000,
	enableHighQualityScan: false,
}

interface SettingsStore extends ScannerSettings {
	updateSetting: <K extends keyof ScannerSettings>(
		key: K,
		value: ScannerSettings[K]
	) => void
	resetToDefaults: () => void
}

export const useSettings = create<SettingsStore>()(
	persist(
		(set) => ({
			...defaultSettings,
			updateSetting: (key, value) =>
				set((state) => ({ ...state, [key]: value })),
			resetToDefaults: () => set(defaultSettings),
		}),
		{
			name: 'scanner-settings',
			version: 1,
		}
	)
) 