import { Database } from 'lucide-react'

type ExtractingViewProps = {
	selectedBackup: BackupT | null
}

const ExtractingView = ({ selectedBackup }: ExtractingViewProps) => {
	return (
		<div className="flex flex-col items-center justify-center max-w-md text-center animate-in fade-in zoom-in duration-300 space-y-8">
			<div className="relative">
				<div className="absolute inset-0 rounded-full bg-brand-accent blur-xl opacity-20 animate-pulse"></div>
				<Database className="relative h-20 w-20 text-brand-accent animate-bounce" />
			</div>
			<div className="space-y-2">
				<h3 className="text-2xl font-bold">Extracting Database</h3>
				<p className="text-muted-foreground">
					Reading{' '}
					<span className="font-mono text-xs bg-surface-active px-1 rounded">{selectedBackup?.id.substring(0, 8)}...</span>
				</p>
			</div>
			<div className="w-64 bg-surface-active h-1.5 rounded-full overflow-hidden">
				<div className="h-full bg-brand-accent w-1/2 animate-[shimmer_2s_infinite] origin-left"></div>
			</div>
			<p className="text-xs text-muted-foreground/60">Do not close this window.</p>
		</div>
	)
}

export default ExtractingView
