import { useAppState } from '@/context/app-context'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { DollarSign, PenIcon } from 'lucide-react'
import Stepper, { Step } from '../Stepper'
import { FieldSet, FieldLegend, FieldDescription, Field, FieldGroup, FieldLabel } from '../ui/field'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form'
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogForm,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
} from '../ui/responsive-dialog'
import { useForm } from 'react-hook-form'
import { useIsMobile } from '@/hooks/use-mobile'
import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { siteQueries } from '@/services/queries'
import { shiftInsertSchema } from '@/services/shift.schema'
import { addShift } from '@/services/shift.api'
import z from 'zod'
import { Checkbox } from '../ui/checkbox'
import { Calendar } from '../ui/calendar'
import { TimePicker, type TimeValue } from '../ui/time-picker'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { Input } from '../ui/input'
import { enums } from '@/db/schema'
import { Toggle } from '../ui/toggle'
import { Textarea } from '../ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'

const schema = shiftInsertSchema

export function ShiftDialog({
	open,
	onOpenChange,
}: {
	open?: boolean
	onOpenChange?: (e: boolean) => void
	defaultValues?: z.infer<typeof schema>
}) {
	const { dialogs } = useAppState()
	const { data: sites } = useQuery(siteQueries.getSites())
	const isMobile = useIsMobile()
	const [currentStep, setCurrentStep] = useState(1)

	const addShiftMutation = useMutation({
		mutationFn: addShift,
		meta: {
			invalidateQuries: ['getShifts', 'getSiteShifts', 'getEmployeesWithShifts'],
			successMessage: 'Shift added successfully',
			errorMessage: 'Error while adding shift',
		},
	})

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			start_time: '09:00 AM',
			end_time: '05:00 PM',
			type: 'recurring',
			off_days: ['sunday'],
			every_day: false,
			start_date: new Date(),
		},
	})

	const handleSubmit = async (values: z.infer<typeof schema>) => {
		await addShiftMutation.mutateAsync({
			data: {
				...values,
				end_date: values.type === 'one_time' ? values.end_date : undefined,
				pay_rate: String(values.pay_rate),
				overTime_multiplyer: values.overTime_multiplyer ? String(values.overTime_multiplyer) : undefined,
			},
		})
		form.reset()
		dialogs.close('add-shift')
	}

	useEffect(() => {
		if (!dialogs.state['add-shift']) {
			form.reset()
			setCurrentStep(1)
		}
	}, [dialogs.state['add-shift'], form])

	function renderWeek(str: string) {
		return str.slice(0, 3).charAt(0).toUpperCase() + str.slice(1, 3).toLowerCase()
	}

	return (
		<ResponsiveDialog
			open={typeof open !== 'undefined' ? open : dialogs.state['add-shift']}
			onOpenChange={e => (onOpenChange ? onOpenChange(e) : dialogs.setState('add-shift', e))}
		>
			<ResponsiveDialogContent className='min-w-full md:min-w-[560px] max-w-max'>
				<ResponsiveDialogForm form={form} onSubmit={form.handleSubmit(handleSubmit)} className='min-w-max'>
					<ResponsiveDialogHeader>
						<ResponsiveDialogTitle>Add Shift</ResponsiveDialogTitle>
					</ResponsiveDialogHeader>
					<Stepper
						hideSteps={isMobile}
						step={currentStep}
						onStepChange={setCurrentStep}
						className='w-full'
						submitting={form.formState.isSubmitting}
					>
						<Step>
							<FieldSet>
								<FieldLegend>Select Site and Employee</FieldLegend>
								<FieldDescription>Select site and employee to assign the shift.</FieldDescription>
								<FieldGroup>
									<FormField
										control={form.control}
										name='name'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Shift Name (optional)</FormLabel>
												<FormControl>
													<Input {...field} placeholder='name' value={field.value ?? undefined} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='site_id'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Select Site</FormLabel>
												<FormControl>
													<Select value={field.value} onValueChange={val => field.onChange(val)}>
														<SelectTrigger className='w-full'>
															<SelectValue placeholder='site' />
														</SelectTrigger>
														<SelectContent>
															{sites &&
																sites.map(site => (
																	<SelectItem key={site.id} value={site.id}>
																		{site.name}
																	</SelectItem>
																))}
														</SelectContent>
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</FieldGroup>
							</FieldSet>
						</Step>
						<Step>
							<FieldSet>
								<FieldLegend>Select Date Range</FieldLegend>
								<FieldDescription>Select date range for the shift.</FieldDescription>
								<FieldGroup className='flex items-center justify-center min-w-max'>
									<FormField
										control={form.control}
										name='type'
										render={({ field }) => {
											return (
												<FormItem className='w-full'>
													<FormLabel>Shift type</FormLabel>
													<FormControl>
														<Select onValueChange={e => field.onChange(e)} {...field}>
															<SelectTrigger className='w-full'>
																<SelectValue placeholder='select' />
															</SelectTrigger>
															<SelectContent>
																{enums.shiftType.map(type => (
																	<SelectItem key={type} value={type}>
																		{type === 'one_time' ? 'One Time' : 'Recurring'}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													</FormControl>
													<FormMessage />
												</FormItem>
											)
										}}
									/>
									<FormField
										control={form.control}
										name='every_day'
										render={({ field }) => {
											return (
												<FormItem className='w-full'>
													<FormControl>
														<Field orientation='horizontal'>
															<Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
															<FieldLabel>every day</FieldLabel>
														</Field>
													</FormControl>
													<FormMessage />
												</FormItem>
											)
										}}
									/>
									{!form.watch('every_day') && (
										<Field className='w-full'>
											<FieldLabel>Working Days</FieldLabel>
											<div className='flex items-center font-black text-sm gap-3'>
												{enums.shiftDaysEnum.map(day => (
													<Toggle
														key={day}
														variant='outline'
														pressed={!form.watch('off_days')?.includes(day)}
														onPressedChange={e => {
															const currentOffDays = form.getValues('off_days') || []
															if (e) {
																form.setValue(
																	'off_days',
																	currentOffDays.filter(q => q !== day),
																)
															} else {
																form.setValue('off_days', [...currentOffDays, day])
															}
														}}
													>
														{renderWeek(day)}
													</Toggle>
												))}
											</div>

											<FormMessage />
										</Field>
									)}

									{form.watch('type') === 'recurring' && (
										<FormField
											control={form.control}
											name='start_date'
											render={({ field }) => (
												<FormItem className='w-full'>
													<FormLabel>Start Date</FormLabel>
													<FormControl>
														<Popover>
															<PopoverTrigger asChild>
																<Button variant='outline' className='w-full justify-between font-normal'>
																	{field.value.toLocaleDateString()}
																</Button>
															</PopoverTrigger>
															<PopoverContent>
																<Calendar
																	mode='single'
																	selected={field.value}
																	onSelect={date => {
																		if (date) {
																			field.onChange(date)
																		}
																	}}
																	numberOfMonths={1}
																/>
															</PopoverContent>
														</Popover>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									)}
									{form.watch('type') === 'one_time' && (
										<FieldGroup className='flex flex-row items-center justify-between gap-2'>
											<Field>
												<FieldLabel>Start Date</FieldLabel>
												<Popover>
													<PopoverTrigger asChild>
														<Button variant='outline' className='w-full '>
															{form.watch('start_date')?.toDateString()}
														</Button>
													</PopoverTrigger>
													<PopoverContent>
														<Calendar mode='single' onSelect={val => val && form.setValue('start_date', val)} />
													</PopoverContent>
												</Popover>
											</Field>
											<Field>
												<FieldLabel>End Date (Optional)</FieldLabel>
												<Popover>
													<PopoverTrigger asChild>
														<Button variant='outline' className='w-full'>
															{form.watch('end_date')?.toDateString()}
														</Button>
													</PopoverTrigger>
													<PopoverContent>
														<Calendar mode='single' onSelect={val => form.setValue('end_date', val)} />
													</PopoverContent>
												</Popover>
											</Field>
											<Popover>
												<PopoverTrigger asChild>
													<Button variant='outline' size='icon-lg' className='place-self-end'>
														<PenIcon className='size-4' />
													</Button>
												</PopoverTrigger>
												<PopoverContent className='w-full'>
													<Calendar
														mode='range'
														selected={{ from: form.watch('start_date'), to: form.watch('end_date') ?? undefined }}
														onSelect={val => {
															if (val && val.from && val.to) {
																form.setValue('start_date', val.from)
																form.setValue('end_date', val.to)
															}
														}}
														numberOfMonths={2}
													/>
												</PopoverContent>
											</Popover>
										</FieldGroup>
									)}
								</FieldGroup>
							</FieldSet>
						</Step>
						<Step>
							<FieldSet>
								<FieldLegend>Select Time Range</FieldLegend>
								<FieldDescription>Select shift time range</FieldDescription>
								<FieldGroup>
									<FormField
										control={form.control}
										name='start_time'
										render={({ field }) => {
											const parseTimeValue = (timeStr: string | undefined): TimeValue | null => {
												if (!timeStr) return null
												const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
												if (!match || !match[1] || !match[2] || !match[3]) return null
												return {
													hour: parseInt(match[1], 10).toString().padStart(2, '0'),
													minute: match[2],
													period: match[3].toUpperCase() as 'AM' | 'PM',
												}
											}

											const formatTimeString = (time: TimeValue | null): string => {
												if (!time) return ''
												return `${time.hour}:${time.minute} ${time.period}`
											}

											return (
												<FormItem>
													<FormLabel>Start Time</FormLabel>
													<FormControl>
														<TimePicker
															time={parseTimeValue(field.value)}
															onTimeChange={time => {
																field.onChange(formatTimeString(time))
															}}
															placeholder='Select start time'
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)
										}}
									/>
									<FormField
										control={form.control}
										name='end_time'
										render={({ field }) => {
											const parseTimeValue = (timeStr: string | undefined): TimeValue | null => {
												if (!timeStr) return null
												const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
												if (!match || !match[1] || !match[2] || !match[3]) return null
												return {
													hour: parseInt(match[1], 10).toString().padStart(2, '0'),
													minute: match[2],
													period: match[3].toUpperCase() as 'AM' | 'PM',
												}
											}

											const formatTimeString = (time: TimeValue | null): string => {
												if (!time) return ''
												return `${time.hour}:${time.minute} ${time.period}`
											}

											return (
												<FormItem>
													<FormLabel>End Time</FormLabel>
													<FormControl>
														<TimePicker
															time={parseTimeValue(field.value)}
															onTimeChange={time => {
																field.onChange(formatTimeString(time))
															}}
															placeholder='Select end time'
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)
										}}
									/>
								</FieldGroup>
							</FieldSet>
						</Step>
						<Step>
							<FieldSet>
								<FieldLegend>Select Pay rates</FieldLegend>
								<FieldDescription>select pay-rates and other things for shift.</FieldDescription>
								<FieldGroup>
									<FormField
										control={form.control}
										name='pay_rate'
										render={({ field }) => (
											<FormItem>
												<Field>
													<FormLabel>Pay Rate</FormLabel>
													<FormControl>
														<InputGroup>
															<InputGroupAddon align='inline-start'>
																<DollarSign className='size-4' />
															</InputGroupAddon>
															<InputGroupInput
																placeholder='Pay rate'
																type='number'
																step='0.01'
																{...field}
																value={field.value ?? ''}
																onChange={e => {
																	const value = e.target.value
																	field.onChange(value === '' ? '' : value)
																}}
															/>
															<InputGroupAddon align='inline-end'>/ hr</InputGroupAddon>
														</InputGroup>
													</FormControl>
												</Field>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='overTime_multiplyer'
										render={({ field }) => (
											<FormItem>
												<Field>
													<FormLabel>Overtime Multiplier (optional)</FormLabel>
													<FormControl>
														<InputGroup>
															<InputGroupInput
																placeholder='Overtime multiplier'
																type='number'
																step='0.1'
																{...field}
																value={field.value ?? ''}
																onChange={e => {
																	const value = e.target.value
																	field.onChange(value === '' ? null : value)
																}}
															/>
															<InputGroupAddon align='inline-end'>x</InputGroupAddon>
														</InputGroup>
													</FormControl>
												</Field>
												<FormMessage />
											</FormItem>
										)}
									/>
								</FieldGroup>
							</FieldSet>
						</Step>
						<Step>
							<FieldSet>
								<FieldLegend>Notes</FieldLegend>
								<FieldDescription>Provide notes for employees to follow</FieldDescription>
								<FieldGroup>
									<FormField
										control={form.control}
										name='notes'
										render={({ field }) => (
											<FormItem>
												<Field>
													<FormLabel>Notes (optional)</FormLabel>
													<FormControl>
														<Textarea
															className='min-h-[20vh]'
															placeholder='Add any notes or instructions for employees...'
															{...field}
															value={field.value ?? ''}
														/>
													</FormControl>
												</Field>
												<FormMessage />
											</FormItem>
										)}
									/>
								</FieldGroup>
							</FieldSet>
						</Step>
					</Stepper>
				</ResponsiveDialogForm>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	)
}
