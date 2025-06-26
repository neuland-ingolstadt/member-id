'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
	const [mounted, setMounted] = useState(false)
	const { setTheme, resolvedTheme } = useTheme()

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return (
			<Button variant="outline" size="icon" disabled>
				<Sun className="h-[1.2rem] w-[1.2rem]" />
				<span className="sr-only">Toggle theme</span>
			</Button>
		)
	}

	const toggleTheme = () => {
		setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
	}

	return (
		<Button variant="outline" size="icon" onClick={toggleTheme}>
			{resolvedTheme === 'light' ? (
				<Moon className="h-[1.2rem] w-[1.2rem]" />
			) : (
				<Sun className="h-[1.2rem] w-[1.2rem]" />
			)}
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}
