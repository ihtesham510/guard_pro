import { db } from '@/db'
import { AddressInsertSchema } from './address.schema'
import * as schema from '@/db/schema'
import { json } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'

export async function addAddress(address: AddressInsertSchema) {
	const [newAddress] = await db.insert(schema.address).values(address).returning({ addressId: schema.address.id })
	const addressId = newAddress?.addressId
	if (!addressId) throw json('Error while adding address')
	return addressId
}

export async function updateAddress({ id, data }: { id: string; data: AddressInsertSchema }) {
	return await db.update(schema.address).set(data).where(eq(schema.address.id, id)).returning()
}
