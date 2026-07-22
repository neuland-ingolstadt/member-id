import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'*.{js,ts,jsx,tsx,mdx}'
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				mono: ['var(--font-mono)', 'ui-monospace', 'monospace']
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'var(--terminal-window)',
					foreground: 'var(--terminal-text)'
				},
				popover: {
					DEFAULT: 'var(--terminal-window)',
					foreground: 'var(--terminal-text)'
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
				terminal: {
					bg: 'var(--terminal-bg)',
					text: 'var(--terminal-text)',
					cyan: 'var(--terminal-cyan)',
					highlight: 'var(--terminal-highlight)',
					lightGreen: 'var(--terminal-lightGreen)',
					window: 'var(--terminal-window)',
					'window-border': 'var(--terminal-window-border)',
					'window-title': 'var(--terminal-window-title)',
					card: 'var(--terminal-card)',
					nav: 'var(--terminal-nav)',
					onAccent: 'var(--terminal-onAccent)',
					muted: 'var(--terminal-mutedGreen)'
				}
			},
			borderRadius: {
				lg: '0',
				md: '0',
				sm: '0',
				xl: '0'
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
						boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.4)'
					},
					'70%': {
						opacity: '1',
						boxShadow: '0 0 0 4px rgba(34, 197, 94, 0)'
					},
					'100%': {
						opacity: '0.7',
						boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)'
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
