import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import * as schema from '@/db/schema'
import type z from 'zod'

export const shiftInsertSchema = createInsertSchema(schema.shift)
export const shiftIncludeDayInsertSchema = createInsertSchema(
	schema.shiftExcludeDay,
)
export const shiftExcludeDayInsertSchema = createInsertSchema(
	schema.shiftExcludeDay,
)
export const shiftAssignmentRequestSchema = createInsertSchema(
	schema.shift_assignment_request,
)

export const shiftInsertSchemaWithRelations = shiftInsertSchema.extend({
	includedDays: shiftIncludeDayInsertSchema.optional(),
	excludedDays: shiftExcludeDayInsertSchema.optional(),
	shiftAssignmentRequest: shiftAssignmentRequestSchema.optional(),
})

export const shiftSelectSchema = createSelectSchema(schema.shift)
export type ShiftSelectSchema = z.infer<typeof shiftSelectSchema>
