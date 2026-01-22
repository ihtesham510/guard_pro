import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { shiftQueries } from '@/services/queries'
import { getDay, isBefore, isSameDay, isWithinInterval } from 'date-fns'
import { formatTime } from '@/lib/utils'
import { Clock, ClockPlusIcon } from 'lucide-react'
import { Day, shiftDays } from '@/constants'
import { ShiftPreview } from '@/components/dashboard/schedules/shift-preview'
import {
	Calendar,
	CalendarHeader,
	CalendarTitle,
	CalendarControlls,
	CalendarModel,
} from '@/components/ui/event-calendar'
import { cn } from '@/lib/utils'
import { QueryData } from '@/lib/types'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { useAppState } from '@/context/app-context'

export const Route = createFileRoute('/dashboard/schedules')({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(shiftQueries.getShifts({}))
	},
})

type Shift = QueryData<typeof shiftQueries.getShifts>

export function RouteComponent() {
	const { data: shifts } = useQuery(shiftQueries.getShifts({}))
	const { dialogs } = useAppState()

	const getCurrentShifts = (day: Date): Shift[] => {
		if (!shifts) return []
		return shifts.filter(shift => {
			if (isBefore(day, shift.start_date) && !isSameDay(day, shift.start_date)) {
				return false
			}
			const isExcludedDay = shift.shiftExcludeDay.some(excludeDay => {
				if (excludeDay.to) {
					return isWithinInterval(day, {
						start: excludeDay.from,
						end: excludeDay.to,
					})
				} else {
					return isSameDay(day, excludeDay.from)
				}
			})
			if (isExcludedDay) return false
			const isOffDay = shift.off_days.includes(shiftDays[getDay(day)] as Day)
			if (isOffDay) return false
			if (shift.type === 'one_time' && shift.end_date) {
				return isWithinInterval(day, {
					start: shift.start_date,
					end: shift.end_date,
				})
			}
			return true
		})
	}

	if (shifts?.length === 0)
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia>
						<Clock />
					</EmptyMedia>
					<EmptyTitle>No Schdules yet</EmptyTitle>
					<EmptyDescription>No Schedules are created yet.</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button className='flex gap-2' onClick={() => dialogs.open('add-shift')}>
						<ClockPlusIcon className='size-3' /> Add Shift
					</Button>
				</EmptyContent>
			</Empty>
		)

	return (
		<div className='flex flex-col mb-36'>
			<Calendar defaultView='monthly' mode='weekly'>
				<CalendarHeader>
					<CalendarTitle />
					<CalendarControlls />
				</CalendarHeader>
				<CalendarModel
					events={shifts}
					getEventsForDay={getCurrentShifts}
					renderWeeklyEventRow={(shift, weekDays, selectedDate) => {
						return (
							<div key={shift.id} className='grid grid-cols-7 min-w-[1000px] w-full lg:min-w-0 lg:w-full'>
								{weekDays.map(day => {
									const renderDay = () => {
										const excludedDay = shift.shiftExcludeDay.find(excludeDay => {
											if (excludeDay.to) {
												return isWithinInterval(day, {
													start: excludeDay.from,
													end: excludeDay.to,
												})
											} else {
												return isSameDay(day, excludeDay.from)
											}
										})
										if (excludedDay) {
											return (
												<div className='bg-muted/30 h-full text-green bg-[repeating-linear-gradient(145deg,transparent,transparent_10px,var(--border),var(--border)_12px)] flex items-center justify-center text-muted-foreground/60'>
													Excluded
												</div>
											)
										}
										const todaysDay = getDay(day)
										const isOffDay = shift.off_days.includes(shiftDays[todaysDay] as Day)
										const checkShiftValidation = () => {
											if (shift.type === 'one_time' && shift.end_date) {
												return isWithinInterval(day, {
													start: shift.start_date,
													end: shift.end_date,
												})
											}
											return true
										}
										const isValid = checkShiftValidation()
										if (!isValid) {
											return <div className='flex justify-center items-center h-full font-normal'>-</div>
										}
										if (isValid && isOffDay) {
											return (
												<div className='bg-muted/30 h-full text-green bg-[repeating-linear-gradient(145deg,transparent,transparent_10px,var(--border),var(--border)_12px)] flex items-center justify-center text-muted-foreground/60'>
													Off Day
												</div>
											)
										}
										return (
											<ShiftPreview shift={shift}>
												<div className='w-full min-h-max space-y-2 rounded-md p-3 md:p-4 lg:p-2.5 xl:p-3 text-sm md:text-base lg:text-sm xl:text-base group'>
													<div className='flex items-center gap-2'>
														<Clock className='size-4 md:size-5 lg:size-4 xl:size-4 text-primary shrink-0' />
														<span className='font-semibold'>
															{formatTime(shift.start_time)} - {formatTime(shift.end_time)}
														</span>
													</div>
												</div>
											</ShiftPreview>
										)
									}
									return (
										<div
											key={day.toISOString()}
											className={cn(
												'min-h-[140px] md:min-h-[160px] lg:min-h-[120px] xl:min-h-[140px] p-0 border-r last:border-r-0',
												isSameDay(selectedDate, day) && 'border-primary border-l border-r bg-primary/5',
											)}
										>
											{renderDay()}
										</div>
									)
								})}
							</div>
						)
					}}
					renderMonthlyEvent={(shift, _day, isCurrentMonth) => {
						return (
							<ShiftPreview shift={shift} disabled={!isCurrentMonth}>
								<div
									className={cn(
										'text-xs flex gap-2 items-center rounded-md px-2 py-1 cursor-pointer font-normal text-primary-foreground',
										isCurrentMonth
											? shift.type === 'recurring'
												? 'bg-(--color-chart-4)'
												: 'bg-(--color-chart-5)'
											: 'bg-muted text-muted-foreground',
									)}
								>
									<Clock className='size-3 hidden lg:inline-block' />
									<p className='space-x-1 hidden md:flex items-center'>
										<p>{formatTime(shift.start_time)}</p> <p>-</p> <p>{formatTime(shift.end_time)}</p>
									</p>
								</div>
							</ShiftPreview>
						)
					}}
				/>
			</Calendar>
		</div>
	)
}
