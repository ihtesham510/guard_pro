import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Calendar, AlertTriangle } from 'lucide-react'

const complianceAlerts = [
	{
		type: 'License Expiry',
		guard: 'John Smith',
		item: 'Security License',
		daysLeft: 15,
		priority: 'medium',
	},
	{
		type: 'Training Due',
		guard: 'Mike Davis',
		item: 'First Aid Certification',
		daysLeft: 7,
		priority: 'high',
	},
	{
		type: 'Document Missing',
		guard: 'Tom Brown',
		item: 'Background Check',
		daysLeft: 0,
		priority: 'critical',
	},
	{
		type: 'License Expiry',
		guard: 'Emma Garcia',
		item: 'Firearms Permit',
		daysLeft: 30,
		priority: 'low',
	},
]

export function ComplianceAlerts() {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Shield className='h-5 w-5 text-yellow-600' />
					<CardTitle>Compliance Alerts</CardTitle>
				</div>
				<Badge variant='destructive' className='text-xs'>
					7 alerts
				</Badge>
			</CardHeader>
			<CardContent>
				<div className='space-y-3'>
					{complianceAlerts.map((alert, index) => (
						<div key={index} className='p-3 rounded-lg border space-y-2'>
							<div className='flex items-start justify-between'>
								<div className='space-y-1'>
									<div className='flex items-center gap-2'>
										<AlertTriangle
											className={`h-4 w-4 ${
												alert.priority === 'critical'
													? 'text-red-600'
													: alert.priority === 'high'
														? 'text-orange-600'
														: alert.priority === 'medium'
															? 'text-yellow-600'
															: 'text-blue-600'
											}`}
										/>
										<span className='font-medium text-sm'>{alert.type}</span>
									</div>
									<div className='text-sm text-muted-foreground'>
										{alert.guard} - {alert.item}
									</div>
									<div className='flex items-center gap-1 text-xs text-muted-foreground'>
										<Calendar className='h-3 w-3' />
										{alert.daysLeft === 0 ? 'Overdue' : `${alert.daysLeft} days left`}
									</div>
								</div>
								<Badge
									variant={
										alert.priority === 'critical'
											? 'destructive'
											: alert.priority === 'high'
												? 'destructive'
												: alert.priority === 'medium'
													? 'secondary'
													: 'outline'
									}
									className='text-xs'
								>
									{alert.priority}
								</Badge>
							</div>
						</div>
					))}
				</div>
				<Button variant='outline' size='sm' className='w-full mt-4 bg-transparent'>
					View All Compliance Items
				</Button>
			</CardContent>
		</Card>
	)
}
