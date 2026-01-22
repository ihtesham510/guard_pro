import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Clock, FileText, TrendingUp } from 'lucide-react'

const payrollData = {
	totalHours: 1248,
	totalAmount: '$18,720',
	pendingInvoices: 3,
	weeklyIncrease: '+12%',
}

const recentPayroll = [
	{ guard: 'John Smith', hours: 40, amount: '$600', status: 'approved' },
	{ guard: 'Sarah Johnson', hours: 38, amount: '$570', status: 'pending' },
	{ guard: 'Mike Davis', hours: 42, amount: '$630', status: 'approved' },
	{ guard: 'Lisa Wilson', hours: 36, amount: '$540', status: 'pending' },
]

export function PayrollSummary() {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between'>
				<div className='flex items-center gap-2'>
					<DollarSign className='h-5 w-5 text-green-600' />
					<CardTitle>Payroll Summary</CardTitle>
				</div>
				<Badge variant='outline' className='text-xs'>
					This Week
				</Badge>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{/* Summary Stats */}
					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-1'>
							<div className='text-2xl font-bold'>{payrollData.totalHours}</div>
							<div className='text-xs text-muted-foreground flex items-center gap-1'>
								<Clock className='h-3 w-3' />
								Total Hours
							</div>
						</div>
						<div className='space-y-1'>
							<div className='text-2xl font-bold'>{payrollData.totalAmount}</div>
							<div className='text-xs text-muted-foreground flex items-center gap-1'>
								<TrendingUp className='h-3 w-3 text-green-600' />
								{payrollData.weeklyIncrease}
							</div>
						</div>
					</div>

					{/* Pending Items */}
					<div className='p-3 rounded-lg bg-muted/50'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<FileText className='h-4 w-4 text-orange-600' />
								<span className='text-sm font-medium'>Pending Invoices</span>
							</div>
							<Badge variant='secondary'>{payrollData.pendingInvoices}</Badge>
						</div>
					</div>

					{/* Recent Payroll */}
					<div className='space-y-2'>
						<div className='text-sm font-medium'>Recent Entries</div>
						{recentPayroll.map((entry, index) => (
							<div key={index} className='flex items-center justify-between text-sm'>
								<div>
									<div className='font-medium'>{entry.guard}</div>
									<div className='text-xs text-muted-foreground'>{entry.hours}h</div>
								</div>
								<div className='text-right'>
									<div className='font-medium'>{entry.amount}</div>
									<Badge variant={entry.status === 'approved' ? 'default' : 'secondary'} className='text-xs'>
										{entry.status}
									</Badge>
								</div>
							</div>
						))}
					</div>

					<Button variant='outline' size='sm' className='w-full bg-transparent'>
						View Payroll Details
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
