import { Loader2 } from 'lucide-react'

const ScanningView = () => {
	return (
		<div className="flex flex-col items-center justify-center space-y-6 animate-pulse">
			<Loader2 className="h-16 w-16 text-brand-accent animate-spin" />
			<p className="text-lg text-muted-foreground font-medium">Scanning local backups...</p>
		</div>
	)
}

export default ScanningView
