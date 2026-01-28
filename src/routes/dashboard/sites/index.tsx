import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import { SiteDataTable } from '@/components/dashboard/sites/data-table'
import { SiteCardView } from '@/components/dashboard/sites/card-view'
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
import { siteQueries } from '@/services/queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { NavigationOff, LayoutGrid, Table } from 'lucide-react'
import { Suspense, useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

export const Route = createFileRoute('/dashboard/sites/')({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(siteQueries.getSites())
	},
})

function RouteComponent() {
	const { dialogs } = useAppState()
	const { data } = useSuspenseQuery(siteQueries.getSites())
	const [viewMode, setViewMode] = useState<'table' | 'card'>('card')
	const mobile = useIsMobile()
	if (data.length === 0)
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia>
						<NavigationOff />
					</EmptyMedia>
					<EmptyTitle>No Sites Yet</EmptyTitle>
					<EmptyDescription>
						You haven't added any sites yet. Get Started by adding sites.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button onClick={() => dialogs.open('add-site')}>Add Site</Button>
				</EmptyContent>
			</Empty>
		)

	return (
		<Suspense
			fallback={
				<div>
					<Spinner />
				</div>
			}
		>
			<div>
				{!mobile && (
					<div className='flex items-center justify-between mb-4'>
						<DashboardTitle title='Manage Sites' />
						<div className='flex gap-2'>
							<Button
								variant={viewMode === 'table' ? 'default' : 'outline'}
								size='icon'
								onClick={() => setViewMode('table')}
							>
								<Table className='h-4 w-4' />
								<span className='sr-only'>Table view</span>
							</Button>
							<Button
								variant={viewMode === 'card' ? 'default' : 'outline'}
								size='icon'
								onClick={() => setViewMode('card')}
							>
								<LayoutGrid className='h-4 w-4' />
								<span className='sr-only'>Card view</span>
							</Button>
						</div>
					</div>
				)}

				{viewMode === 'table' && !mobile ? (
					<SiteDataTable data={data} />
				) : (
					<SiteCardView data={data} />
				)}
			</div>
		</Suspense>
	)
}
