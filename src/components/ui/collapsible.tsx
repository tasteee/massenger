'use client'

import { Collapsible as CollapsiblePrimitive } from 'radix-ui'

const Collapsible = ({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) => {
	return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

const CollapsibleTrigger = ({
	className,
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) => {
	return (
		<CollapsiblePrimitive.CollapsibleTrigger
			data-slot="collapsible-trigger"
			className={cn(
				'flex items-center justify-between rounded-lg p-2 font-medium transition-colors hover:bg-surface-elevated/50',
				className
			)}
			{...props}
		/>
	)
}

const CollapsibleContent = ({
	className,
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) => {
	return (
		<CollapsiblePrimitive.CollapsibleContent
			data-slot="collapsible-content"
			className={cn(
				'overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down text-sm text-muted-foreground',
				className
			)}
			{...props}
		/>
	)
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
