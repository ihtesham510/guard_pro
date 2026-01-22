import { AttendanceHeatmap } from '@/components/dashboard/attendence-heatmap'
import { ComplianceAlerts } from '@/components/dashboard/compilance-alert'
import { IncidentReports } from '@/components/dashboard/incident-reports'
import { KPICards } from '@/components/dashboard/kpi-cards'
import { MessagingPanel } from '@/components/dashboard/messages-panel'
import { PayrollSummary } from '@/components/dashboard/payroll-summary'
import { RosterSnapshot } from '@/components/dashboard/roaster-snapshot'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className='space-y-6'>
			<KPICards />
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<div className='lg:col-span-2 space-y-6'>
					<RosterSnapshot />
					<AttendanceHeatmap />
					<IncidentReports />
				</div>
				<div className='space-y-6'>
					<ComplianceAlerts />
					<PayrollSummary />
					<MessagingPanel />
				</div>
			</div>
		</div>
	)
}
