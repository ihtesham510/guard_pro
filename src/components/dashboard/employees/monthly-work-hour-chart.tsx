import { useDebouncedState } from '@mantine/hooks'
import NumberFlow from '@number-flow/react'
import { useMotionValueEvent, useSpring } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import React from 'react'
import { Bar, BarChart, Cell, ReferenceLine, XAxis } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig, ChartContainer } from '@/components/ui/chart'
import { cn, getTrend } from '@/lib/utils'

const CHART_MARGIN = 35
const CHART_COLOR = 'var(--chart-5)'

const chartData = [
	{ month: 'January', hrs: 341 },
	{ month: 'February', hrs: 676 },
	{ month: 'March', hrs: 512 },
	{ month: 'April', hrs: 629 },
	{ month: 'May', hrs: 458 },
	{ month: 'June', hrs: 781 },
	{ month: 'July', hrs: 394 },
	{ month: 'August', hrs: 924 },
	{ month: 'September', hrs: 647 },
	{ month: 'October', hrs: 532 },
	{ month: 'November', hrs: 803 },
	{ month: 'December', hrs: 271 },
]

const chartConfig = {
	data: {
		label: 'hrs',
		color: 'var(--chart-2)',
	},
} satisfies ChartConfig

export function MonthlyWorkHoursChart() {
	const [activeIndex, setActiveIndex] = useDebouncedState<number>(
		chartData.length - 1,
		80,
	)

	const defaultValueIndex = React.useMemo(() => {
		if (activeIndex !== undefined) {
			return { index: activeIndex, value: chartData[activeIndex]!.hrs }
		}
		return chartData.reduce(
			(max, data, index) => {
				return data.hrs > max.value ? { index, value: data.hrs } : max
			},
			{ index: 0, value: 0 },
		)
	}, [activeIndex])

	const maxValueIndexSpring = useSpring(defaultValueIndex.value, {
		stiffness: 100,
		damping: 20,
	})

	const [springyValue, setSpringyValue] = React.useState(
		defaultValueIndex.value,
	)

	useMotionValueEvent(maxValueIndexSpring, 'change', latest => {
		setSpringyValue(Number(latest.toFixed(0)))
	})

	React.useEffect(() => {
		maxValueIndexSpring.set(defaultValueIndex.value)
	}, [defaultValueIndex.value, maxValueIndexSpring])

	const trendValue = React.useMemo(() => {
		const firstValue = activeIndex
			? activeIndex === 0
				? 0
				: activeIndex - 1
			: activeIndex
		return getTrend(
			chartData[firstValue ?? 0]!.hrs,
			chartData[activeIndex ?? 1]!.hrs,
		)
	}, [activeIndex])

	return (
		<Card className='min-w-full'>
			<CardHeader className='flex flex-col gap-2'>
				<div className='w-full flex justify-between items-center'>
					<CardTitle className='flex items-center justify-between gap-2 w-full'>
						Total Work hrs
					</CardTitle>

					<span className='flex items-center gap-2'>
						<span
							className={cn('text-lg font-sans gap-1 tracking-tighter flex')}
						>
							<NumberFlow value={defaultValueIndex.value} /> hrs
						</span>
						<Badge
							className={cn(
								trendValue.trend === 'down' && 'bg-red-500 text-white',
								trendValue.trend === 'up' && 'bg-green-500 text-white',
							)}
						>
							<TrendingUp className='h-4 w-4' />
							<span className='flex gap-0.5 items-center'>
								<NumberFlow value={trendValue.percentageChange} />%
							</span>
						</Badge>
					</span>
				</div>
				<div className='flex w-full justify-end text-xs font-semibold'>
					vs. last month
				</div>
			</CardHeader>
			<CardContent>
				<AnimatePresence mode='wait'>
					<ChartContainer config={chartConfig}>
						<BarChart
							accessibilityLayer
							data={chartData}
							onMouseLeave={() => setActiveIndex(chartData.length - 1)}
							margin={{
								left: CHART_MARGIN,
							}}
						>
							<XAxis
								dataKey='month'
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								tickFormatter={value => value.slice(0, 3)}
							/>
							<Bar dataKey='hrs' fill={CHART_COLOR} radius={4}>
								{chartData.map((_, index) => (
									<Cell
										className='duration-200'
										opacity={index === defaultValueIndex.index ? 1 : 0.2}
										key={index}
										onMouseEnter={() => setActiveIndex(index)}
									/>
								))}
							</Bar>
							<ReferenceLine
								opacity={0.4}
								y={springyValue}
								stroke={CHART_COLOR}
								strokeWidth={1}
								strokeDasharray='3 3'
								label={<CustomReferenceLabel value={defaultValueIndex.value} />}
							/>
						</BarChart>
					</ChartContainer>
				</AnimatePresence>
			</CardContent>
		</Card>
	)
}

interface CustomReferenceLabelProps {
	viewBox?: {
		x?: number
		y?: number
	}
	value: number
}

const CustomReferenceLabel: React.FC<CustomReferenceLabelProps> = props => {
	const { viewBox, value } = props
	const x = viewBox?.x ?? 0
	const y = viewBox?.y ?? 0

	const width = React.useMemo(() => {
		const characterWidth = 8
		const padding = 10
		return value.toString().length * characterWidth + padding
	}, [])

	return (
		<>
			<rect
				x={x - CHART_MARGIN}
				y={y - 9}
				width={width}
				height={18}
				fill={CHART_COLOR}
				rx={4}
			/>
			<text
				fontWeight={600}
				x={x - CHART_MARGIN + 6}
				y={y + 4}
				fill='var(--primary-foreground)'
			>
				{value}
			</text>
		</>
	)
}
