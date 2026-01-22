import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock, MapPin } from 'lucide-react'

const incidents = [
	{
		id: 'INC-001',
		title: 'Suspicious Activity',
		location: 'Downtown Mall - Parking Lot',
		reporter: 'John Smith',
		time: '2 hours ago',
		status: 'investigating',
		priority: 'high',
	},
	{
		id: 'INC-002',
		title: 'Equipment Malfunction',
		location: 'Office Complex A - Main Entrance',
		reporter: 'Sarah Johnson',
		time: '4 hours ago',
		status: 'resolved',
		priority: 'medium',
	},
	{
		id: 'INC-003',
		title: 'Unauthorized Access Attempt',
		location: 'Warehouse District - Gate 3',
		reporter: 'Mike Davis',
		time: '6 hours ago',
		status: 'pending',
		priority: 'high',
	},
]

export function IncidentReports() {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between'>
				<div className='flex items-center gap-2'>
					<AlertTriangle className='h-5 w-5 text-red-600' />
					<CardTitle>Recent Incidents</CardTitle>
				</div>
				<Button variant='outline' size='sm'>
					View All Reports
				</Button>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{incidents.map(incident => (
						<div key={incident.id} className='p-4 rounded-lg border space-y-2'>
							<div className='flex items-start justify-between'>
								<div className='space-y-1'>
									<div className='flex items-center gap-2'>
										<span className='font-medium'>{incident.title}</span>
										<Badge variant={incident.priority === 'high' ? 'destructive' : 'secondary'} className='text-xs'>
											{incident.priority}
										</Badge>
									</div>
									<div className='flex items-center gap-4 text-sm text-muted-foreground'>
										<div className='flex items-center gap-1'>
											<MapPin className='h-3 w-3' />
											{incident.location}
										</div>
										<div className='flex items-center gap-1'>
											<Clock className='h-3 w-3' />
											{incident.time}
										</div>
									</div>
									<div className='text-sm text-muted-foreground'>Reported by: {incident.reporter}</div>
								</div>
								<Badge
									variant={
										incident.status === 'resolved'
											? 'default'
											: incident.status === 'investigating'
												? 'secondary'
												: 'outline'
									}
								>
									{incident.status}
								</Badge>
							</div>
							<div className='text-xs text-muted-foreground'>ID: {incident.id}</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
