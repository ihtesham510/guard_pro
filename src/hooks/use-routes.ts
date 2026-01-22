import { useAppState } from '@/context/app-context'
import { useMatchRoute } from '@tanstack/react-router'
import {
	SearchIcon,
	Gauge,
	MessagesSquare,
	CalendarFold,
	Users,
	Building2,
	Navigation,
	AlertOctagon,
	DollarSignIcon,
	Clock,
} from 'lucide-react'

export function useRoutes() {
	const route = useMatchRoute()
	const { dialogs } = useAppState()
	return [
		{
			label: 'General',
			items: [
				{
					title: 'Search',
					description: 'Search application',
					icon: SearchIcon,
					onClick: () => dialogs.open('command-menu'),
				},
				{
					title: 'Overview',
					description: 'Get an Overview of all things',
					icon: Gauge,
					href: {
						to: '/dashboard',
					},
					isActive: !!route({
						to: '/dashboard',
						fuzzy: false,
					}),
				},
				{
					title: 'Messages',
					description: "See you're messages with employees",
					icon: MessagesSquare,
					href: {
						to: '/dashboard/messages',
					},
					isActive: !!route({
						to: '/dashboard/messages',
						fuzzy: false,
					}),
				},
			],
		},
		{
			label: 'Operations',
			items: [
				{
					title: 'Attendance',
					icon: Clock,
					description: 'See Employees attendance',
					href: {
						to: '/dashboard/attendance',
					},
					isActive: !!route({
						to: '/dashboard/attendance',
						fuzzy: true,
					}),
				},
				{
					title: 'Schedules',
					icon: CalendarFold,
					description: "See you're schedules for employees and sites",
					href: {
						to: '/dashboard/schedules',
					},
					isActive: !!route({
						to: '/dashboard/schedules',
						fuzzy: false,
					}),
				},
				{
					title: 'Employees',
					description: "See and mange you're employees",
					icon: Users,
					href: {
						to: '/dashboard/employees',
					},
					isActive: !!route({
						to: '/dashboard/employees',
						fuzzy: false,
					}),
				},
				{
					title: 'Companies',
					description: "See and mange you're companies",
					icon: Building2,
					href: {
						to: '/dashboard/companies',
					},
					isActive: !!route({
						to: '/dashboard/companies',
						fuzzy: false,
					}),
				},
				{
					title: 'Sites',
					icon: Navigation,
					description: "See and mange you're sites",
					href: {
						to: '/dashboard/sites',
					},
					isActive: !!route({
						to: '/dashboard/sites',
						fuzzy: false,
					}),
				},
				{
					title: 'Incidents',
					description: 'See and manage incidents that occured on sites',
					icon: AlertOctagon,
					href: {
						to: '/dashboard/incidents',
					},
					isActive: !!route({
						to: '/dashboard/incidents',
						fuzzy: false,
					}),
				},
				{
					title: 'Payrolls',
					description: 'Generate and manage payrolls for companies and employees',
					icon: DollarSignIcon,
					href: {
						to: '/dashboard/payrolls',
					},
					isActive: !!route({
						to: '/dashboard/payrolls',
						fuzzy: false,
					}),
				},
			],
		},
	]
}
