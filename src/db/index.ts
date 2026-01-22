import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({
	connectionString: process.env.DATABASE_URL!,
	max: 10,
	min: 3,
	statement_timeout: 30000,
	connectionTimeoutMillis: 10000,
	idleTimeoutMillis: 30000,
})

pool.on('error', err => {
	console.error('Unexpected error on idle client', err)
})

pool.on('connect', client => {
	client.on('error', err => {
		console.error('Database client error:', err)
	})
})

const db = drizzle({ client: pool, schema })
export { db, pool }
