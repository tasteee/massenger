import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-offset-2 focus-visible:ring-brand-accent focus-visible:ring-2 active:scale-95",
	{
		variants: {
			variant: {
				default: 'bg-brand-primary text-white shadow-md hover:bg-brand-primary/90 hover:shadow-lg hover:shadow-brand-primary/20',
				destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
				outline: 'border border-border bg-surface-elevated shadow-sm hover:bg-surface-active hover:text-foreground',
				secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
				ghost: 'hover:bg-surface-active hover:text-foreground',
				link: 'text-link underline-offset-4 hover:underline',
				premium:
					'bg-brand-secondary text-black shadow-md hover:bg-brand-secondary/90 hover:shadow-lg hover:shadow-brand-secondary/20',
				action: 'bg-brand-accent text-white shadow-md hover:bg-brand-accent/90 hover:shadow-lg hover:shadow-brand-accent/20'
			},
			size: {
				default: 'h-10 px-5 py-2',
				sm: 'h-9 rounded-full px-4 text-xs',
				lg: 'h-12 rounded-full px-8 text-base',
				icon: 'size-10 rounded-full'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
)

const Button = ({
	className,
	variant = 'default',
	size = 'default',
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean
	}) => {
	const Comp = asChild ? Slot.Root : 'button'

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	)
}

export { Button, buttonVariants }
