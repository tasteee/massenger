import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'

// Helper to get APPDATA path
const getAppDataPath = () => {
	return process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming')
}

export async function GET() {
	try {
		const appData = getAppDataPath()
		const backupRoot = path.join(appData, 'Apple Computer', 'MobileSync', 'Backup')

		if (!fs.existsSync(backupRoot)) {
			return NextResponse.json({ backups: [] })
		}

		const dirs = await fs.promises.readdir(backupRoot)
		const backups = []

		for (const dir of dirs) {
			const backupPath = path.join(backupRoot, dir)
			const manifestPath = path.join(backupPath, 'Manifest.db')

			// Check if directory and has Manifest.db
			if (fs.existsSync(manifestPath)) {
				try {
					const stats = await fs.promises.stat(backupPath)
					backups.push({
						id: dir,
						path: backupPath,
						createdAt: stats.birthtime,
						displayName: dir // Simplified for now
					})
				} catch (e) {
					console.error(`Error processing backup ${dir}:`, e)
				}
			}
		}

		// Sort by date (newest first)
		backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

		return NextResponse.json({ backups })
	} catch (error) {
		console.error('Error in /api/backups:', error)
		return NextResponse.json({ error: 'Failed to list backups' }, { status: 500 })
	}
}
