'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import HeroView from '@/components/views/HeroView'
import ScanningView from '@/components/views/ScanningView'
import BackupListView from '@/components/views/BackupListView'
import ExtractingView from '@/components/views/ExtractingView'
import CompleteView from '@/components/views/CompleteView'
import DashboardView from '@/components/views/DashboardView'
import { $threads, $view } from '@/lib/store'

type AppView = 'hero' | 'scanning' | 'list' | 'extracting' | 'complete' | 'dashboard'

export default function Home() {
	const view = $view.use()
	const [backups, setBackups] = useState<BackupT[]>([])
	const [selectedBackup, setSelectedBackup] = useState<BackupT | null>(null)

	const scanBackups = async () => {
		$view.set('scanning')
		try {
			const res = await fetch('/api/backups')
			const data = await res.json()

			if (res.ok && data.backups) {
				setBackups(data.backups)
				$view.set('list')
			} else {
				toast.error('Failed to scan backups', { description: data.error || 'Unknown error' })
				$view.set('hero')
			}
		} catch (error) {
			console.error(error)
			toast.error('Network error during scan')
			$view.set('hero')
		}
	}

	const extractBackup = async (backup: BackupT) => {
		setSelectedBackup(backup)
		$view.set('extracting')

		try {
			const res = await fetch('/api/extract', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ backupId: backup.id })
			})

			const data = await res.json()

			if (!res.ok) {
				toast.error('Extraction failed', { description: data.error || 'Unknown error' })
				$view.set('list')
				setSelectedBackup(null)
				return
			}

			const extractedThreads = data as ThreadT[]
			$threads.set(extractedThreads)
			$view.set('complete')

			const totalMessages = extractedThreads.reduce((total, c) => total + c.messages.length, 0)
			toast.success('Database extracted successfully!', {
				description: `${extractedThreads.length} conversations, ${totalMessages.toLocaleString()} messages.`
			})
		} catch (error) {
			console.error(error)
			toast.error('Network error during extraction')
			$view.set('list')
			setSelectedBackup(null)
		}
	}

	if (view === 'dashboard') {
		return <DashboardView />
	}

	return (
		<main className="min-h-screen w-full bg-background text-foreground flex items-center justify-center relative overflow-hidden">
			{/* Ambient Background */}
			<div className="absolute top-0 -left-20 w-96 h-96 bg-brand-primary/5 rounded-full blur-[128px] pointer-events-none" />
			<div className="absolute bottom-0 -right-20 w-96 h-96 bg-brand-accent/5 rounded-full blur-[128px] pointer-events-none" />

			{/* View Container */}
			<div className="w-full max-w-4xl mx-auto flex items-center justify-center z-10 p-6 min-h-[600px]">
				{view === 'hero' && <HeroView onScan={scanBackups} />}
				{view === 'scanning' && <ScanningView />}
				{view === 'list' && <BackupListView backups={backups} onSelectBackup={extractBackup} onBack={() => $view.set('hero')} />}
				{view === 'extracting' && <ExtractingView selectedBackup={selectedBackup} />}
				{view === 'complete' && (
					<CompleteView onLoadDifferent={() => $view.set('list')} onOpenDashboard={() => $view.set('dashboard')} />
				)}
			</div>
		</main>
	)
}
