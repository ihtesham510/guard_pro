import { shiftInsertSchema } from '@/services/shift.schema'
import { createServerFn } from '@tanstack/react-start'
import { userRequiredMiddleware } from '@/services/auth.api'
import { db } from '@/db'
import * as schema from '@/db/schema'
import z from 'zod'
import { eq } from 'drizzle-orm'

export const addShift = createServerFn({ method: 'POST' })
	.middleware([userRequiredMiddleware])
	.inputValidator(shiftInsertSchema)
	.handler(async ({ data }) => {
		return await db.insert(schema.shift).values(data).returning()
	})

export const removeShift = createServerFn({ method: 'POST' })
	.middleware([userRequiredMiddleware])
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data: { id } }) => {
		return await db.delete(schema.shift).where(eq(schema.shift.id, id)).returning()
	})

export const getShifts = createServerFn({ method: 'GET' })
	.middleware([userRequiredMiddleware])
	.inputValidator(
		z.object({
			site_id: z.string().optional(),
			company_id: z.string().optional(),
			employee_id: z.string().optional(),
		}),
	)
	.handler(async ({ context: { userId }, data }) => {
		const res = await db.query.site.findMany({
			where: eq(schema.site.userId, userId),
			with: {
				shift: {
					where: data.site_id ? eq(schema.shift.site_id, data.site_id) : undefined,
					with: {
						site: {
							with: {
								pictures: true,
								address: true,
								company: true,
							},
						},
						shiftExcludeDay: true,
						shiftIncludeDay: true,
						shift_assignment: {
							with: { employee: true },
							where: data.employee_id ? eq(schema.shift_assignment.employee_id, data.employee_id) : undefined,
						},
					},
				},
			},
		})
		return res.flatMap(site => site.shift)
	})
