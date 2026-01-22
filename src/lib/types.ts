import type { QueryOptions } from '@tanstack/react-query'

export type QueryData<T> = T extends (...args: any[]) => infer R
	? R extends QueryOptions<infer D, any, any, any>
		? NonNullable<Awaited<D>> extends Array<infer X>
			? X
			: D
		: never
	: never
