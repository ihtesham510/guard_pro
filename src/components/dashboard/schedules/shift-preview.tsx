import { Clock, DollarSign, FileText, ImageOff } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Skeleton } from '@/components/ui/skeleton'
import type { QueryData } from '@/lib/types'
import type { shiftQueries } from '@/services/queries'

export function ShiftPreview({
	shift,
	children,
	disabled,
}: {
	shift: QueryData<typeof shiftQueries.getShifts>
	disabled?: boolean
} & PropsWithChildren) {
	const assignedEmployees = shift.shift_assignment.map(
		assignment => assignment.employee,
	)
	const imageUrl = shift.site.pictures[0]?.url
	if (disabled) return children

	return (
		<HoverCard key={shift.id}>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className='w-80 p-0'>
				<Avatar className='h-48 w-full rounded-xs object-cover'>
					<AvatarImage src={imageUrl} alt='site image' />
					<AvatarFallback className='relative rounded-xs'>
						{imageUrl ? (
							<Skeleton className='absolute inset-0 rounded-xs' />
						) : (
							<ImageOff className='size-8' />
						)}
					</AvatarFallback>
				</Avatar>
				<div className='p-4 space-y-4'>
					{assignedEmployees.length > 0 && (
						<div className='flex items-center -space-x-4'>
							{assignedEmployees.map(employee => (
								<Avatar key={employee.id}>
									<AvatarFallback>
										{' '}
										{`${employee.firstName[0]}${employee.lastName[0]}`}
									</AvatarFallback>
								</Avatar>
							))}
						</div>
					)}

					{/* Time and Pay Rate Row */}
					<div className='flex items-center justify-between'>
						<div className='space-y-1'>
							<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
								<Clock className='size-3.5 shrink-0' />
								<span>Time</span>
							</div>
							<p className='font-semibold text-sm'>
								{shift.start_time} - {shift.end_time}
							</p>
						</div>
						<div className='space-y-1 flex flex-col justify-end items-end'>
							<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
								<DollarSign className='size-3.5 shrink-0' />
								<span>Pay Rate</span>
							</div>
							<p className='font-semibold text-sm'>{shift.pay_rate}/hr</p>
						</div>
					</div>

					{/* Notes Section */}
					<div className='pt-2 border-t border-border'>
						<div className='flex items-start gap-2'>
							<FileText className='size-3.5 text-muted-foreground shrink-0 mt-0.5' />
							<div className='flex-1 min-w-0'>
								<p className='text-xs text-muted-foreground mb-1'>Notes</p>
								{shift.notes ? (
									<p className='text-sm text-foreground line-clamp-3'>
										{shift.notes}
									</p>
								) : (
									<p className='text-sm text-muted-foreground italic'>
										No notes
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	)
}
