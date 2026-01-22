import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageSquare, Clock, Pin } from 'lucide-react'

const messages = [
	{
		id: 1,
		sender: 'System',
		message: 'New shift assignments for next week are now available',
		time: '10 min ago',
		type: 'announcement',
		unread: true,
	},
	{
		id: 2,
		sender: 'John Smith',
		message: 'Completed patrol round at Downtown Mall. All clear.',
		time: '25 min ago',
		type: 'update',
		unread: true,
	},
	{
		id: 3,
		sender: 'Sarah Johnson',
		message: 'Equipment issue resolved at Office Complex A',
		time: '1 hour ago',
		type: 'update',
		unread: false,
	},
	{
		id: 4,
		sender: 'Admin',
		message: 'Monthly safety meeting scheduled for Friday 2 PM',
		time: '2 hours ago',
		type: 'announcement',
		unread: false,
	},
]

export function MessagingPanel() {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between'>
				<div className='flex items-center gap-2'>
					<MessageSquare className='h-5 w-5 text-blue-600' />
					<CardTitle>Messages</CardTitle>
				</div>
				<Badge variant='destructive' className='text-xs'>
					2 new
				</Badge>
			</CardHeader>
			<CardContent>
				<div className='space-y-3'>
					{messages.map(message => (
						<div key={message.id} className={`p-3 rounded-lg border ${message.unread ? 'bg-muted/50' : ''}`}>
							<div className='flex items-start gap-3'>
								<Avatar className='h-8 w-8'>
									<AvatarImage
										src={`/abstract-geometric-shapes.png?height=32&width=32&query=${message.sender} avatar`}
										alt={message.sender}
									/>
									<AvatarFallback className='text-xs'>
										{message.sender
											.split(' ')
											.map(n => n[0])
											.join('')}
									</AvatarFallback>
								</Avatar>
								<div className='flex-1 space-y-1'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<span className='text-sm font-medium'>{message.sender}</span>
											{message.type === 'announcement' && <Pin className='h-3 w-3 text-orange-600' />}
										</div>
										{message.unread && <div className='w-2 h-2 rounded-full bg-blue-600' />}
									</div>
									<p className='text-sm text-muted-foreground line-clamp-2'>{message.message}</p>
									<div className='flex items-center gap-1 text-xs text-muted-foreground'>
										<Clock className='h-3 w-3' />
										{message.time}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
				<Button variant='outline' size='sm' className='w-full mt-4 bg-transparent'>
					View All Messages
				</Button>
			</CardContent>
		</Card>
	)
}
