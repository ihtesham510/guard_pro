import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import {
	differenceInMinutes,
	eachDayOfInterval,
	format,
	getDay,
	intervalToDuration,
	isAfter,
	isBefore,
	isSameDay,
	isWithinInterval,
	parse,
} from 'date-fns'
import { cn } from '@/lib/utils'
import { startOfWeek, endOfWeek } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { shiftQueries, employeeQuries } from '@/services/queries'
import { Day, shiftDays } from '@/constants'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { QueryData } from '@/lib/types'
import { Calendar, CalendarHeader, CalendarControlls, useCalendarContext } from '@/components/ui/event-calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComp } from '@/components/ui/calendar'

export const Route = createFileRoute('/dashboard/attendance')({
	component: RouteComponent,
	loader: async ({ context: { queryClient } }) => {
		await Promise.all([
			queryClient.ensureQueryData(employeeQuries.getEmployeeieWithAttendence()),
			queryClient.ensureQueryData(shiftQueries.getShifts({})),
		])
	},
})

function AttendanceTable() {
	const { date, setDate } = useCalendarContext()
	const { data: employees } = useQuery(employeeQuries.getEmployeeieWithAttendence())

	const weekStart = useMemo(() => startOfWeek(date), [date])
	const weekEnd = useMemo(() => endOfWeek(date), [date])

	const weekDays = useMemo(() => {
		return eachDayOfInterval({ start: weekStart, end: weekEnd })
	}, [weekStart, weekEnd])

	const isToday = (date: Date) => isSameDay(date, new Date())

	return (
		<div className='w-full overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0'>
			<div className='min-w-[1000px] w-full lg:min-w-0 lg:w-full border-border border rounded-lg'>
				<div className='sticky top-0 z-10 border-b bg-background'>
					<div className='grid grid-cols-[200px_1fr] min-w-[1000px] w-full lg:min-w-0 lg:w-full'>
						{/* Employee Column Header */}
						<div className='p-4 md:p-5 lg:p-3 xl:p-4 border-r bg-muted/50'>
							<h3 className='text-sm font-medium text-muted-foreground'>Employee</h3>
						</div>

						{/* Days Header */}
						<div className='grid grid-cols-7'>
							{weekDays.map(day => (
								<div
									key={day.toISOString()}
									className={cn(
										'p-4 md:p-5 lg:p-3 xl:p-4 cursor-pointer text-center border-r last:border-r-0 hover:bg-primary/5',
										isSameDay(date, day) && 'bg-primary/5 border-primary border-l border-r border-t rounded-t-sm',
									)}
									onClick={() => setDate(day)}
								>
									<p className='text-xs md:text-sm text-muted-foreground uppercase'>{format(day, 'EEE')}</p>
									<p
										className={cn(
											'text-xl md:text-2xl lg:text-lg xl:text-xl font-semibold mt-1',
											isToday(day) &&
												'inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 lg:w-8 lg:h-8 xl:w-9 xl:h-9 rounded-full bg-primary text-primary-foreground',
										)}
									>
										{format(day, 'd')}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className='divide-y'>
					{employees?.map(employee => {
						return (
							<div key={employee.id} className='grid grid-cols-[200px_1fr] min-w-[1000px] w-full lg:min-w-0 lg:w-full'>
								{/* Employee Info Column */}
								<div className='p-3 md:p-4 lg:p-3 xl:p-4 border-r flex items-center gap-3 bg-muted/30'>
									<Avatar className='size-10 md:size-12 lg:size-10 xl:size-11 shrink-0'>
										<AvatarFallback className='bg-primary/10 text-primary text-sm font-medium'>
											{`${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className='flex-1 min-w-0'>
										<p className='font-semibold text-sm md:text-base lg:text-sm xl:text-base truncate'>
											{employee.firstName} {employee.lastName}
										</p>
										<p className='text-xs md:text-sm text-muted-foreground truncate'>{employee.employeeCode}</p>
									</div>
								</div>

								{/* Attendance Cells */}
								<div className='grid grid-cols-7'>
									{weekDays.map(day => {
										const attendance = getTodaysAttendance(employee, day)
										return (
											<div
												key={day.toISOString()}
												className={cn(
													'min-h-[100px] md:min-h-[120px] lg:min-h-[80px] xl:min-h-[100px] p-2 border-r last:border-r-0 flex items-center justify-center',
													isSameDay(date, day) && 'border-primary border-l border-r bg-primary/5',
												)}
											>
												{attendance?.status ?? '-'}
											</div>
										)
									})}
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

function AttendanceHeader() {
	const { date, setDate } = useCalendarContext()

	return (
		<div className='flex md:justify-between flex-col md:flex-row md:items-center space-y-4'>
			<span className='flex items-center gap-4 w-full md:w-auto'>
				<Popover>
					<PopoverTrigger asChild>
						<div className='flex flex-col justify-center items-center min-w-[4rem] border-border border rounded-lg cursor-pointer'>
							<span className='w-full py-1.5 rounded-tl-lg rounded-tr-lg font-bold text-md text-center bg-primary/80'>
								{format(date, 'MMM')}
							</span>
							<span className='w-full py-1.5 rounded-bl-lg rounded-br-lg font-medium text-sm text-center'>
								{format(date, 'dd')}
							</span>
						</div>
					</PopoverTrigger>
					<PopoverContent className='p-0 flex items-center justify-center'>
						<CalendarComp mode='single' selected={date} onSelect={val => val && setDate(val)} />
					</PopoverContent>
				</Popover>
				<span>
					<h2 className='text-2xl font-bold'>Attendance</h2>
					<p className='text-sm font-medium text-muted-foreground'>
						{`${format(startOfWeek(date), 'MMM dd')} - ${format(endOfWeek(date), 'MMM dd, yyy')}`}
					</p>
				</span>
			</span>
			<CalendarControlls />
		</div>
	)
}

export function RouteComponent() {
	return (
		<div className='flex flex-col mb-36'>
			<Calendar defaultView='weekly' mode='weekly'>
				<CalendarHeader>
					<AttendanceHeader />
				</CalendarHeader>
				<AttendanceTable />
			</Calendar>
		</div>
	)
}

function getEmployeeShift(employee: QueryData<typeof employeeQuries.getEmployeeieWithAttendence>, day: Date) {
	return employee.shift_assignment
		.map(assignedShifts => assignedShifts.shift)
		?.find(shift => {
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

function getTodaysAttendance(employee: QueryData<typeof employeeQuries.getEmployeeieWithAttendence>, day: Date) {
	const shift = getEmployeeShift(employee, day)

	let status: 'absent' | 'early' | 'late' | 'upcoming' | 'on-time' = 'absent'
	let earlyMin: number | null = null
	let lateMin: number | null = null
	let hasClockedOut: boolean = false
	let hoursWorked: { hours: number; minutes: number } | null = null

	if (!shift) {
		return null
	}
	if (isAfter(day, new Date())) {
		status = 'upcoming'
		return { status }
	}

	const startTime = parse(shift.start_time, 'h:mm a', day)

	const timeEntry = employee.timeEntry.find(entry => isSameDay(entry.start_time, day))

	if (!timeEntry) {
		status = 'absent'
	} else {
		const difference = differenceInMinutes(startTime, timeEntry.start_time)

		if (difference >= 10) {
			status = 'early'
			earlyMin = difference
		} else if (difference < 0) {
			status = 'late'
			lateMin = Math.abs(difference)
		} else {
			status = 'on-time'
		}

		if (timeEntry.end_time) {
			hasClockedOut = true
			const duration = intervalToDuration({
				start: timeEntry.start_time,
				end: timeEntry.end_time,
			})
			if (duration.hours !== undefined && duration.minutes !== undefined) {
				hoursWorked = {
					hours: duration.hours,
					minutes: duration.minutes,
				}
			}
		}
	}

	return {
		status,
		earlyMin,
		lateMin,
		hasClockedOut,
		hoursWorked,
	}
}
