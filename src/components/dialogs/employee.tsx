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
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppState } from '@/context/app-context'
import { employeInsertSchemaWithAddress } from '@/services/employee.schema'
import { useAuthentication } from '@/lib/auth-client'
import { useMutation } from '@tanstack/react-query'
import { addEmployee } from '@/services/employee.api'
import { employeeQuries } from '@/services/queries'
import Stepper, { Step } from '@/components/Stepper'
import { PhoneInput } from '../ui/phone-input'
import { FieldSet, FieldDescription, FieldLegend } from '@/components/ui/field'
import { Textarea } from '../ui/textarea'
import z from 'zod'
import { useIsMobile } from '@/hooks/use-mobile'
import { enums } from '@/db/schema'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { capitalizeFirstLetter, generateEmployeeCode } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { WandSparkles } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export function EmployeeDialog() {
	const { user } = useAuthentication()
	const isMobile = useIsMobile()
	const [currentStep, setCurrentStep] = useState(1)
	const addEmployeeMutation = useMutation({
		mutationFn: addEmployee,
		meta: {
			invalidateQuries: employeeQuries.all,
			successMessage: 'Added Employee Successfully',
			errorMessage: 'Error while adding employee',
		},
	})
	const schema = employeInsertSchemaWithAddress.superRefine(({ employeeCode }, ctx) => {
		const symbol_regex = /[^a-zA-Z0-9]/
		const hasAppropiatelenght = employeeCode && employeeCode.length === 8
		const hasAnySymbols = !!(employeeCode && symbol_regex.test(employeeCode))
		if (!hasAppropiatelenght) {
			ctx.addIssue({
				code: 'custom',
				message: 'Code must of under 8 characters',
				path: ['employeeCode'],
			})
		}
		if (hasAnySymbols) {
			ctx.addIssue({
				code: 'custom',
				message: 'Code must not contain any symbols',
				path: ['employeeCode'],
			})
		}
	})

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			userId: user!.id,
			address: undefined,
			employeeCode: generateEmployeeCode(),
		},
	})
	const { dialogs } = useAppState()

	const handleSubmit = async (values: z.infer<typeof schema>) => {
		const cleanedValues = { ...values }
		if (cleanedValues.address) {
			const addressFields = ['address_line_1', 'address_line_2', 'state', 'city', 'zip', 'country'] as const
			const hasAnyAddressField = addressFields.some(field => {
				const value = cleanedValues.address?.[field]
				return value !== undefined && value !== null && value !== ''
			})
			if (!hasAnyAddressField) {
				cleanedValues.address = undefined
			}
		}
		await addEmployeeMutation.mutateAsync({
			data: cleanedValues,
		})
		form.reset()
		dialogs.close('add-employee')
	}

	const handleSkipAddress = () => {
		// Clear all address fields
		form.setValue('address', undefined)
		// Navigate to step 5 (Employee Identification step) - skip steps 3 and 4
		setCurrentStep(5)
	}

	useEffect(() => {
		if (!dialogs.state['add-employee']) {
			form.reset()
			setCurrentStep(1)
		}
	}, [dialogs.state['add-employee']])

	return (
		<ResponsiveDialog open={dialogs.state['add-employee']} onOpenChange={e => dialogs.setState('add-employee', e)}>
			<ResponsiveDialogContent>
				<ResponsiveDialogForm form={form} onSubmit={form.handleSubmit(handleSubmit)}>
					<ResponsiveDialogHeader>
						<ResponsiveDialogTitle>Add Employee</ResponsiveDialogTitle>
					</ResponsiveDialogHeader>
					<Stepper
						hideSteps={isMobile}
						step={currentStep}
						submitting={form.formState.isSubmitting}
						onStepChange={setCurrentStep}
					>
						<Step>
							<FieldSet>
								<FieldLegend>Employee Name</FieldLegend>
								<FieldDescription>Provide employee first and last name.</FieldDescription>

								<FormField
									control={form.control}
									name='firstName'
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='lastName'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last Name</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</FieldSet>
						</Step>
						<Step>
							<FieldSet>
								<FieldLegend>Employee's Contact</FieldLegend>
								<FieldDescription>Provide employee's work or personal phone number and email.</FieldDescription>
								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input placeholder='Enter full name' {...field} />
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
												<PhoneInput {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</FieldSet>
						</Step>
						<Step>
							<FieldSet>
								<div className='flex items-center justify-between mb-2'>
									<div>
										<FieldLegend>Employee Address</FieldLegend>
										<FieldDescription>Provide employee's address.</FieldDescription>
									</div>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={handleSkipAddress}
										className='text-muted-foreground hover:text-foreground'
									>
										Skip
									</Button>
								</div>
								<FormField
									control={form.control}
									name='address.address_line_1'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Address line 1 (optional)</FormLabel>
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
						</Step>
						<Step>
							<FieldSet>
								<div className='flex items-center justify-between mb-2'>
									<div>
										<FieldLegend>Employee's Location</FieldLegend>
										<FieldDescription>Provide employee's location, state, city and postal code</FieldDescription>
									</div>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={handleSkipAddress}
										className='text-muted-foreground hover:text-foreground'
									>
										Skip
									</Button>
								</div>
								<div className='flex justify-between items-center gap-2'>
									<FormField
										control={form.control}
										name='address.zip'
										render={({ field }) => (
											<FormItem className='w-full'>
												<FormLabel>Zip/Postal Code (optional)</FormLabel>
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
												<FormLabel>City (optional)</FormLabel>
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
												<FormLabel>State (optional)</FormLabel>
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
												<FormLabel>Country (optional)</FormLabel>
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
						<Step>
							<FieldSet>
								<FieldLegend>Employee's Identification</FieldLegend>
								<FieldDescription>Generate or enter employees code and his/her's postions.</FieldDescription>
								<FormField
									control={form.control}
									name='employeeCode'
									render={({ field }) => (
										<FormItem className='w-full'>
											<FormLabel>Employee Code</FormLabel>
											<FormControl>
												<InputGroup>
													<InputGroupInput {...field} value={field.value ?? undefined} />
													<InputGroupAddon
														align='inline-end'
														className='cursor-pointer'
														onClick={() => form.setValue('employeeCode', generateEmployeeCode())}
													>
														<Tooltip>
															<TooltipTrigger asChild>
																<WandSparkles />
															</TooltipTrigger>
															<TooltipContent>Generate Employee Code</TooltipContent>
														</Tooltip>
													</InputGroupAddon>
												</InputGroup>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='position'
									render={({ field }) => (
										<FormItem className='w-full'>
											<FormLabel>Employee Position</FormLabel>
											<FormControl>
												<Select {...field}>
													<SelectTrigger className='w-full'>
														<SelectValue className='w-full' placeholder='select position' />
													</SelectTrigger>
													<SelectContent>
														{enums.employeePositionEnum.map((pos, i) => (
															<SelectItem value={pos} key={i}>
																{capitalizeFirstLetter(pos)}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</FieldSet>
						</Step>
					</Stepper>
				</ResponsiveDialogForm>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	)
}
