import { createServerFn, json } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import z from 'zod'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { addAddress, updateAddress } from '@/services/address.api'
import { userRequiredMiddleware } from '@/services/auth.api'
import { companyInsertSchemaWithAddress } from '@/services/company.schema'

export const addCompany = createServerFn({ method: 'POST' })
	.middleware([userRequiredMiddleware])
	.inputValidator(companyInsertSchemaWithAddress)
	.handler(async ({ data }) => {
		const id = await addAddress(data.address)
		return await db
			.insert(schema.company)
			.values({ ...data, address: id })
			.returning()
	})

export const getCompanies = createServerFn({ method: 'GET' })
	.middleware([userRequiredMiddleware])
	.handler(async ({ context: { userId } }) => {
		return await db
			.select()
			.from(schema.company)
			.where(eq(schema.company.userId, userId))
	})

export const getCompaniesWithAddress = createServerFn({ method: 'GET' })
	.middleware([userRequiredMiddleware])
	.handler(async ({ context: { userId } }) => {
		const res = await db
			.select()
			.from(schema.company)
			.where(eq(schema.company.userId, userId))
			.leftJoin(schema.address, eq(schema.company.address, schema.address.id))
		return res.map(row => ({
			...row.company,
			address: row.address,
		}))
	})

export const getCompany = createServerFn({ method: 'GET' })
	.middleware([userRequiredMiddleware])
	.inputValidator(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ data: { id }, context: { userId } }) => {
		return await db
			.select()
			.from(schema.company)
			.where(and(eq(schema.company.userId, userId), eq(schema.company.id, id)))
	})

export const getCompanyWithAddress = createServerFn({ method: 'GET' })
	.middleware([userRequiredMiddleware])
	.inputValidator(
		z.object({
			id: z.string(),
		}),
	)
	.handler(async ({ data: { id }, context: { userId } }) => {
		return await db.query.company.findFirst({
			where: and(eq(schema.company.userId, userId), eq(schema.company.id, id)),
			with: {
				address: true,
			},
		})
	})

export const updateCompany = createServerFn({ method: 'POST' })
	.middleware([userRequiredMiddleware])
	.inputValidator(
		z.object({
			id: z.string(),
			data: companyInsertSchemaWithAddress,
		}),
	)
	.handler(async ({ data: { id, data }, context: { userId } }) => {
		const company = await db.query.company.findFirst({
			where: and(eq(schema.company.id, id), eq(schema.company.userId, userId)),
		})

		if (!company) {
			throw json('Company not found', { status: 404 })
		}

		const { address, ...companyData } = data

		if (company.address && address) {
			await updateAddress({ id: company.address, data: address })
		} else if (address) {
			const addressId = await addAddress(address)
			await db
				.update(schema.company)
				.set({ address: addressId })
				.where(eq(schema.company.id, id))
		}

		return await db
			.update(schema.company)
			.set(companyData)
			.where(eq(schema.company.id, id))
			.returning()
	})

export const deleteCompany = createServerFn({ method: 'POST' })
	.middleware([userRequiredMiddleware])
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data: { id }, context: { userId } }) => {
		return await db
			.delete(schema.company)
			.where(and(eq(schema.company.id, id), eq(schema.company.userId, userId)))
			.returning()
	})
