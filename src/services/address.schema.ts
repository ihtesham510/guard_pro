import * as schema from '@/db/schema'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import z from 'zod'

export const addressSelectSchema = createSelectSchema(schema.address)
export const addressInsertSchema = createInsertSchema(schema.address)

export type AddressSelectSchema = z.infer<typeof addressSelectSchema>
export type AddressInsertSchema = z.infer<typeof addressInsertSchema>
