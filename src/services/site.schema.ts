import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import * as schema from '@/db/schema'
import z from 'zod'
import { addressInsertSchema, addressSelectSchema } from './address.schema'

export const sitePicturesSelectSchema = createSelectSchema(schema.sitePictures)
export const sitePicturesInsertSchema = createInsertSchema(schema.sitePictures)

export const siteSelectSchema = createSelectSchema(schema.site).extend({
	address: addressSelectSchema.optional(),
	pictures: sitePicturesSelectSchema.optional(),
})
export const siteInsertSchema = createInsertSchema(schema.site).extend({
	address: addressInsertSchema.optional(),
	pictures: sitePicturesInsertSchema.optional(),
})

export const siteSelectSchemaWithAddress = createSelectSchema(schema.site).extend({
	address: addressSelectSchema,
})
export const siteInsertSchemaWithAddress = createInsertSchema(schema.site).extend({
	address: addressInsertSchema,
})

export const siteSelectSchemaWithPics = createSelectSchema(schema.site).extend({
	pictures: z.array(sitePicturesSelectSchema),
})

export const siteInsertSchemaWithPics = createInsertSchema(schema.site).extend({
	pictures: z.array(sitePicturesSelectSchema).optional(),
})

export type SiteSelectSchema = z.infer<typeof siteSelectSchema>
export type SiteInsertSchema = z.infer<typeof siteInsertSchema>

export type SiteSelectSchemaWithAddress = z.infer<typeof siteSelectSchemaWithAddress>
export type SiteInsertSchemaWithAddress = z.infer<typeof siteInsertSchemaWithAddress>

export type SitePicturesInsertSchema = z.infer<typeof sitePicturesInsertSchema>
export type SitePicturesSelectSchema = z.infer<typeof sitePicturesSelectSchema>
