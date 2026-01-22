import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const attendanceData = [
	{ guard: 'John Smith', status: 'on-time', clockIn: '08:00', location: 'Downtown Mall' },
	{ guard: 'Sarah Johnson', status: 'on-time', clockIn: '16:00', location: 'Office Complex A' },
	{ guard: 'Mike Davis', status: 'late', clockIn: '00:15', location: 'Warehouse District' },
	{ guard: 'Lisa Wilson', status: 'on-time', clockIn: '12:00', location: 'Retail Center' },
	{ guard: 'Tom Brown', status: 'absent', clockIn: '-', location: 'Shopping Plaza' },
	{ guard: 'Emma Garcia', status: 'on-time', clockIn: '06:00', location: 'Corporate HQ' },
]

export function AttendanceHeatmap() {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Clock className='h-5 w-5 text-green-600' />
					<CardTitle>Attendance Overview</CardTitle>
				</div>
				<div className='text-sm text-muted-foreground'>Today - {new Date().toLocaleDateString()}</div>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					<div className='flex gap-4 text-sm'>
						<div className='flex items-center gap-2'>
							<CheckCircle className='h-4 w-4 text-green-600' />
							<span>On Time: 4</span>
						</div>
						<div className='flex items-center gap-2'>
							<AlertCircle className='h-4 w-4 text-yellow-600' />
							<span>Late: 1</span>
						</div>
						<div className='flex items-center gap-2'>
							<XCircle className='h-4 w-4 text-red-600' />
							<span>Absent: 1</span>
						</div>
					</div>

					<div className='space-y-2'>
						{attendanceData.map((record, index) => (
							<div key={index} className='flex items-center justify-between p-2 rounded border'>
								<div className='flex items-center gap-3'>
									{record.status === 'on-time' && <CheckCircle className='h-4 w-4 text-green-600' />}
									{record.status === 'late' && <AlertCircle className='h-4 w-4 text-yellow-600' />}
									{record.status === 'absent' && <XCircle className='h-4 w-4 text-red-600' />}
									<div>
										<div className='font-medium'>{record.guard}</div>
										<div className='text-sm text-muted-foreground'>{record.location}</div>
									</div>
								</div>
								<div className='text-right'>
									<div className='text-sm font-medium'>{record.clockIn}</div>
									<Badge
										variant={
											record.status === 'on-time' ? 'default' : record.status === 'late' ? 'secondary' : 'destructive'
										}
										className='text-xs'
									>
										{record.status}
									</Badge>
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
