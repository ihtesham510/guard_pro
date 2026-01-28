import { motion } from 'framer-motion'
import { ImageOff } from 'lucide-react'
import * as React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface TrailCardProps extends React.HTMLAttributes<HTMLDivElement> {
	imageUrl?: string
	mapImageUrl: string
	title: string
	location: string
}

const TrailCard = React.forwardRef<HTMLDivElement, TrailCardProps>(
	({ className, imageUrl, title, location, onClick }, ref) => {
		return (
			<motion.div
				ref={ref}
				className={cn(
					'w-full overflow-hidden rounded-2xl bg-card text-card-foreground shadow-lg cursor-pointer',
					className,
				)}
				whileHover={{ y: -5, scale: 1.02 }}
				transition={{ type: 'spring', stiffness: 300, damping: 20 }}
				onClick={onClick}
			>
				<div className='relative h-60 w-full'>
					<Avatar className='h-full w-full rounded-xs object-cover'>
						<AvatarImage src={imageUrl} alt={title} />
						<AvatarFallback className='relative rounded-xs'>
							{imageUrl ? (
								<Skeleton className='absolute inset-0 rounded-xs' />
							) : (
								<ImageOff className='size-8' />
							)}
						</AvatarFallback>
					</Avatar>

					<div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent z-0' />

					{/* RIGHT-SIDE BLUR overlay (only this side will blur the image behind it) */}
					<div
						aria-hidden
						className='absolute  bottom-0  w-24 z-10 pointer-events-none
                 backdrop-blur-md bg-white/6'
						style={{
							// smooth fade to the left; use mask (webkit) for better support
							WebkitMaskImage:
								'linear-gradient(to left, black 0%, transparent 100%)',
							maskImage: 'linear-gradient(to left, black 0%, transparent 100%)',
						}}
					/>

					{/* content above blur */}
					<div className='absolute bottom-0 left-0 flex w-full items-end justify-between p-4 z-20'>
						<div className='text-white'>
							<h3 className='text-xl font-bold'>{title}</h3>
							<p className='text-sm text-white/90'>{location}</p>
						</div>
					</div>
				</div>
			</motion.div>
		)
	},
)

TrailCard.displayName = 'TrailCard'

export { TrailCard }
