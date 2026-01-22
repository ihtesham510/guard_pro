import * as React from 'react'
import { Clock } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type TimeValue = {
	hour: string
	minute: string
	period: 'AM' | 'PM'
}

type TimePickerProps = {
	time?: TimeValue | string | null
	onTimeChange?: (time: TimeValue | null) => void
	className?: string
	disabled?: boolean
	placeholder?: string
}

// Helper function to parse time string (HH:MM or HH:MM AM/PM)
function parseTimeString(timeStr: string): TimeValue | null {
	if (!timeStr) return null

	// Handle formats like "09:30", "9:30 AM", "21:30", etc.
	const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i
	const match = timeStr.match(timeRegex)

	if (!match || !match[1] || !match[2]) return null

	let hour = parseInt(match[1], 10)
	const minute: string = match[2]
	const period = match[3]?.toUpperCase() as 'AM' | 'PM' | undefined

	// Convert 24-hour to 12-hour format if needed
	if (!period) {
		if (hour === 0) {
			hour = 12
			return { hour: hour.toString().padStart(2, '0'), minute, period: 'AM' }
		} else if (hour === 12) {
			return { hour: '12', minute, period: 'PM' }
		} else if (hour > 12) {
			hour -= 12
			return { hour: hour.toString().padStart(2, '0'), minute, period: 'PM' }
		} else {
			return { hour: hour.toString().padStart(2, '0'), minute, period: 'AM' }
		}
	}

	return {
		hour: hour.toString().padStart(2, '0'),
		minute,
		period: period || 'AM',
	}
}

// Helper function to format time value to string
function formatTimeValue(time: TimeValue | null): string {
	if (!time) return ''
	const hour = parseInt(time.hour, 10)
	return `${hour}:${time.minute} ${time.period}`
}

// Generate hours (1-12)
const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'))

// Generate minutes (00-59)
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

export function TimePicker({ time, onTimeChange, className, disabled, placeholder = 'Select time' }: TimePickerProps) {
	const [open, setOpen] = React.useState(false)
	const [inputValue, setInputValue] = React.useState('')

	// Initialize time value
	const timeValue: TimeValue | null = React.useMemo(() => {
		if (!time) return null
		if (typeof time === 'string') {
			return parseTimeString(time)
		}
		return time
	}, [time])

	// Update input value when time changes
	React.useEffect(() => {
		if (timeValue) {
			setInputValue(formatTimeValue(timeValue))
		} else {
			setInputValue('')
		}
	}, [timeValue])

	// Handle manual input change
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setInputValue(value)

		// Try to parse the input
		const parsed = parseTimeString(value)
		if (parsed && onTimeChange) {
			onTimeChange(parsed)
		} else if (!value && onTimeChange) {
			onTimeChange(null)
		}
	}

	// Handle input blur - validate and format
	const handleInputBlur = () => {
		if (inputValue) {
			const parsed = parseTimeString(inputValue)
			if (parsed) {
				setInputValue(formatTimeValue(parsed))
				if (onTimeChange) {
					onTimeChange(parsed)
				}
			} else {
				// Reset to current time value if invalid
				if (timeValue) {
					setInputValue(formatTimeValue(timeValue))
				} else {
					setInputValue('')
				}
			}
		}
	}

	// Handle dropdown changes
	const handleHourChange = (hour: string) => {
		if (timeValue && onTimeChange) {
			onTimeChange({ ...timeValue, hour })
		} else if (onTimeChange) {
			onTimeChange({ hour, minute: '00', period: 'AM' })
		}
	}

	const handleMinuteChange = (minute: string) => {
		if (timeValue && onTimeChange) {
			onTimeChange({ ...timeValue, minute })
		} else if (onTimeChange) {
			onTimeChange({ hour: '01', minute, period: 'AM' })
		}
	}

	const handlePeriodChange = (period: 'AM' | 'PM') => {
		if (timeValue && onTimeChange) {
			onTimeChange({ ...timeValue, period })
		} else if (onTimeChange) {
			onTimeChange({ hour: '01', minute: '00', period })
		}
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					className={cn('w-full justify-start text-left font-normal', !timeValue && 'text-muted-foreground', className)}
					disabled={disabled}
				>
					<Clock className='mr-2 h-4 w-4' />
					{timeValue ? formatTimeValue(timeValue) : <span>{placeholder}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-4' align='start'>
				<div className='space-y-4'>
					{/* Manual Input */}
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Enter time manually</label>
						<Input
							type='text'
							placeholder='HH:MM AM/PM'
							value={inputValue}
							onChange={handleInputChange}
							onBlur={handleInputBlur}
							className='w-full'
						/>
						<p className='text-xs text-muted-foreground'>Format: HH:MM AM/PM (e.g., 09:30 AM)</p>
					</div>

					<div className='flex items-center gap-2'>
						{/* Hour Select */}
						<div className='space-y-2'>
							<label className='text-xs text-muted-foreground'>Hour</label>
							<Select value={timeValue?.hour || '01'} onValueChange={handleHourChange}>
								<SelectTrigger className='w-[80px]'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent className='max-h-[200px]'>
									{hours.map(hour => (
										<SelectItem key={hour} value={hour}>
											{parseInt(hour, 10)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Minute Select */}
						<div className='space-y-2'>
							<label className='text-xs text-muted-foreground'>Minute</label>
							<Select value={timeValue?.minute || '00'} onValueChange={handleMinuteChange}>
								<SelectTrigger className='w-[80px]'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent className='max-h-[200px]'>
									{minutes.map(minute => (
										<SelectItem key={minute} value={minute}>
											{minute}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* AM/PM Select */}
						<div className='space-y-2'>
							<label className='text-xs text-muted-foreground'>Period</label>
							<Select value={timeValue?.period || 'AM'} onValueChange={handlePeriodChange}>
								<SelectTrigger className='w-[80px]'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='AM'>AM</SelectItem>
									<SelectItem value='PM'>PM</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}

