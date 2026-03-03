'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import HeroView from '@/components/views/HeroView'
import ScanningView from '@/components/views/ScanningView'
import BackupListView from '@/components/views/BackupListView'
import ExtractingView from '@/components/views/ExtractingView'
import CompleteView from '@/components/views/CompleteView'
import DashboardView from '@/components/views/DashboardView'

type AppView = 'hero' | 'scanning' | 'list' | 'extracting' | 'complete' | 'dashboard'

export default function Home() {
	const [view, setView] = useState<AppView>('hero')
	const [backups, setBackups] = useState<BackupT[]>([])
	const [selectedBackup, setSelectedBackup] = useState<BackupT | null>(null)
	const [conversations, setConversations] = useState<ConversationT[]>([])

	const scanBackups = async () => {
		setView('scanning')
		try {
			const res = await fetch('/api/backups')
			const data = await res.json()

			if (res.ok && data.backups) {
				setBackups(data.backups)
				setView('list')
			} else {
				toast.error('Failed to scan backups', { description: data.error || 'Unknown error' })
				setView('hero')
			}
		} catch (error) {
			console.error(error)
			toast.error('Network error during scan')
			setView('hero')
		}
	}

	const extractBackup = async (backup: BackupT) => {
		setSelectedBackup(backup)
		setView('extracting')

		try {
			const res = await fetch('/api/extract', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ backupId: backup.id })
			})
			const data = await res.json()

			if (!res.ok) {
				toast.error('Extraction failed', { description: data.error || 'Unknown error' })
				setView('list')
				setSelectedBackup(null)
				return
			}

			const extractedConversations = data as ConversationT[]
			setConversations(extractedConversations)
			setView('complete')

			const totalMessages = extractedConversations.reduce((total, c) => total + c.messages.length, 0)
			toast.success('Database extracted successfully!', {
				description: `${extractedConversations.length} conversations, ${totalMessages.toLocaleString()} messages.`
			})
		} catch (error) {
			console.error(error)
			toast.error('Network error during extraction')
			setView('list')
			setSelectedBackup(null)
		}
	}

	if (view === 'dashboard') {
		return <DashboardView conversations={conversations} onBack={() => setView('complete')} />
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
				{view === 'list' && <BackupListView backups={backups} onSelectBackup={extractBackup} onBack={() => setView('hero')} />}
				{view === 'extracting' && <ExtractingView selectedBackup={selectedBackup} />}
				{view === 'complete' && (
					<CompleteView
						conversations={conversations}
						onLoadDifferent={() => setView('list')}
						onOpenDashboard={() => setView('dashboard')}
					/>
				)}
			</div>
		</main>
	)
}
