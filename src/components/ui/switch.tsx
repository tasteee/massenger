'use client'

import * as React from 'react'
import { Switch as SwitchPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

const Switch = ({
	className,
	size = 'default',
	...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
	size?: 'sm' | 'default'
}) => {
	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			data-size={size}
			className={cn(
				'peer data-[state=checked]:bg-brand-primary data-[state=unchecked]:bg-input focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-1 inline-flex shrink-0 items-center rounded-full border-2 border-transparent shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-6 data-[size=default]:w-11 data-[size=sm]:h-4 data-[size=sm]:w-7',
				className
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn(
					'bg-surface-elevated pointer-events-none block rounded-full ring-0 shadow-sm transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 group-data-[size=sm]:data-[state=checked]:translate-x-3 group-data-[size=default]:size-5 group-data-[size=sm]:size-3'
				)}
			/>
		</SwitchPrimitive.Root>
	)
}

export { Switch }
