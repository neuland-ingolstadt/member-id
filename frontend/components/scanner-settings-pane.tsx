'use client'

import { Eye, QrCode, RotateCcw, Settings, Volume2, X, Zap } from 'lucide-react'
import { useId, useState } from 'react'
import { CameraSelector } from '@/components/camera-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useSettings } from '@/hooks/use-settings'

interface ScannerSettingsPaneProps {
	isOpen: boolean
	onClose: () => void
}

export function ScannerSettingsPane({
	isOpen,
	onClose
}: ScannerSettingsPaneProps) {
	const settings = useSettings()
	const [activeSection, setActiveSection] = useState<
		'audio' | 'validation' | 'ui' | 'performance'
	>('audio')
	const id = useId()

	if (!isOpen) return null

	const sections = [
		{ id: 'audio' as const, icon: Volume2 },
		{ id: 'validation' as const, icon: QrCode },
		{ id: 'ui' as const, icon: Eye },
		{ id: 'performance' as const, icon: Zap }
	]

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-end">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/20 backdrop-blur-sm"
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === 'Escape') onClose()
				}}
				role="button"
				tabIndex={0}
				aria-label="Close settings"
			/>

			{/* Settings Panel */}
			<div className="relative w-full max-w-sm h-full bg-background border-l shadow-xl animate-in slide-in-from-right duration-300 flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
					<div className="flex items-center gap-2">
						<Settings className="h-5 w-5 text-primary" />
						<h2 className="text-lg font-semibold">Scanner Settings</h2>
					</div>
					<Button variant="ghost" size="sm" onClick={onClose} type="button">
						<X className="h-4 w-4" />
					</Button>
				</div>

				{/* Navigation Tabs */}
				<div className="flex border-b bg-background sticky top-14 z-10">
					{sections.map((section) => {
						const Icon = section.icon
						return (
							<button
								key={section.id}
								onClick={() => setActiveSection(section.id)}
								className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium transition-colors ${
									activeSection === section.id
										? 'text-primary border-b-2 border-primary bg-primary/5'
										: 'text-muted-foreground hover:text-foreground'
								}`}
								type="button"
							>
								<Icon className="h-4 w-4" />
							</button>
						)
					})}
				</div>

				{/* Scrollable Content */}
				<div className="flex-1 overflow-y-auto p-4 space-y-6">
					{activeSection === 'audio' && (
						<div className="space-y-4">
							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="text-base flex items-center gap-2">
										<Volume2 className="h-4 w-4" />
										Sound on Scan
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<Label htmlFor={`sound-toggle-${id}`} className="text-sm">
											Play sound when a digital code is detected
										</Label>
										<Switch
											id={`sound-toggle-${id}`}
											checked={settings.soundOnScan}
											onCheckedChange={(checked) =>
												settings.updateSetting('soundOnScan', checked)
											}
										/>
									</div>

									{settings.soundOnScan && (
										<div className="space-y-2">
											<Label className="text-sm">Volume</Label>
											<Slider
												value={[settings.soundVolume]}
												onValueChange={([value]) =>
													settings.updateSetting('soundVolume', value)
												}
												max={1}
												min={0}
												step={0.1}
												className="w-full"
											/>
											<div className="flex justify-between text-xs text-muted-foreground">
												<span>0%</span>
												<span>{Math.round(settings.soundVolume * 100)}%</span>
												<span>100%</span>
											</div>
											<div className="text-xs text-muted-foreground space-y-1 mt-2">
												<p>
													<strong>Success:</strong> Pleasant ascending chord
												</p>
												<p>
													<strong>Duplicate:</strong> Warning tone
												</p>
												<p>
													<strong>Error:</strong> Descending error tones
												</p>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					)}

					{activeSection === 'validation' && (
						<div className="space-y-4">
							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="text-base flex items-center gap-2">
										<QrCode className="h-4 w-4" />
										Member ID Validation
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<Label htmlFor={`app-only-${id}`} className="text-sm">
											Only allow app Member IDs
										</Label>
										<Switch
											id={`app-only-${id}`}
											checked={settings.onlyAllowAppQRCodes}
											onCheckedChange={(checked) =>
												settings.updateSetting('onlyAllowAppQRCodes', checked)
											}
										/>
									</div>

									<div className="flex items-center justify-between">
										<Label
											htmlFor={`strict-validation-${id}`}
											className="text-sm"
										>
											Strict validation mode
										</Label>
										<Switch
											id={`strict-validation-${id}`}
											checked={settings.strictValidation}
											onCheckedChange={(checked) =>
												settings.updateSetting('strictValidation', checked)
											}
										/>
									</div>

									<div className="text-xs text-muted-foreground space-y-1">
										<p className="mt-2 text-xs">
											<strong>App-only validation:</strong> Rejects Apple Wallet
											and Android Wallet passes, only accepts direct app Member
											IDs codes.
										</p>
										<p className="text-xs">
											<strong>Strict validation:</strong> Checks for
											future-issued codes, suspicious expiration dates, and
											expired codes with tolerance.
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{activeSection === 'ui' && (
						<div className="space-y-4">
							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="text-base flex items-center gap-2">
										<Eye className="h-4 w-4" />
										Interface Options
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label className="text-sm">Camera Selection</Label>
										<CameraSelector
											onCameraChange={(deviceId) =>
												settings.updateSetting('selectedCameraId', deviceId)
											}
											currentDeviceId={settings.selectedCameraId}
											className="w-full"
										/>
									</div>

									<div className="flex items-center justify-between">
										<Label htmlFor={`show-frame-${id}`} className="text-sm">
											Show scan frame
										</Label>
										<Switch
											id={`show-frame-${id}`}
											checked={settings.showScanFrame}
											onCheckedChange={(checked) =>
												settings.updateSetting('showScanFrame', checked)
											}
										/>
									</div>

									<div className="flex items-center justify-between">
										<Label htmlFor={`debug-info-${id}`} className="text-sm">
											Show debug information
										</Label>
										<Switch
											id={`debug-info-${id}`}
											checked={settings.showDebugInfo}
											onCheckedChange={(checked) =>
												settings.updateSetting('showDebugInfo', checked)
											}
										/>
									</div>

									<div className="flex items-center justify-between">
										<Label htmlFor={`auto-close-${id}`} className="text-sm">
											Auto-close results
										</Label>
										<Switch
											id={`auto-close-${id}`}
											checked={settings.autoCloseResults}
											onCheckedChange={(checked) =>
												settings.updateSetting('autoCloseResults', checked)
											}
										/>
									</div>

									{!settings.autoCloseResults && (
										<div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
											<p className="text-xs text-amber-700 dark:text-amber-300">
												<strong>Manual close enabled:</strong> Result overlays
												will stay open until manually closed with the X button.
											</p>
										</div>
									)}

									{settings.autoCloseResults && (
										<div className="space-y-2">
											<Label className="text-sm">Display time (seconds)</Label>
											<Slider
												value={[settings.resultDisplayTime / 1000]}
												onValueChange={([value]) =>
													settings.updateSetting(
														'resultDisplayTime',
														value * 1000
													)
												}
												max={10}
												min={1}
												step={0.5}
												className="w-full"
											/>
											<div className="flex justify-between text-xs text-muted-foreground">
												<span>1s</span>
												<span>
													{(settings.resultDisplayTime / 1000).toFixed(1)}s
												</span>
												<span>10s</span>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					)}

					{activeSection === 'performance' && (
						<div className="space-y-4">
							<Card>
								<CardHeader className="pb-3">
									<CardTitle className="text-base flex items-center gap-2">
										<Zap className="h-4 w-4" />
										Performance Settings
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<Label htmlFor={`high-quality-${id}`} className="text-sm">
											High quality scanning
										</Label>
										<Switch
											id={`high-quality-${id}`}
											checked={settings.enableHighQualityScan}
											onCheckedChange={(checked) =>
												settings.updateSetting('enableHighQualityScan', checked)
											}
										/>
									</div>

									<div className="space-y-2">
										<Label className="text-sm">Scan throttle (ms)</Label>
										<Slider
											value={[settings.scanThrottleMs]}
											onValueChange={([value]) =>
												settings.updateSetting('scanThrottleMs', value)
											}
											max={5000}
											min={500}
											step={500}
											className="w-full"
										/>
										<div className="flex justify-between text-xs text-muted-foreground">
											<span>500ms</span>
											<span>{settings.scanThrottleMs}ms</span>
											<span>5000ms</span>
										</div>
									</div>

									<div className="text-xs text-muted-foreground space-y-1">
										<p>
											<strong>Higher quality:</strong> Better QR detection but
											uses more CPU
										</p>
										<p>
											<strong>Lower throttle:</strong> Faster scanning but may
											miss codes
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="p-4 border-t bg-background sticky bottom-0">
					<Button
						variant="outline"
						onClick={settings.resetToDefaults}
						className="w-full"
						type="button"
					>
						<RotateCcw className="h-4 w-4 mr-2" />
						Reset to Defaults
					</Button>
				</div>
			</div>
		</div>
	)
}
