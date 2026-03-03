import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
	'inline-flex items-center justify-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-brand-accent/50 focus-visible:ring-[3px] focus-visible:border-brand-accent focus-visible:outline-none/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-hidden',
	{
		variants: {
			variant: {
				default: 'bg-surface-active text-foreground hover:bg-surface-active/80 border-border',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				destructive:
					'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
				outline: 'border-border text-foreground hover:bg-accent hover:text-accent-foreground',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
				pill: 'bg-brand-primary text-white hover:bg-brand-primary/90'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
)

const Badge = ({
	className,
	variant = 'default',
	asChild = false,
	...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) => {
	const Comp = asChild ? Slot.Root : 'span'

	return <Comp data-slot="badge" data-variant={variant} className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
