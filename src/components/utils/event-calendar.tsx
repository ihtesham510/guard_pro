import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { endOfMonth, format, startOfMonth, isSameDay } from 'date-fns'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import React, { useEffect, useState } from 'react'
import { ButtonGroup } from '@/components/ui/button-group'
import { useScrollIntoView } from '@mantine/hooks'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type CalendarCell = { date: Date; isCurrentMonth: boolean }

type EventsCalendarProps<T> = {
	selectedDate?: Date
	onDateChange?: (date: Date) => void
	events?: T[]
	eventAccessKey?: keyof T
	eventBadge?: (data: T) => React.ReactNode
	eventHover?: (data: T) => React.ReactNode
}

export function EventsCalendar<T>({
	selectedDate,
	onDateChange,
	events,
	eventAccessKey,
	eventBadge,
	eventHover,
}: EventsCalendarProps<T>) {
	const [currentDate, setDate] = useState(new Date(Date.now()))

	useEffect(() => {
		if (selectedDate) {
			setDate(selectedDate)
		}
	}, [selectedDate])

	useEffect(() => {
		if (onDateChange) {
			onDateChange(currentDate)
		}
	}, [currentDate])

	const { targetRef, scrollIntoView } = useScrollIntoView({
		offset: 20,
		duration: 800,
	})

	const matchDate = (date: Date, compareDate: Date = new Date()) => {
		return isSameDay(date, compareDate)
	}

	const handlePrevMonth = () => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))

	const handleNextMonth = () => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

	const goToToday = () => {
		setDate(new Date(Date.now()))
		scrollIntoView()
	}

	const weeks = generateCalendar(currentDate)

	return (
		<Card>
			<CardContent className='p-4'>
				<div className='flex justify-between items-center mb-6'>
					<span className='flex items-center gap-4'>
						<div className='flex flex-col justify-center items-center min-w-[4rem] border-border border rounded-lg'>
							<span className='w-full py-1.5 rounded-tl-lg rounded-tr-lg font-bold text-md text-center bg-primary/80'>
								{format(currentDate, 'MMM')}
							</span>
							<span className='w-full py-1.5 rounded-bl-lg rounded-br-lg font-medium text-sm text-center'>
								{format(currentDate, 'dd')}
							</span>
						</div>

						<span>
							<h2 className='text-2xl font-bold'>
								{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
							</h2>
							<p className='text-sm font-medium text-muted-foreground'>{`${format(startOfMonth(currentDate), 'MMM dd')} - ${format(endOfMonth(currentDate), 'MMM dd, yyy')}`}</p>
						</span>
					</span>

					<div className='flex items-center space-x-1'>
						<ButtonGroup>
							<Button onClick={handlePrevMonth} variant='outline' size='icon' className='h-8 w-8'>
								<ChevronLeft className='h-4 w-4' />
							</Button>
							<Button onClick={goToToday} variant='outline' size='sm' className='flex items-center gap-1'>
								<Calendar className='h-4 w-4 mr-1' />
								Today
							</Button>
							<Button onClick={handleNextMonth} variant='outline' size='icon' className='h-8 w-8'>
								<ChevronRight className='h-4 w-4' />
							</Button>
						</ButtonGroup>
					</div>
				</div>

				<div className='grid grid-cols-7 gap-1'>
					{DAYS.map(day => (
						<div key={day} className='text-center font-medium text-muted-foreground text-sm py-2'>
							{day}
						</div>
					))}

					{weeks.map((week, weekIndex) =>
						week.map((cell, dayIndex) => {
							const today = matchDate(cell.date)
							const isSelectedDate = matchDate(cell.date, currentDate)
							const currentDateEvents =
								events?.filter(event => {
									if (eventAccessKey) {
										const eventDate = event[eventAccessKey]
										if (eventDate instanceof Date) {
											return isSameDay(eventDate, cell.date)
										}
									}
									return false
								}) ?? []

							return (
								<div
									key={`${weekIndex}-${dayIndex}`}
									className={cn(
										'border rounded min-h-[8rem] flex flex-col p-1 relative transition-colors',
										cell.isCurrentMonth
											? 'bg-muted'
											: 'bg-muted/30 text-green bg-[repeating-linear-gradient(145deg,transparent,transparent_10px,var(--border),var(--border)_12px)]',
										isSelectedDate && 'ring-2 ring-primary',
										'hover:bg-primary/10',
									)}
									onClick={() => setDate(cell.date)}
								>
									<span
										className={cn(
											'text-sm font-bold h-6 w-6 flex items-center justify-center mb-2 rounded-full',
											today && 'bg-primary text-primary-foreground',
										)}
										ref={today ? targetRef : undefined}
									>
										{cell.date.getDate()}
									</span>

									<div className='grid space-y-1'>
										{currentDateEvents.length > 0 && (
											<React.Fragment>
												{currentDateEvents.map((event, eventIndex) => (
													<HoverCard key={eventIndex}>
														<HoverCardTrigger asChild>
															<div>{eventBadge && eventBadge(event)}</div>
														</HoverCardTrigger>
														{eventHover && <HoverCardContent>{eventHover(event)}</HoverCardContent>}
													</HoverCard>
												))}
											</React.Fragment>
										)}
									</div>
								</div>
							)
						}),
					)}
				</div>
			</CardContent>
		</Card>
	)
}

const generateCalendar = (currentDate: Date): CalendarCell[][] => {
	const year = currentDate.getFullYear()
	const month = currentDate.getMonth()
	const firstDayOfMonth = new Date(year, month, 1).getDay()
	const daysInMonth = new Date(year, month + 1, 0).getDate()

	const weeks: CalendarCell[][] = []
	let week: CalendarCell[] = []

	if (firstDayOfMonth > 0) {
		const prevMonth = month === 0 ? 11 : month - 1
		const prevYear = month === 0 ? year - 1 : year
		const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate()
		for (let i = 0; i < firstDayOfMonth; i++) {
			week.push({
				date: new Date(prevYear, prevMonth, daysInPrevMonth - firstDayOfMonth + 1 + i),
				isCurrentMonth: false,
			})
		}
	}

	for (let d = 1; d <= daysInMonth; d++) {
		week.push({ date: new Date(year, month, d), isCurrentMonth: true })
		if (week.length === 7) {
			weeks.push(week)
			week = []
		}
	}

	if (week.length > 0) {
		const nextMonth = month === 11 ? 0 : month + 1
		const nextYear = month === 11 ? year + 1 : year
		let d = 1
		while (week.length < 7) {
			week.push({ date: new Date(nextYear, nextMonth, d++), isCurrentMonth: false })
		}
		weeks.push(week)
	}

	return weeks
}
