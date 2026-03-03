'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

const ThemeSwitcher = () => {
	const { resolvedTheme, setTheme } = useTheme()
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	const toggleTheme = () => {
		setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
	}

	if (!isMounted) {
		return <div className="fixed top-[8px] right-4 z-50 w-9 h-9 rounded-full bg-surface-elevated border border-border" />
	}

	return (
		<button
			onClick={toggleTheme}
			aria-label="Toggle theme"
			className="
				fixed top-[8px] right-4 z-50
				w-9 h-9
				flex items-center justify-center
				rounded-full
				bg-surface-elevated
				border border-border
				text-text-secondary
				shadow-elem
				cursor-pointer
				transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
				hover:bg-surface-active
				hover:text-foreground
				hover:shadow-float
				active:scale-90
			"
		>
			{resolvedTheme === 'dark' ? <Sun size={15} strokeWidth={1.75} /> : <Moon size={15} strokeWidth={1.75} />}
		</button>
	)
}

export default ThemeSwitcher
