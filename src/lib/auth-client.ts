import { authQueries } from '@/services/queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_SERVER_URL!,
})

export const useAuthentication = () => {
	const { data } = useSuspenseQuery(authQueries.user())

	return { session: data?.session ?? null, user: data?.user ?? null, isAuthenticated: !!data }
}

export const useUser = () => {
	const { session, user } = useAuthentication()

	if (!user || !session) {
		throw new Error('User is not authenticated!')
	}

	return { session, user }
}
