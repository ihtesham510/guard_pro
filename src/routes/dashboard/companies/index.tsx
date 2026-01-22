import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { companyQueries } from '@/services/queries'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import { CompanySimpleTable } from '@/components/dashboard/company/simple-table'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty'
import { Building2 } from 'lucide-react'
import { useAppState } from '@/context/app-context'

export const Route = createFileRoute('/dashboard/companies/')({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(companyQueries.getCompanies())
	},
})

function RouteComponent() {
	const { dialogs } = useAppState()
	const { data } = useSuspenseQuery(companyQueries.getCompanies())

	if (data.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia>
						<Building2 />
					</EmptyMedia>
					<EmptyTitle>No Companies Yet</EmptyTitle>
					<EmptyDescription>You haven't added any companies yet. Get Started by adding companies.</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button onClick={() => dialogs.open('add-company')}>Add Company</Button>
				</EmptyContent>
			</Empty>
		)
	}

	return (
		<div className='space-y-4'>
			<DashboardTitle title='Manage Companies' />
			<Suspense
				fallback={
					<div>
						<Spinner />
					</div>
				}
			>
				<CompanySimpleTable data={data} />
			</Suspense>
		</div>
	)
}
