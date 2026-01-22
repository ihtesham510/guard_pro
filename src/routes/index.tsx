import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: App,
})

function App() {
	const { userSession } = Route.useRouteContext()
	return (
		<div className='h-screen w-full flex items-center justify-center'>
			{userSession ? (
				<Link to='/dashboard'>
					<Button>Go To Dashboard</Button>
				</Link>
			) : (
				<Link to='/sign-in'>
					<Button>Sign In</Button>
				</Link>
			)}
		</div>
	)
}
