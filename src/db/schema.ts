import { relations } from 'drizzle-orm'
import {
	boolean,
	index,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core'

////////////////
// Enums
////////////////

export const enums = {
	employeeStatusEnum: ['active', 'inactive', 'terminated'] as const,
	employeePositionEnum: ['employee', 'senior', 'supervisor'] as const,
	assignmentRequestStatusEnum: [
		'pending',
		'accepted',
		'rejected',
		'cancelled',
	] as const,
	shiftDaysEnum: [
		'sunday',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'firday',
		'saturday',
	] as const,
	shiftType: ['recurring', 'one_time'] as const,
}

export const employeeStatusEnum = pgEnum(
	'employee_status',
	enums.employeeStatusEnum,
)
export const employeePositionEnum = pgEnum(
	'employee_position',
	enums.employeePositionEnum,
)
export const shiftAssignmentRequestEnum = pgEnum(
	'assignment_status',
	enums.assignmentRequestStatusEnum,
)
export const shiftDaysEnum = pgEnum('shift_days', enums.shiftDaysEnum)
export const shiftTypeEnum = pgEnum('shift_type', enums.shiftType)

////////////////
// Auth tables
////////////////

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => new Date())
		.notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => new Date())
		.notNull(),
})

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

////////////////
// Core Application Tables
////////////////

export const company = pgTable(
	'company',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		email: text('email').notNull(),
		address: uuid('address_id').references(() => address.id, {
			onDelete: 'cascade',
		}),
		phone: text('phone'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	table => [
		index('company_user_id_idx').on(table.userId),
		index('company_name_idx').on(table.name),
	],
)

export const site = pgTable(
	'site',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		companyId: uuid('company_id')
			.notNull()
			.references(() => company.id, { onDelete: 'cascade' }),
		userId: text('userId')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		clientName: text('client_name'),
		contactPerson: text('contact_person'),
		contactPhone: text('contact_phone'),
		contactEmail: text('contact_email'),
		name: text('name').notNull(),
		address: uuid('address_id')
			.references(() => address.id, { onDelete: 'cascade' })
			.notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	table => [
		index('site_company_id_idx').on(table.companyId),
		index('site_client_name_idx').on(table.clientName),
	],
)

export const sitePictures = pgTable('site_pictrues', {
	id: uuid('id').defaultRandom().primaryKey(),
	siteId: uuid('site_id').references(() => site.id, { onDelete: 'cascade' }),
	url: text('url').notNull(),
	storageId: text('storage_id').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export const employee = pgTable(
	'employee',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: text('userId')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		employeeCode: text('employee_code').unique().notNull(),
		firstName: text('first_name').notNull(),
		lastName: text('last_name').notNull(),
		email: text('email').unique().notNull(),
		phone: text('phone').notNull(),
		address: uuid('address_id').references(() => address.id, {
			onDelete: 'cascade',
		}),
		position: employeePositionEnum('position').default('employee').notNull(),
		password: text('password'),
		hireDate: timestamp('hire_date').defaultNow().notNull(),
		status: employeeStatusEnum('status').default('active').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	table => [
		index('employee_status_idx').on(table.status),
		index('employee_code_idx').on(table.employeeCode),
	],
)

export const address = pgTable('address', {
	id: uuid('id').defaultRandom().primaryKey(),
	address_line_1: text('address_line_1').notNull(),
	address_line_2: text('address_line_2'),
	state: text('state').notNull(),
	city: text('city').notNull(),
	zip: text('zip').notNull(),
	country: text('country').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

////////////////
// Shifts & Attendence
////////////////

export const shift = pgTable('shift', {
	id: uuid('id').defaultRandom().primaryKey(),
	site_id: uuid('site_id')
		.references(() => site.id, { onDelete: 'cascade' })
		.notNull(),
	name: text('name'),
	type: shiftTypeEnum('type').default('recurring').notNull(),
	notes: text('notes'),
	start_time: text('start_time').notNull(),
	end_time: text('end_time').notNull(),
	start_date: timestamp('start_date').notNull(),
	end_date: timestamp('end_date'),
	off_days: shiftDaysEnum('off_days').array().default(['sunday']).notNull(),
	every_day: boolean('every_day').notNull(),
	pay_rate: numeric('pay_rate').notNull(),
	terminated: boolean('terminated').default(false).notNull(),
	overTime_multiplyer: numeric('overTime_multiplyer'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export const shiftExcludeDay = pgTable('shift_exclude_day', {
	id: uuid('id').defaultRandom().primaryKey(),
	shift_id: uuid('shift_id')
		.references(() => shift.id, { onDelete: 'cascade' })
		.notNull(),
	from: timestamp('from').notNull(),
	to: timestamp('to'),
	reason: text('reason'),
	notes: text('notes'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export const shiftIncludeDay = pgTable('shift_include_day', {
	id: uuid('id').defaultRandom().primaryKey(),
	shift_id: uuid('shift_id')
		.references(() => shift.id, { onDelete: 'cascade' })
		.notNull(),
	start_date: timestamp('start_date').notNull(),
	end_date: timestamp('end_date'),
	custom_time: boolean('custom_time').default(false).notNull(),
	start_time: text('start_time'),
	end_time: text('end_time'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export const shift_assignment = pgTable('shift_assignment', {
	id: uuid('id').defaultRandom().primaryKey(),
	employee_id: uuid('employee_id')
		.references(() => employee.id, { onDelete: 'cascade' })
		.notNull(),
	shift_id: uuid('shift_id')
		.references(() => shift.id, { onDelete: 'cascade' })
		.notNull(),
	assign_date: timestamp('assign_date'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export const shift_assignment_request = pgTable('shift_assignment_request', {
	id: uuid('id').defaultRandom().primaryKey(),
	shift_id: uuid('shift_id')
		.references(() => shift.id, { onDelete: 'cascade' })
		.notNull(),
	employee_id: uuid('employee_id')
		.references(() => employee.id, { onDelete: 'cascade' })
		.notNull(),
	status: shiftAssignmentRequestEnum('status').default('pending'),
	rejectionReason: text('rejectionReason'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export const timeEntry = pgTable('timeEntry', {
	id: uuid('id').defaultRandom().primaryKey(),
	site_id: uuid('site_id')
		.references(() => site.id, { onDelete: 'cascade' })
		.notNull(),
	shift_id: uuid('shift_id')
		.references(() => shift.id, { onDelete: 'set null' })
		.notNull(),
	employee_id: uuid('employee_id')
		.references(() => employee.id, { onDelete: 'cascade' })
		.notNull(),
	start_time: timestamp('start_time').notNull(),
	break_start: timestamp('break_start'),
	break_end: timestamp('break_end'),
	end_time: timestamp('end_time'),
	break_time: numeric('break_time'),
	hours: numeric('hours'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export const leaveRequest = pgTable('leave_request', {
	id: uuid('id').defaultRandom().primaryKey(),
	employee_id: uuid('employee_id')
		.references(() => employee.id)
		.notNull(),
	start_date: timestamp('start_date').notNull(),
	end_date: timestamp('end_date'),
	reason: text('reason').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

////////////////
// Relations
////////////////

// User Relations
export const userRelations = relations(user, ({ many }) => ({
	companies: many(company),
	sessions: many(session),
	accounts: many(account),
}))

// Company Relations
export const companyRelations = relations(company, ({ one, many }) => ({
	owner: one(user, {
		fields: [company.userId],
		references: [user.id],
	}),
	address: one(address, {
		fields: [company.address],
		references: [address.id],
	}),
	sites: many(site),
}))

// Site Pictures Relation
export const sitePicturesRelations = relations(sitePictures, ({ one }) => ({
	site: one(site, {
		fields: [sitePictures.siteId],
		references: [site.id],
	}),
}))

// Site Relations
export const siteRelations = relations(site, ({ one, many }) => ({
	company: one(company, {
		fields: [site.companyId],
		references: [company.id],
	}),
	address: one(address, {
		fields: [site.address],
		references: [address.id],
	}),
	pictures: many(sitePictures),
	shift: many(shift),
	timeEntry: many(timeEntry),
}))

// Employee Relations
export const employeeRelations = relations(employee, ({ one, many }) => ({
	employee: one(user, {
		fields: [employee.userId],
		references: [user.id],
	}),
	address: one(address, {
		fields: [employee.address],
		references: [address.id],
	}),
	leaveRequest: many(leaveRequest),
	shift_assignment: many(shift_assignment),
	timeEntry: many(timeEntry),
}))

// shift relations
export const shiftRelations = relations(shift, ({ one, many }) => ({
	timeEntry: many(timeEntry),
	site: one(site, {
		fields: [shift.site_id],
		references: [site.id],
	}),
	shiftExcludeDay: many(shiftExcludeDay),
	shiftIncludeDay: many(shiftIncludeDay),
	shift_assignment: many(shift_assignment),
}))

// timeEntry relations
export const timeEntryRelations = relations(timeEntry, ({ one }) => ({
	employee: one(employee, {
		fields: [timeEntry.employee_id],
		references: [employee.id],
	}),
	shift: one(shift, {
		fields: [timeEntry.shift_id],
		references: [shift.id],
	}),
	site: one(site, {
		fields: [timeEntry.shift_id],
		references: [site.id],
	}),
}))

// shift_assignment relations
export const shiftAssignementRelations = relations(
	shift_assignment,
	({ one }) => ({
		shift: one(shift, {
			fields: [shift_assignment.shift_id],
			references: [shift.id],
		}),
		employee: one(employee, {
			fields: [shift_assignment.employee_id],
			references: [employee.id],
		}),
	}),
)

// shift_assignment_request relations
export const shiftRequestRelations = relations(
	shift_assignment_request,
	({ one }) => ({
		shift: one(shift, {
			fields: [shift_assignment_request.shift_id],
			references: [shift.id],
		}),
		employee: one(employee, {
			fields: [shift_assignment_request.employee_id],
			references: [employee.id],
		}),
	}),
)

// shift_exclude_day relations
export const shiftExcludeDayRelations = relations(
	shiftExcludeDay,
	({ one }) => ({
		shift: one(shift, {
			fields: [shiftExcludeDay.shift_id],
			references: [shift.id],
		}),
	}),
)

// shift_include_day relations
export const shiftIncludeDayRelations = relations(
	shiftIncludeDay,
	({ one }) => ({
		shift: one(shift, {
			fields: [shiftIncludeDay.shift_id],
			references: [shift.id],
		}),
	}),
)

// leaveRequest relations
export const leaveRequestRelations = relations(leaveRequest, ({ one }) => ({
	employee: one(employee, {
		fields: [leaveRequest.employee_id],
		references: [employee.id],
	}),
}))
