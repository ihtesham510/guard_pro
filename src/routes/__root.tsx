import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import appCss from '@/styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { authQueries } from '@/services/queries'
import { Spinner } from '@/components/ui/spinner'
import { Toaster } from 'sonner'
import { ThemeProvider, themeQuery } from '@/context/theme-context'

interface RouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
	beforeLoad: async ({ context }) => {
		await context.queryClient.ensureQueryData(themeQuery)
		const userSession = await context.queryClient.fetchQuery(authQueries.user())
		return { userSession }
	},
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'TanStack Start Starter',
			},
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss,
			},
		],
	}),
	pendingComponent: () => (
		<div className='flex w-full h-screen items-center rounded justify-center'>
			<Spinner />
		</div>
	),
	shellComponent: ({ children }) => (
		<ThemeProvider>
			<RootDocument>{children}</RootDocument>
		</ThemeProvider>
	),
})

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<head>
				<HeadContent />
				<script async crossOrigin='anonymous' src='https://tweakcn.com/live-preview.min.js' />
			</head>
			<body>
				<Toaster />
				{children}
				<TanStackDevtools
					config={{
						position: 'bottom-left',
					}}
					plugins={[
						{
							name: 'Tanstack Router',
							render: <TanStackRouterDevtoolsPanel />,
						},
						{
							name: 'Tanstack Query',
							render: <ReactQueryDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	)
}
