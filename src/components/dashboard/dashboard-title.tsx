import { AnimatedText } from '@/components/ui/animated-text'
import { cn } from '@/lib/utils'

export function DashboardTitle({ title, className }: { title: string; className?: string }) {
	return (
		<AnimatedText
			text={title}
			className={cn('text-4xl font-bold mb-6 mt-4', className)}
			animationType='words'
			staggerDelay={0.1}
			duration={0.6}
		/>
	)
}
