'use client'

import { Laptop, MoonStar, SunMedium } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
	useEffect(() => {
		document.dispatchEvent(new Event('neuland:theme-hydrate'))
	}, [])

	return (
		<Button
			type="button"
			variant="outline"
			size="icon-sm"
			data-theme-toggle
			data-theme-mode="system"
			aria-label="System theme"
			title="System theme"
		>
			<Laptop data-theme-icon="system" aria-hidden />
			<SunMedium data-theme-icon="light" className="hidden" aria-hidden />
			<MoonStar data-theme-icon="dark" className="hidden" aria-hidden />
		</Button>
	)
}
