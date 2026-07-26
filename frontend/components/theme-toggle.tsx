import { Laptop, MoonStar, SunMedium } from 'lucide-react'

export function ThemeToggle() {
	return (
		<button
			type="button"
			data-theme-toggle
			data-theme-mode="system"
			aria-label="System theme"
			title="System theme"
			className="inline-flex size-8 cursor-pointer items-center justify-center border border-terminal-window-border/70 bg-terminal-bg/40 text-terminal-text/90 shadow-sm transition-colors hover:border-terminal-cyan/40"
		>
			<Laptop data-theme-icon="system" className="size-3.5" aria-hidden />
			<SunMedium
				data-theme-icon="light"
				className="hidden size-3.5"
				aria-hidden
			/>
			<MoonStar
				data-theme-icon="dark"
				className="hidden size-3.5"
				aria-hidden
			/>
		</button>
	)
}
