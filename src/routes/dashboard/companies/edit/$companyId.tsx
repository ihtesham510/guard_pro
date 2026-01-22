import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { companyInsertSchemaWithAddress, CompanyInsertSchemaWithAddress } from '@/services/company.schema'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FieldSet, FieldDescription, FieldLegend } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { useMutation, useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { companyQueries } from '@/services/queries'
import { Button } from '@/components/ui/button'
import { updateCompany } from '@/services/company.api'
import { PhoneInput } from '@/components/ui/phone-input'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/dashboard/companies/edit/$companyId')({
	component: RouteComponent,
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData(companyQueries.getCompanyWithAddress(params.companyId))
	},
})

function RouteComponent() {
	const { companyId } = Route.useParams()
	const router = useRouter()
	const queryClient = useQueryClient()
	const { data: company } = useSuspenseQuery(companyQueries.getCompanyWithAddress(companyId))

	const updateCompanyMutation = useMutation({
		mutationFn: updateCompany,
		meta: {
			successMessage: 'Company updated Successfully',
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: companyQueries.all })
			router.navigate({ to: '/dashboard/companies' })
		},
	})

	const form = useForm<CompanyInsertSchemaWithAddress>({
		resolver: zodResolver(companyInsertSchemaWithAddress),
		defaultValues: {
			userId: company?.userId || '',
			name: company?.name || '',
			email: company?.email || undefined,
			phone: company?.phone || undefined,
			address: company?.address
				? {
						address_line_1: company.address.address_line_1 || '',
						address_line_2: company.address.address_line_2 || undefined,
						city: company.address.city || '',
						state: company.address.state || '',
						zip: company.address.zip || '',
						country: company.address.country || '',
					}
				: undefined,
		},
	})

	const handleSubmit = async (data: CompanyInsertSchemaWithAddress) => {
		await updateCompanyMutation.mutateAsync({
			data: {
				id: companyId,
				data,
			},
		})
	}

	if (!company) {
		return <Spinner />
	}

	return (
		<div className='space-y-6'>
			<DashboardTitle title='Edit Company' />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
					<FieldSet>
						<FieldLegend>Company Information</FieldLegend>
						<FieldDescription>Provide company name and basic details.</FieldDescription>

						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Company Name</FormLabel>
									<FormControl>
										<Input placeholder='Enter company name' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldSet>

					<FieldSet>
						<FieldLegend>Company Contact</FieldLegend>
						<FieldDescription>Provide company phone number (optional).</FieldDescription>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} value={field.value ?? undefined} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='phone'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<PhoneInput {...field} value={field.value ?? undefined} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldSet>

					<FieldSet>
						<FieldLegend>Company's Address</FieldLegend>
						<FieldDescription>Provide company's address.</FieldDescription>
						<FormField
							control={form.control}
							name='address.address_line_1'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address line 1</FormLabel>
									<FormControl>
										<Textarea className='resize-none' {...field} value={field.value ?? undefined} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='address.address_line_2'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address line 2 (optional)</FormLabel>
									<FormControl>
										<Textarea className='resize-none' {...field} value={field.value ?? undefined} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldSet>

					<FieldSet>
						<FieldLegend>Company's Location</FieldLegend>
						<FieldDescription>Provide Company's location, state, city and postal code</FieldDescription>
						<div className='flex justify-between items-center gap-2'>
							<FormField
								control={form.control}
								name='address.zip'
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormLabel>Zip/Postal Code</FormLabel>
										<FormControl>
											<Input {...field} value={field.value ?? undefined} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='address.city'
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormLabel>City</FormLabel>
										<FormControl>
											<Input {...field} value={field.value ?? undefined} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className='flex justify-between items-center gap-2'>
							<FormField
								control={form.control}
								name='address.state'
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormLabel>State</FormLabel>
										<FormControl>
											<Input {...field} value={field.value ?? undefined} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='address.country'
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormLabel>Country</FormLabel>
										<FormControl>
											<Input {...field} value={field.value ?? undefined} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</FieldSet>

					<div className='flex justify-end gap-2'>
						<Button type='button' variant='outline' onClick={() => router.navigate({ to: '/dashboard/companies' })}>
							Cancel
						</Button>
						<Button type='submit' disabled={updateCompanyMutation.isPending}>
							{updateCompanyMutation.isPending ? 'Saving...' : 'Save Changes'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}
