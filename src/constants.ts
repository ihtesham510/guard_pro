import type { enums } from '@/db/schema'

export const dialogs_list = [
	'command-menu',
	'add-shift',
	'add-company',
	'add-employee',
	'add-site',
] as const

export const STALE_TIME = 5000

export type Day = (typeof enums.shiftDaysEnum)[number]

export const shiftDays: Day[] = [
	'sunday',
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'firday',
	'saturday',
]
