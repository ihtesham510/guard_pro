import { useAuthentication } from '@/lib/auth-client'
import { PropsWithChildren } from 'react'

export function SignedIn({ children }: PropsWithChildren) {
	const { isAuthenticated } = useAuthentication()
	if (isAuthenticated) {
		return children
	}
	return null
}
