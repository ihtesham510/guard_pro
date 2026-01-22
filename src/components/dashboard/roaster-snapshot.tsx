import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin } from 'lucide-react'

const upcomingShifts = [
	{
		id: 1,
		guard: 'John Smith',
		location: 'Downtown Mall',
		time: '08:00 - 16:00',
		status: 'confirmed',
	},
	{
		id: 2,
		guard: 'Sarah Johnson',
		location: 'Office Complex A',
		time: '16:00 - 00:00',
		status: 'confirmed',
	},
	{
		id: 3,
		guard: 'Mike Davis',
		location: 'Warehouse District',
		time: '00:00 - 08:00',
		status: 'pending',
	},
	{
		id: 4,
		guard: 'Lisa Wilson',
		location: 'Retail Center',
		time: '12:00 - 20:00',
		status: 'confirmed',
	},
]

export function RosterSnapshot() {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Calendar className='h-5 w-5 text-blue-600' />
					<CardTitle>Roster Snapshot</CardTitle>
				</div>
				<Button variant='outline' size='sm'>
					View Full Schedule
				</Button>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					<div className='text-sm text-muted-foreground'>Today's Shifts - {new Date().toLocaleDateString()}</div>
					<div className='space-y-3'>
						{upcomingShifts.map(shift => (
							<div key={shift.id} className='flex items-center justify-between p-3 rounded-lg border'>
								<div className='flex items-center gap-3'>
									<div className='w-2 h-2 rounded-full bg-blue-600' />
									<div>
										<div className='font-medium'>{shift.guard}</div>
										<div className='flex items-center gap-4 text-sm text-muted-foreground'>
											<div className='flex items-center gap-1'>
												<MapPin className='h-3 w-3' />
												{shift.location}
											</div>
											<div className='flex items-center gap-1'>
												<Clock className='h-3 w-3' />
												{shift.time}
											</div>
										</div>
									</div>
								</div>
								<Badge variant={shift.status === 'confirmed' ? 'default' : 'secondary'}>{shift.status}</Badge>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
