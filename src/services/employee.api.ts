import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import z from 'zod'
import { db } from '@/db'
import * as schema from '@/db/schema'
import { addAddress, updateAddress } from '@/services/address.api'
import { userRequiredMiddleware } from '@/services/auth.api'
import { employeInsertSchemaWithAddress } from '@/services/employee.schema'

export const addEmployee = createServerFn({ method: 'POST' })
	.middleware([userRequiredMiddleware])
	.inputValidator(employeInsertSchemaWithAddress)
	.handler(async ({ data }) => {
		const id = data.address ? await addAddress(data.address) : undefined
		await db.insert(schema.employee).values({ ...data, address: id })
	})

export const getEmployees = createServerFn({ method: 'GET' })
	.middleware([userRequiredMiddleware])
	.handler(async ({ context: { userSession } }) => {
		return await db.query.employee.findMany({
			where: eq(schema.employee.userId, userSession.user.id),
			with: {
				address: true,
			},
		})
	})

export const getEmployee = createServerFn({ method: 'GET' })
	.middleware([userRequiredMiddleware])
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data: { id }, context: { userSession } }) => {
		return await db.query.employee.findFirst({
			where: and(
				eq(schema.employee.id, id),
				eq(schema.employee.userId, userSession.user.id),
			),
			with: {
				address: true,
			},
		})
	})

export const getEmployeeieWithAttendence = createServerFn({ method: 'GET' })
	.middleware([userRequiredMiddleware])
	.handler(async ({ context: { userId } }) => {
		return await db.query.employee.findMany({
			where: eq(schema.employee.userId, userId),
			with: {
				shift_assignment: {
					with: {
						shift: {
							with: {
								shiftExcludeDay: true,
								shiftIncludeDay: true,
							},
						},
					},
				},
				leaveRequest: true,
				timeEntry: true,
			},
		})
	})

export const updateEmployee = createServerFn({ method: 'POST' })
	.middleware([userRequiredMiddleware])
	.inputValidator(
		z.object({
			id: z.string(),
			data: employeInsertSchemaWithAddress,
		}),
	)
	.handler(async ({ data: { id, data }, context: { userSession } }) => {
		const employee = await db.query.employee.findFirst({
			where: and(
				eq(schema.employee.id, id),
				eq(schema.employee.userId, userSession.user.id),
			),
		})

		if (!employee) {
			throw new Error('Employee not found')
		}

		const { address, ...employeeData } = data

		if (employee.address && address) {
			await updateAddress({ id: employee.address, data: address })
		} else if (address) {
			const addressId = await addAddress(address)
			await db
				.update(schema.employee)
				.set({ address: addressId })
				.where(eq(schema.employee.id, id))
		}

		return await db
			.update(schema.employee)
			.set(employeeData)
			.where(eq(schema.employee.id, id))
			.returning()
	})

export const deleteEmployee = createServerFn({ method: 'POST' })
	.middleware([userRequiredMiddleware])
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data: { id }, context: { userSession } }) => {
		return await db
			.delete(schema.employee)
			.where(
				and(
					eq(schema.employee.id, id),
					eq(schema.employee.userId, userSession.user.id),
				),
			)
			.returning()
	})

export const getEmployeesWithShifts = createServerFn({ method: 'GET' })
	.middleware([userRequiredMiddleware])
	.handler(async ({ context: { userId } }) => {
		return (
			await db.query.employee.findMany({
				where: eq(schema.employee.userId, userId),
				with: {
					shift_assignment: {
						with: {
							shift: {
								with: {
									site: true,
								},
							},
						},
					},
				},
			})
		).map(emp => {
			return {
				...emp,
				shift_assignment: emp.shift_assignment.filter(
					assignment => !assignment.shift.terminated,
				),
			}
		})
	})
