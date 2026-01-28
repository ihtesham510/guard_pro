import { createMiddleware, createServerFn, json } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import z from 'zod'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { addAddress, updateAddress } from '@/services/address.api'
import { userRequiredMiddleware } from '@/services/auth.api'
import {
	siteInsertSchemaWithAddress,
	sitePicturesInsertSchema,
} from '@/services/site.schema'
import { supabaseMiddleWare } from '@/services/supabase'

export const siteMiddleWare = createMiddleware({ type: 'function' })
	.middleware([userRequiredMiddleware])
	.inputValidator(z.object({ id: z.string() }))
	.server(async ({ next, context, data: { id } }) => {
		const site = await db.query.site.findFirst({
			where: eq(schema.site.id, id),
		})
		if (!site) throw json('site not found', { status: 404 })
		return next({ context: { ...context, site } })
	})

export const getSites = createServerFn({ method: 'GET' })
	.middleware([userRequiredMiddleware])
	.handler(async ({ context: { userId } }) => {
		return await db.query.site.findMany({
			where: eq(schema.site.userId, userId),
			with: {
				address: true,
				pictures: true,
			},
		})
	})

export const addSitePictures = createServerFn({ method: 'POST' })
	.middleware([userRequiredMiddleware])
	.inputValidator(z.array(sitePicturesInsertSchema))
	.handler(async ({ data }) => {
		return await db.insert(schema.sitePictures).values(data).returning()
	})

export const addSite = createServerFn({ method: 'POST' })
	.middleware([userRequiredMiddleware])
	.inputValidator(siteInsertSchemaWithAddress)
	.handler(async ({ data, context: { userId } }) => {
		const { address, ...siteData } = data
		const addressId = await addAddress(address)
		return await db
			.insert(schema.site)
			.values({ ...siteData, address: addressId, userId })
			.returning()
	})

export const getSite = createServerFn({ method: 'GET' })
	.middleware([userRequiredMiddleware])
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data: { id }, context: { userId } }) => {
		return await db.query.site.findFirst({
			where: and(eq(schema.site.id, id), eq(schema.site.userId, userId)),
			with: {
				address: true,
				pictures: true,
			},
		})
	})

export const updateSite = createServerFn({ method: 'POST' })
	.middleware([userRequiredMiddleware])
	.inputValidator(
		z.object({
			id: z.string(),
			data: siteInsertSchemaWithAddress,
		}),
	)
	.handler(async ({ data: { id, data }, context: { userId } }) => {
		const site = await db.query.site.findFirst({
			where: and(eq(schema.site.id, id), eq(schema.site.userId, userId)),
		})

		if (!site) {
			throw json('Site not found', { status: 404 })
		}

		const { address, ...siteData } = data

		if (site.address && address) {
			await updateAddress({ id: site.address, data: address })
		} else if (address) {
			const addressId = await addAddress(address)
			await db
				.update(schema.site)
				.set({ address: addressId })
				.where(eq(schema.site.id, id))
		}

		return await db
			.update(schema.site)
			.set(siteData)
			.where(eq(schema.site.id, id))
			.returning()
	})

export const deleteSite = createServerFn({ method: 'POST' })
	.middleware([userRequiredMiddleware])
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data: { id }, context: { userId } }) => {
		return await db
			.delete(schema.site)
			.where(and(eq(schema.site.id, id), eq(schema.site.userId, userId)))
			.returning()
	})

export const deleteSites = createServerFn({ method: 'POST' })
	.inputValidator(z.array(z.string()))
	.handler(async ({ data }) => {
		const [res] = await Promise.all(
			data.map(async id => {
				return await db
					.delete(schema.site)
					.where(eq(schema.site.id, id))
					.returning({ deletedId: schema.site.id })
			}),
		)
		return res
	})

export const deleteSitePicture = createServerFn({ method: 'POST' })
	.middleware([userRequiredMiddleware, supabaseMiddleWare])
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data: { id }, context: { supabase } }) => {
		const picture = await db.query.sitePictures.findFirst({
			where: eq(schema.sitePictures.id, id),
			with: {
				site: true,
			},
		})
		if (!picture) throw json('picture not found', { status: 404 })
		const { data, error } = await supabase.storage
			.from('site_pictrues')
			.remove([picture.storageId])
		if (error) {
			throw json('error while deleting picture from storage', { status: 500 })
		}
		if (data) {
			return await db
				.delete(schema.sitePictures)
				.where(eq(schema.sitePictures.id, picture.id))
				.returning()
		}
	})

export const uploadSitePictures = createServerFn({ method: 'POST' })
	.middleware([userRequiredMiddleware, supabaseMiddleWare])
	.inputValidator(
		z.array(
			z.object({
				name: z.string(),
				type: z.string(),
				data: z.string(),
			}),
		),
	)
	.handler(async ({ data: files, context: { supabase } }) => {
		const uploadPromises = files.map(async file => {
			const timestamp = Date.now()
			const randomId =
				Math.random().toString(36).substring(2, 15) +
				Math.random().toString(36).substring(2, 15)
			const fileExtension = file.name.split('.').pop() || 'jpg'
			const fileName = `${timestamp}-${randomId}.${fileExtension}`
			const filePath = fileName

			const base64Data = file.data.split(',')[1] || file.data
			const binaryString = Buffer.from(base64Data, 'base64')
			const blob = new Blob([binaryString], { type: file.type || 'image/jpeg' })

			const uploadRes = await supabase.storage
				.from('site_pictures')
				.upload(filePath, blob, {
					contentType: file.type || 'image/jpeg',
				})

			if (uploadRes.error) {
				throw json(`Error uploading picture: ${uploadRes.error.message}`, {
					status: 500,
				})
			}

			const { data: urlData } = supabase.storage
				.from('site_pictures')
				.getPublicUrl(filePath)

			return {
				url: urlData.publicUrl,
				storageId: filePath,
			}
		})

		return Promise.all(uploadPromises)
	})

export const getSiteShifts = createServerFn({ method: 'GET' })
	.middleware([siteMiddleWare])
	.handler(
		async ({
			context: {
				site: { id },
			},
		}) => {
			return await db.query.shift.findMany({
				where: eq(schema.shift.site_id, id),
				with: {
					timeEntry: true,
					shiftExcludeDay: true,
					shiftIncludeDay: true,
					site: true,
				},
			})
		},
	)
