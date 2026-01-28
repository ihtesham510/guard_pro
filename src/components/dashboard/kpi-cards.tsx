import {
	AlertTriangle,
	DollarSign,
	Shield,
	TrendingDown,
	TrendingUp,
	Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const kpiData = [
	{
		title: 'Active Guards on Shift',
		value: '24',
		change: '+2',
		trend: 'up',
		icon: Users,
		color: 'text-blue-600',
	},
	{
		title: 'Open Incidents',
		value: '3',
		change: '-1',
		trend: 'down',
		icon: AlertTriangle,
		color: 'text-red-600',
	},
	{
		title: 'Compliance Alerts',
		value: '7',
		change: '+3',
		trend: 'up',
		icon: Shield,
		color: 'text-yellow-600',
	},
	{
		title: 'Payroll Pending',
		value: '$12,450',
		change: '+$2,100',
		trend: 'up',
		icon: DollarSign,
		color: 'text-green-600',
	},
]
export function KPICards() {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
			{kpiData.map(kpi => (
				<Card key={kpi.title}>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium text-muted-foreground'>
							{kpi.title}
						</CardTitle>
						<kpi.icon className={`h-5 w-5 ${kpi.color}`} />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold'>{kpi.value}</div>
						<div className='flex items-center gap-1 text-xs text-muted-foreground'>
							{kpi.trend === 'up' ? (
								<TrendingUp className='h-3 w-3 text-green-600' />
							) : (
								<TrendingDown className='h-3 w-3 text-red-600' />
							)}
							<span
								className={
									kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
								}
							>
								{kpi.change}
							</span>
							<span>from last week</span>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
