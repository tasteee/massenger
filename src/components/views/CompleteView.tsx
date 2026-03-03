import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTotalMessageCount } from '@/lib/conversation-utils'

type CompleteViewProps = {
	conversations: ConversationT[]
	onLoadDifferent: () => void
	onOpenDashboard: () => void
}

const CompleteView = ({ conversations, onLoadDifferent, onOpenDashboard }: CompleteViewProps) => {
	const totalMessages = getTotalMessageCount(conversations)
	const groupChats = conversations.filter((conversation) => conversation.metadata.isGroup).length

	return (
		<div className="flex flex-col items-center justify-center max-w-lg text-center animate-in fade-in slide-in-from-bottom-8 duration-500 p-8 bg-surface-elevated/30 border border-border rounded-2xl backdrop-blur-md shadow-2xl">
			<div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
				<CheckCircle className="h-10 w-10" />
			</div>

			<h2 className="text-3xl font-bold mb-2">Extraction Complete</h2>
			<p className="text-muted-foreground mb-8">Successfully loaded your message database.</p>

			<div className="grid grid-cols-3 gap-4 w-full mb-8">
				<div className="bg-surface-active p-4 rounded-xl border border-border">
					<div className="text-3xl font-bold text-foreground mb-1">{conversations.length.toLocaleString()}</div>
					<div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Conversations</div>
				</div>
				<div className="bg-surface-active p-4 rounded-xl border border-border">
					<div className="text-3xl font-bold text-foreground mb-1">{totalMessages.toLocaleString()}</div>
					<div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Messages</div>
				</div>
				<div className="bg-surface-active p-4 rounded-xl border border-border">
					<div className="text-3xl font-bold text-foreground mb-1">{groupChats.toLocaleString()}</div>
					<div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Group Chats</div>
				</div>
			</div>

			<div className="flex gap-4">
				<Button variant="outline" onClick={onLoadDifferent}>
					Load Different Backup
				</Button>
				<Button className="bg-brand-primary text-white hover:bg-brand-primary/90 px-8" onClick={onOpenDashboard}>
					Open Dashboard
				</Button>
			</div>
		</div>
	)
}

export default CompleteView
