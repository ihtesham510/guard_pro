import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { employeInsertSchemaWithAddress } from '@/services/employee.schema'
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	Form,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FieldSet, FieldDescription, FieldLegend } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import {
	useMutation,
	useSuspenseQuery,
	useQueryClient,
} from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { employeeQuries } from '@/services/queries'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { updateEmployee } from '@/services/employee.api'
import { PhoneInput } from '@/components/ui/phone-input'
import { enums } from '@/db/schema'
import { capitalizeFirstLetter, generateEmployeeCode } from '@/lib/utils'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group'
import { WandSparkles } from 'lucide-react'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import { Spinner } from '@/components/ui/spinner'
import type z from 'zod'

const schema = employeInsertSchemaWithAddress.superRefine(
	({ employeeCode }, ctx) => {
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
	},
)

export const Route = createFileRoute('/dashboard/employees/edit/$employeeId')({
	component: RouteComponent,
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData(
			employeeQuries.get_employee_by_id(params.employeeId),
		)
	},
})

function RouteComponent() {
	const { employeeId } = Route.useParams()
	const router = useRouter()
	const queryClient = useQueryClient()
	const { data: employee } = useSuspenseQuery(
		employeeQuries.get_employee_by_id(employeeId),
	)

	const updateEmployeeMutation = useMutation({
		mutationFn: updateEmployee,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: employeeQuries.all })
			router.navigate({ to: '/dashboard/employees' })
		},
	})

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			userId: employee?.userId || '',
			firstName: employee?.firstName || '',
			lastName: employee?.lastName || '',
			email: employee?.email || '',
			phone: employee?.phone || '',
			employeeCode: employee?.employeeCode || generateEmployeeCode(),
			position: employee?.position || 'employee',
			address: employee?.address
				? {
						address_line_1: employee.address.address_line_1 || '',
						address_line_2: employee.address.address_line_2 || undefined,
						city: employee.address.city || '',
						state: employee.address.state || '',
						zip: employee.address.zip || '',
						country: employee.address.country || '',
					}
				: undefined,
		},
	})

	const handleSkipAddress = () => {
		form.setValue('address', undefined)
	}

	const handleSubmit = async (data: z.infer<typeof schema>) => {
		const cleanedValues = { ...data }
		if (cleanedValues.address) {
			const addressFields = [
				'address_line_1',
				'address_line_2',
				'state',
				'city',
				'zip',
				'country',
			] as const
			const hasAnyAddressField = addressFields.some(field => {
				const value = cleanedValues.address?.[field]
				return value !== undefined && value !== null && value !== ''
			})
			if (!hasAnyAddressField) {
				cleanedValues.address = undefined
			}
		}
		await updateEmployeeMutation.mutateAsync({
			data: {
				id: employeeId,
				data: cleanedValues,
			},
		})
	}

	if (!employee) {
		return <Spinner />
	}

	return (
		<div className='space-y-6'>
			<DashboardTitle title='Edit Employee' />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
					<FieldSet>
						<FieldLegend>Employee Name</FieldLegend>
						<FieldDescription>
							Provide employee first and last name.
						</FieldDescription>

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

					<FieldSet>
						<FieldLegend>Employee's Contact</FieldLegend>
						<FieldDescription>
							Provide employee's work or personal phone number and email.
						</FieldDescription>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder='Enter email' {...field} />
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
										<Textarea
											className='resize-none'
											{...field}
											value={field.value ?? undefined}
										/>
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
										<Textarea
											className='resize-none'
											{...field}
											value={field.value ?? undefined}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldSet>

					<FieldSet>
						<div className='flex items-center justify-between mb-2'>
							<div>
								<FieldLegend>Employee's Location</FieldLegend>
								<FieldDescription>
									Provide employee's location, state, city and postal code
								</FieldDescription>
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

					<FieldSet>
						<FieldLegend>Employee's Identification</FieldLegend>
						<FieldDescription>
							Generate or enter employees code and his/her's postions.
						</FieldDescription>
						<FormField
							control={form.control}
							name='employeeCode'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel>Employee Code</FormLabel>
									<FormControl>
										<InputGroup>
											<InputGroupInput
												{...field}
												value={field.value ?? undefined}
											/>
											<InputGroupAddon
												align='inline-end'
												className='cursor-pointer'
												onClick={() =>
													form.setValue('employeeCode', generateEmployeeCode())
												}
											>
												<Tooltip>
													<TooltipTrigger asChild>
														<WandSparkles />
													</TooltipTrigger>
													<TooltipContent>
														Generate Employee Code
													</TooltipContent>
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
										<Select
											value={field.value}
											onValueChange={e => field.onChange(e)}
										>
											<SelectTrigger className='w-full'>
												<SelectValue
													className='w-full'
													placeholder='select position'
												/>
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

					<div className='flex justify-end gap-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => router.navigate({ to: '/dashboard/employees' })}
						>
							Cancel
						</Button>
						<Button type='submit' disabled={updateEmployeeMutation.isPending}>
							{updateEmployeeMutation.isPending ? 'Saving...' : 'Save Changes'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}
