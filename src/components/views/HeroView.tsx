import { Button } from '@/components/ui/button'

type HeroViewProps = {
	onScan: () => void
}

const HeroView = ({ onScan }: HeroViewProps) => {
	return (
		<div className="sansFont flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
			<div className="mb-6 relative group">
				<div className="absolute -inset-1 rounded-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary opacity-20 blur-xl group-hover:opacity-40 transition duration-500"></div>
				<h1 className="relative text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/50 select-none">
					massenger
				</h1>
			</div>

			<h2 className="text-xl font-medium text-muted-foreground mb-4 max-w-[600px]">Local iPhone Backup Explorer</h2>

			<p className="text-muted-foreground/80 mb-10 max-w-[500px] leading-relaxed">
				Seamlessly index and explore your local iOS message archives. Private, secure, and running entirely on your machine.
			</p>

			<Button
				size="lg"
				onClick={onScan}
				className="btn-pill bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg shadow-brand-primary/25 h-14 px-10 text-lg transition-transform hover:scale-105 active:scale-95"
			>
				Start Indexing
			</Button>
		</div>
	)
}

export default HeroView
