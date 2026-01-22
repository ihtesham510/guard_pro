import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignUpForm } from '@/components/auth/sign-up-form'

export const Route = createFileRoute('/(auth)/sign-up')({
	component: SignUpForm,
	beforeLoad({ context: { userSession } }) {
		if (userSession) {
			throw redirect({
				to: '/dashboard',
			})
		}
	},
})
