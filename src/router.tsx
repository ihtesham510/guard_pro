import { createRouter as createTanstackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

import { routeTree } from './routeTree.gen'
import { MutationCache, QueryClient, QueryClientProvider, QueryKey } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof getRouter>
	}
}

declare module '@tanstack/react-query' {
	interface Register {
		mutationMeta: {
			updateQueryData?: { key: string[]; value?: any }[]
			invalidateQuries?: QueryKey
			successMessage?: string
			errorMessage?: string
		}
	}
}

export const getRouter = () => {
	const queryClient = new QueryClient({
		mutationCache: new MutationCache({
			async onMutate(_variables, mutation) {
				if (mutation.meta?.updateQueryData) {
					for (const item of mutation.meta?.updateQueryData) {
						await queryClient.setQueryData(item.key, item.value ?? _variables)
					}
					if (mutation.meta.invalidateQuries) {
						await queryClient.invalidateQueries({ queryKey: mutation.meta?.invalidateQuries })
					}
				}
			},
			onSuccess(_data, _variables, _context, mutation) {
				if (mutation.meta?.successMessage) {
					toast.success(mutation.meta?.successMessage)
				}
			},
			onError(_error, _variables, _context, mutation) {
				if (mutation.meta?.errorMessage) {
					toast.success(mutation.meta?.errorMessage)
				} else {
					toast.error(`${_error.name} : ${_error.message}`)
				}
			},
			async onSettled(_data, _error, _variables, _context, mutation) {
				if (mutation.meta?.invalidateQuries) {
					await queryClient.invalidateQueries({ queryKey: mutation.meta?.invalidateQuries })
				}
			},
		}),
	})

	const router = createTanstackRouter({
		routeTree,
		context: { queryClient },
		defaultNotFoundComponent: () => <div>Page Not Found</div>,
		defaultPreload: 'intent',
		Wrap: (props: { children: React.ReactNode }) => {
			return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
		},
	})

	setupRouterSsrQueryIntegration({ router, queryClient })

	return router
}
