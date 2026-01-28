import type { QueryOptions } from '@tanstack/react-query'

// biome-ignore lint/suspicious/noExplicitAny: <args can be any>
export type QueryData<T> = T extends (...args: any[]) => infer R
	? // biome-ignore lint/suspicious/noExplicitAny: <other's arguments can be of type any>
		R extends QueryOptions<infer D, any, any, any>
		? NonNullable<Awaited<D>> extends Array<infer X>
			? X
			: D
		: never
	: never
