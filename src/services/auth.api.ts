import { createMiddleware, createServerFn, json } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { auth } from '@/lib/auth'
import { UserMetaSchema } from '@/services/auth.schema'

export const getUserSession = createServerFn({ method: 'GET' }).handler(
	async () => {
		const headers = getRequestHeaders()
		if (!headers) return null

		const userSession = await auth.api.getSession({ headers: headers })

		return userSession
	},
)

export const userMiddleware = createMiddleware({ type: 'function' }).server(
	async ({ next }) => {
		const userSession = await getUserSession()
		const userId = userSession?.user.id
		return next({ context: { userSession, userId } })
	},
)

export const userRequiredMiddleware = createMiddleware({ type: 'function' })
	.middleware([userMiddleware])
	.server(async ({ next, context: { userSession, userId } }) => {
		if (!userSession || !userId) {
			throw json(
				{ message: 'You must be logged in to do that!' },
				{ status: 401 },
			)
		}
		return next({ context: { userSession: userSession, userId: userId } })
	})

export const updateUser = createServerFn()
	.inputValidator(UserMetaSchema)
	.middleware([userRequiredMiddleware])
	.handler(async ({ data, context: { userId } }) => {
		const update: Record<string, unknown> = { name: data.username }
		if (data.imageUrl) {
			update.image = data.imageUrl
		}
		await db.update(schema.user).set(update).where(eq(schema.user.id, userId!))
	})
