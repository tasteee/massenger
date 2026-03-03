import { Smartphone, SmartphoneNfc } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type BackupListViewProps = {
	backups: BackupT[]
	onSelectBackup: (backup: BackupT) => void
	onBack: () => void
}

const BackupListView = ({ backups, onSelectBackup, onBack }: BackupListViewProps) => {
	return (
		<div className="w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="mb-8 text-center">
				<h2 className="text-2xl font-bold mb-2">Select a Backup</h2>
				<p className="text-muted-foreground">Found {backups.length} local backups available for import.</p>
			</div>

			<div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 pb-4">
				{backups.length === 0 ? (
					<Card className="bg-surface-elevated/50 border-dashed border-2">
						<CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
							<SmartphoneNfc className="h-12 w-12 mb-4 opacity-50" />
							<p>No backups found in default location.</p>
							<Button variant="link" onClick={onBack} className="mt-4">
								Go Back
							</Button>
						</CardContent>
					</Card>
				) : (
					backups.map((backup) => (
						<div
							key={backup.id}
							onClick={() => onSelectBackup(backup)}
							className="group relative flex items-center p-4 bg-surface-elevated border border-border rounded-xl cursor-pointer hover:border-brand-accent/50 hover:bg-surface-active transition-all duration-200"
						>
							<div className="h-12 w-12 rounded-full bg-surface-base flex items-center justify-center mr-4 border border-border group-hover:border-brand-accent/30 transition-colors">
								<Smartphone className="h-6 w-6 text-foreground/70 group-hover:text-brand-accent transition-colors" />
							</div>
							<div className="flex-1 min-w-0">
								<h3 className="font-semibold text-foreground truncate">
									{backup.displayName || `Backup ${backup.id.substring(0, 8)}`}
								</h3>
								<p className="text-sm text-muted-foreground truncate font-mono opacity-70">{backup.id}</p>
							</div>
							<div className="text-right pl-4">
								<span className="text-xs font-medium text-muted-foreground block">
									{new Date(backup.createdAt).toLocaleDateString()}
								</span>
								<span className="text-xs text-muted-foreground/60 block">
									{new Date(backup.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
								</span>
							</div>
						</div>
					))
				)}
			</div>

			{backups.length > 0 && (
				<div className="mt-6 text-center">
					<Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
						Cancel
					</Button>
				</div>
			)}
		</div>
	)
}

export default BackupListView
