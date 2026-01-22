import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignInForm } from '@/components/auth/sign-in-form'

export const Route = createFileRoute('/(auth)/sign-in')({
	component: SignInForm,
	beforeLoad({ context: { userSession } }) {
		if (userSession) {
			throw redirect({
				to: '/dashboard',
			})
		}
	},
})
