import type { Config } from 'tailwindcss'

const config: Config = {
	darkMode: 'class',
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'*.{js,ts,jsx,tsx,mdx}'
	],
	theme: {
		extend: {
			fontFamily: {
				mono: [
					'var(--font-mono)',
					'Source Code Pro',
					'ui-monospace',
					'monospace'
				],
				sans: [
					'var(--font-sans)',
					'Noto Sans',
					'system-ui',
					'-apple-system',
					'sans-serif'
				]
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				terminal: {
					bg: 'var(--terminal-bg)',
					text: 'var(--terminal-text)',
					cyan: 'var(--terminal-cyan)',
					highlight: 'var(--terminal-highlight)',
					darkGreen: 'var(--terminal-darkGreen)',
					muted: 'var(--terminal-mutedGreen)',
					lightGreen: 'var(--terminal-lightGreen)',
					mediumGreen: 'var(--terminal-mediumGreen)',
					window: 'var(--terminal-window)',
					'window-border': 'var(--terminal-window-border)',
					windowTitle: 'var(--terminal-window-title)',
					overlay: 'var(--terminal-overlay)',
					card: 'var(--terminal-card)',
					onAccent: 'var(--terminal-onAccent)',
					paper: 'var(--terminal-paper)',
					'paper-text': 'var(--terminal-paper-text)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) + 2px)',
				sm: 'var(--radius)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'pulse-corner': {
					'0%': {
						opacity: '0.7',
						boxShadow: '0 0 0 0 rgba(74, 222, 128, 0.4)'
					},
					'70%': {
						opacity: '1',
						boxShadow: '0 0 0 4px rgba(74, 222, 128, 0)'
					},
					'100%': {
						opacity: '0.7',
						boxShadow: '0 0 0 0 rgba(74, 222, 128, 0)'
					}
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				scaleUp: {
					'0%': { transform: 'scale(0.7)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				bounceGentle: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-6px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-corner': 'pulse-corner 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'fade-in': 'fadeIn 0.5s ease-in-out forwards',
				'scale-up': 'scaleUp 0.4s ease-out forwards',
				'bounce-gentle': 'bounceGentle 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require('tailwindcss-animate')]
}
export default config
