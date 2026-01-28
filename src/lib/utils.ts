import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
export const randomEmployeeCode: string = generateEmployeeCode()

export function generateEmployeeCode(
	prefixLength = 3,
	totalLength = 8,
): string {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const digits = '0123456789'

	let prefix = ''
	for (let i = 0; i < prefixLength; i++) {
		prefix += letters.charAt(Math.floor(Math.random() * letters.length))
	}
	const remainingLength = totalLength - prefixLength
	const pool = letters + digits
	let suffix = ''
	for (let i = 0; i < remainingLength; i++) {
		suffix += pool.charAt(Math.floor(Math.random() * pool.length))
	}

	return prefix + suffix
}

export function floorToOneDecimal(num: number) {
	return Math.floor(num * 10) / 10
}

export function capitalizeFirstLetter(str: string) {
	if (str.length === 0) {
		return str
	}
	return str.charAt(0).toUpperCase() + str.slice(1)
}

type Trend = 'up' | 'down' | 'stable'

interface TrendResult {
	trend: Trend
	change: number
	percentageChange: number
}

/**
 * Determines the trend between two values
 * @param previousValue - The earlier/previous value
 * @param currentValue - The later/current value
 * @param threshold - Optional threshold for considering values as stable (default: 0)
 * @returns TrendResult object with trend direction, absolute change, and percentage change
 */
export function getTrend(
	previousValue: number,
	currentValue: number,
	threshold: number = 0,
): TrendResult {
	const change = currentValue - previousValue
	const percentageChange = floorToOneDecimal(
		previousValue !== 0 ? (change / Math.abs(previousValue)) * 100 : 0,
	)

	let trend: Trend

	if (Math.abs(change) <= threshold) {
		trend = 'stable'
	} else if (change > 0) {
		trend = 'up'
	} else {
		trend = 'down'
	}

	return {
		trend,
		change,
		percentageChange,
	}
}

export function formatTime(str: string) {
	return str.replace(/^0?(\d+):00\s*(AM|PM)$/i, '$1 $2')
}
