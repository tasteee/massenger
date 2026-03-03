'use client'

import * as React from 'react'
import { CircleIcon } from 'lucide-react'
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

const RadioGroup = ({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) => {
	return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn('grid gap-3', className)} {...props} />
}

const RadioGroupItem = ({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) => {
	return (
		<RadioGroupPrimitive.Item
			data-slot="radio-group-item"
			className={cn(
				'aspect-square size-5 shrink-0 rounded-full border border-input text-brand-primary shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="flex items-center justify-center">
				<CircleIcon className="fill-current text-current size-2.5" />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	)
}

export { RadioGroup, RadioGroupItem }
