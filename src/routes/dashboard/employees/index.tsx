import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import { EmployeesDataTable } from '@/components/dashboard/employees/data-table'
import { Button } from '@/components/ui/button'
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'
import { useAppState } from '@/context/app-context'
import type { EmployeeSelectSchema } from '@/services/employee.schema'
import { employeeQuries } from '@/services/queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { UserRoundX } from 'lucide-react'
import { Suspense } from 'react'

export const Route = createFileRoute('/dashboard/employees/')({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(employeeQuries.getEmployees())
	},
	component: () => {
		const { data } = useSuspenseQuery(employeeQuries.getEmployees())
		return (
			<Suspense
				fallback={
					<div className='flex justify-center items-center'>
						<Spinner />
					</div>
				}
			>
				<RouteComponent data={data} />
			</Suspense>
		)
	},
})

function RouteComponent({ data }: { data: EmployeeSelectSchema[] }) {
	const { dialogs } = useAppState()

	if (data.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia>
						<UserRoundX />
					</EmptyMedia>
					<EmptyTitle>No Guards Yet</EmptyTitle>
					<EmptyDescription>
						You haven't added any guard yet. Get Started by adding guards for
						you're company.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button onClick={() => dialogs.open('add-employee')}>
						Add Guard
					</Button>
				</EmptyContent>
			</Empty>
		)
	}
	return (
		<div>
			<DashboardTitle title='Manage Employees' />
			<EmployeesDataTable data={data} />
		</div>
	)
}
