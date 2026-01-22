import { employeeQuries } from '@/services/queries'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/employees/$Id')({
	component: RouteComponent,
	loader: async ({ context: { queryClient }, params: { Id } }) => {
		await queryClient.ensureQueryData(employeeQuries.get_employee_by_id(Id))
	},
})

function RouteComponent() {
	const { Id } = Route.useParams()
	const { data: employee } = useQuery(employeeQuries.get_employee_by_id(Id))
	return <div>{JSON.stringify(employee)}</div>
}
