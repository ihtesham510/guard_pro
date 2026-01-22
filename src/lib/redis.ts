import Redis from 'ioredis'

export const client = new Redis(process.env.REDIS_URL!)

export const cache = {
	async set<T>(key: string, value: T, ttl: number = 600) {
		await client.setex(key, ttl, JSON.stringify(value))
	},
	async get<T>(key: string): Promise<T | null> {
		const data = await client.get(key)
		return data ? JSON.parse(data) : null
	},
	async del(...keys: string[]) {
		await client.del(...keys)
	},
}
