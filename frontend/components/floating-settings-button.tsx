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
				className="fixed bottom-8 left-8 z-50 h-14 w-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 bg-background border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 backdrop-blur-md hover:rotate-45 p-0"
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
