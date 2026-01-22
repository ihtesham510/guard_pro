import { Link, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GalleryVerticalEnd, LoaderCircle } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { authClient } from '@/lib/auth-client'
import { SocialLogins } from '@/components/auth/social-logins'
import { PasswordInput } from '@/components/ui/password-input'
import { useQueryClient } from '@tanstack/react-query'

const formSchema = z.object({
	name: z.string(),
	email: z.email(),
	password: z.string().min(8).max(18),
})

export function SignUpForm() {
	const router = useRouter()
	const queryClient = useQueryClient()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})
	async function onSubmit(values: z.infer<typeof formSchema>) {
		const res = await authClient.signUp.email(values, {
			onError(ctx) {
				console.log('error', { code: ctx.error.code, message: ctx.error.message })
				if (ctx.error.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
					form.setError('email', {
						message: 'Email already exits, please sign in instead',
					})
				}
			},
		})
		if (res.error) {
			return
		}
		await queryClient.invalidateQueries()
		await router.invalidate()
	}

	return (
		<div className='flex justify-center items-center min-h-screen'>
			<Form {...form}>
				<form className='max-w-lg' onSubmit={form.handleSubmit(onSubmit)}>
					<div className='flex flex-col gap-6'>
						<div className='flex flex-col items-center gap-2'>
							<Link to='/' className='flex flex-col items-center gap-2 font-medium'>
								<div className='flex size-8 items-center justify-center rounded-md'>
									<GalleryVerticalEnd className='size-6' />
								</div>
								<span className='sr-only'>Acme Inc.</span>
							</Link>
							<h1 className='text-xl font-bold'>Welcome to Guard Pro.</h1>
							<div className='text-center text-sm'>
								Already have an account?{' '}
								<Link to='/sign-in' className='underline underline-offset-4'>
									Sign In
								</Link>
							</div>
						</div>
						<div className='flex flex-col gap-6'>
							<div className='grid gap-3'>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='grid gap-3'>
								{' '}
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='grid gap-3'>
								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<PasswordInput {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? <LoaderCircle className='size-5 animate-spin' /> : 'Sign Up'}
							</Button>
						</div>
						<div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
							<span className='bg-background text-muted-foreground relative z-10 px-2'>Or</span>
						</div>
						<SocialLogins />
					</div>
				</form>
			</Form>
		</div>
	)
}
