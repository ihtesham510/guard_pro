import { siteQueries } from '@/services/queries'
import { DashboardTitle } from '../dashboard-title'
import { EventsCalendar } from '@/components/utils/event-calendar'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'

const routeApi = getRouteApi('/dashboard/sites/$siteId')

export function SiteShift() {
	const { siteId } = routeApi.useParams()
	const { data } = useQuery(siteQueries.getSiteShifts(siteId))
	if (data) {
		return (
			<div className='flex flex-col gap-4'>
				<DashboardTitle title='Schedule' />
				<EventsCalendar
					events={[{ date: new Date(Date.now()) }]}
					eventAccessKey='date'
					eventBadge={event => <h1>{event.date.toString()}</h1>}
				/>
			</div>
		)
	} else {
		return null
	}
}
