import { useForm } from 'react-hook-form'
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogForm,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppState } from '@/context/app-context'
import { useAuthentication } from '@/lib/auth-client'
import { useMutation } from '@tanstack/react-query'
import Stepper, { Step } from '@/components/Stepper'
import { PhoneInput } from '../ui/phone-input'
import { FieldSet, FieldDescription, FieldLegend } from '@/components/ui/field'
import { useIsMobile } from '@/hooks/use-mobile'
import { useEffect } from 'react'
import { addCompany } from '@/services/company.api'
import { companyInsertSchemaWithAddress, CompanyInsertSchemaWithAddress } from '@/services/company.schema'
import { Textarea } from '../ui/textarea'
import { companyQueries } from '@/services/queries'

export function CompanyDialog() {
	const { user } = useAuthentication()
	const isMobile = useIsMobile()

	const addCompanyMutation = useMutation({
		mutationFn: addCompany,
		meta: {
			invalidateQuries: companyQueries.all,
			successMessage: 'Added Company Successfully',
			errorMessage: 'Error while adding company',
		},
	})

	const form = useForm<CompanyInsertSchemaWithAddress>({
		resolver: zodResolver(companyInsertSchemaWithAddress),
		defaultValues: {
			userId: user!.id,
		},
	})

	const { dialogs } = useAppState()

	const handleSubmit = async (values: CompanyInsertSchemaWithAddress) => {
		await addCompanyMutation.mutateAsync({
			data: values,
		})
		form.reset()
		dialogs.close('add-company')
	}

	useEffect(() => {
		if (!dialogs.state['add-company']) {
			form.reset()
		}
	}, [dialogs.state['add-company']])

	return (
		<ResponsiveDialog open={dialogs.state['add-company']} onOpenChange={e => dialogs.setState('add-company', e)}>
			<ResponsiveDialogContent className='min-w-xl'>
				<ResponsiveDialogForm form={form} onSubmit={form.handleSubmit(handleSubmit)}>
					<ResponsiveDialogHeader>
						<ResponsiveDialogTitle>Add Company</ResponsiveDialogTitle>
					</ResponsiveDialogHeader>
					<Stepper hideSteps={isMobile}>
						<Step>
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
						</Step>
						<Step>
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
						</Step>
						<Step>
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
								/>{' '}
							</FieldSet>
						</Step>
						<Step>
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
						</Step>
					</Stepper>
				</ResponsiveDialogForm>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	)
}
