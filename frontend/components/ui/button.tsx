import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-cyan/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default:
					'border border-terminal-cyan/40 bg-terminal-cyan text-terminal-onAccent hover:bg-terminal-highlight',
				destructive:
					'border border-destructive/50 bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline:
					'border border-terminal-window-border bg-terminal-window text-terminal-text hover:border-terminal-cyan/50 hover:bg-terminal-card',
				secondary:
					'border border-terminal-window-border bg-terminal-card text-terminal-text hover:border-terminal-cyan/40',
				ghost:
					'text-terminal-text hover:bg-terminal-card hover:text-terminal-cyan',
				link: 'text-terminal-cyan underline-offset-4 hover:underline hover:text-terminal-highlight'
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 px-3',
				lg: 'h-11 px-8',
				icon: 'h-10 w-10'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button'
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		)
	}
)
Button.displayName = 'Button'

export { Button, buttonVariants }
