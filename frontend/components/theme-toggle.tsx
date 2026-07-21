'use client'

import { Laptop, MoonStar, SunMedium } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
	const [mounted, setMounted] = useState(false)
	const { theme, setTheme, resolvedTheme } = useTheme()

	useEffect(() => {
		setMounted(true)
	}, [])

	const cycleTheme = () => {
		if (theme === 'system') {
			setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
		} else if (theme === 'light') {
			setTheme('dark')
		} else {
			setTheme('system')
		}
	}

	const mode = !mounted ? 'system' : (theme ?? 'system')

	const icon =
		mode === 'light' ? (
			<SunMedium className="h-3.5 w-3.5" />
		) : mode === 'dark' ? (
			<MoonStar className="h-3.5 w-3.5" />
		) : (
			<Laptop className="h-3.5 w-3.5" />
		)

	return (
		<button
			type="button"
			onClick={cycleTheme}
			aria-label="Theme switch"
			className="group relative inline-flex h-8 w-8 cursor-pointer select-none items-center justify-center overflow-hidden border border-terminal-window-border/70 bg-terminal-bg/40 shadow-sm backdrop-blur-sm"
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
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-terminal-cyan/0 via-terminal-cyan/12 to-terminal-cyan/0 opacity-0 transition-opacity duration-250 group-hover:opacity-100" />
			<span className="relative z-10 flex items-center justify-center font-mono text-[11px] text-terminal-text/90 transition-transform duration-150 ease-out group-active:translate-x-px">
				{icon}
			</span>
		</button>
	)
}
