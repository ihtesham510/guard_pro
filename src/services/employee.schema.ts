import * as schema from '@/db/schema'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import z from 'zod'
import { addressInsertSchema, addressSelectSchema } from './address.schema'

export const employeeInsertSchema = createInsertSchema(schema.employee)
export const employeInsertSchemaWithAddress = employeeInsertSchema
	.extend({
		address: addressInsertSchema.optional(),
	})
	.superRefine((data, ctx) => {
		if (!data.address) {
			return
		}

		const hasAnyAddressField = Object.entries(data.address).some(([key, value]) => {
			if (key === 'id' || key === 'createdAt' || key === 'updatedAt') {
				return false
			}
			return value !== undefined && value !== null && value !== ''
		})

		if (hasAnyAddressField) {
			const requiredFields = ['address_line_1', 'state', 'city', 'zip', 'country'] as const
			const missingFields: string[] = []

			for (const field of requiredFields) {
				const value = data.address[field]
				if (!value || (typeof value === 'string' && value.trim() === '')) {
					missingFields.push(field)
				}
			}

			if (missingFields.length > 0) {
				for (const field of missingFields) {
					ctx.addIssue({
						code: 'custom',
						message: `${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} is required when address is provided`,
						path: ['address', field],
					})
				}
			}
		}
	})

export const employeeSelectSchema = createSelectSchema(schema.employee)
export const employeeSelectSchemaWithAddress = employeeSelectSchema.extend({
	address: addressSelectSchema.optional(),
})

export type EmployeeInsertSchema = z.infer<typeof employeeInsertSchema>
export type EmployeeSelectSchema = z.infer<typeof employeeSelectSchema>

export type EmployeeSelectSchemaWithAddress = z.infer<typeof employeeSelectSchemaWithAddress>
export type EmployeInsertSchemaWithAddress = z.infer<typeof employeInsertSchemaWithAddress>
