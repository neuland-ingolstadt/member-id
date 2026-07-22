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
				className="fixed bottom-8 left-8 z-50 h-14 w-14 border-2 border-primary/20 bg-background p-0 shadow-xl backdrop-blur-md transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-2xl"
				type="button"
				aria-label="Open scanner settings"
			>
				<Settings className="h-10 w-10 text-primary" />
			</Button>

			<ScannerSettingsPane
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
			/>
		</>
	)
}
