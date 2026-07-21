'use client'

import { Settings } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScannerSettingsPane } from './scanner-settings-pane'

export function FloatingSettingsButton() {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false)

	return (
		<>
			<Button
				variant="secondary"
				onClick={() => setIsSettingsOpen(true)}
				className="fixed bottom-8 left-8 z-50 h-12 w-12 border-2 border-terminal-window-border bg-terminal-window p-0 shadow-lg transition-all duration-200 hover:border-terminal-cyan/50 hover:bg-terminal-card"
				type="button"
				aria-label="Open scanner settings"
			>
				<div className="pointer-events-none absolute inset-0">
					<div className="absolute left-0 top-0 h-3 w-3">
						<div className="absolute left-0 top-0 h-px w-2 bg-terminal-cyan/40" />
						<div className="absolute left-0 top-0 h-2 w-px bg-terminal-cyan/40" />
					</div>
					<div className="absolute bottom-0 right-0 h-3 w-3">
						<div className="absolute bottom-0 right-0 h-px w-2 bg-terminal-cyan/30" />
						<div className="absolute bottom-0 right-0 h-2 w-px bg-terminal-cyan/30" />
					</div>
				</div>
				<Settings className="relative z-10 h-5 w-5 text-terminal-cyan transition-transform duration-200 hover:rotate-45" />
			</Button>

			<ScannerSettingsPane
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
			/>
		</>
	)
}
