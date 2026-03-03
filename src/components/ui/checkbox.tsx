'use client'

import * as React from 'react'
import { CheckIcon } from 'lucide-react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

const Checkbox = ({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) => {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className={cn(
				'peer border-input bg-surface-base data-[state=checked]:bg-brand-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-brand-primary focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-1 size-5 shrink-0 rounded-md border shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="flex items-center justify-center text-current">
				<CheckIcon className="size-3.5" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
}

export { Checkbox }
