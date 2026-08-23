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
				variant="outline"
				size="icon"
				onClick={() => setIsSettingsOpen(true)}
				className="fixed bottom-8 left-8 z-50 size-12 border-terminal-window-border bg-terminal-window/95 backdrop-blur-sm hover:border-terminal-cyan/40"
				type="button"
				aria-label="Open scanner settings"
			>
				<Settings className="size-5 text-terminal-text" />
			</Button>

			<ScannerSettingsPane
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
			/>
		</>
	)
}
