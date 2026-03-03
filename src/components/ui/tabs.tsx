'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Tabs as TabsPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

const Tabs = ({ className, orientation = 'horizontal', ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) => {
	return (
		<TabsPrimitive.Root
			data-slot="tabs"
			data-orientation={orientation}
			orientation={orientation}
			className={cn('group/tabs flex gap-2 data-[orientation=horizontal]:flex-col', className)}
			{...props}
		/>
	)
}

const tabsListVariants = cva(
	'rounded-xl p-1 bg-surface-base text-muted-foreground inline-flex items-center justify-center transition-all duration-200',
	{
		variants: {
			variant: {
				default: 'border border-border/50',
				line: 'gap-6 bg-transparent p-0 border-0'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
)

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>
>(({ className, variant, ...props }, ref) => (
	<TabsPrimitive.List ref={ref} className={cn(tabsListVariants({ variant }), className)} {...props} />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & VariantProps<typeof tabsListVariants>
>(({ className, variant, ...props }, ref) => (
	<TabsPrimitive.Trigger
		ref={ref}
		className={cn(
			'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
			'data-[state=active]:bg-surface-elevated data-[state=active]:text-foreground data-[state=active]:shadow-sm',
			'data-[variant=line]:rounded-none data-[variant=line]:border-b-2 data-[variant=line]:border-transparent data-[variant=line]:bg-transparent data-[variant=line]:px-0 data-[variant=line]:pb-2 data-[variant=line]:pt-0 data-[variant=line]:shadow-none data-[variant=line]:data-[state=active]:border-primary',
			className
		)}
		{...props}
	/>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = ({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) => {
	return <TabsPrimitive.Content data-slot="tabs-content" className={cn('flex-1 outline-none', className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
