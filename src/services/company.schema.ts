import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import * as schema from '@/db/schema'
import { z } from 'zod'
import { addressInsertSchema, addressSelectSchema } from './address.schema'

export const companyInsertSchema = createInsertSchema(schema.company)
export const companyInsertSchemaWithAddress = companyInsertSchema.extend({
	address: addressInsertSchema,
})
export const companySelectSchema = createSelectSchema(schema.company)
export const companySelectSchemaWithAddress = companySelectSchema.extend({
	address: addressSelectSchema,
})

export type CompanyInsertSchema = z.infer<typeof companyInsertSchema>
export type CompanySelectSchema = z.infer<typeof companySelectSchema>

export type CompanySelectSchemaWithAddress = z.infer<typeof companySelectSchemaWithAddress>
export type CompanyInsertSchemaWithAddress = z.infer<typeof companyInsertSchemaWithAddress>
