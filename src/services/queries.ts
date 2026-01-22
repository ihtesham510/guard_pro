import { queryOptions } from '@tanstack/react-query'
import { getUserSession } from './auth.api'
import { getEmployee, getEmployeeieWithAttendence, getEmployees, getEmployeesWithShifts } from './employee.api'
import { getCompanies, getCompaniesWithAddress, getCompany, getCompanyWithAddress } from './company.api.ts'
import { STALE_TIME } from '@/constants.ts'
import { getSites, getSite, getSiteShifts } from './site.api.ts'
import { getShifts } from './shift.api.ts'

export const authQueries = {
	all: ['auth'],
	user: () =>
		queryOptions({
			queryKey: [...authQueries.all, 'user'],
			queryFn: () => getUserSession(),
			staleTime: STALE_TIME,
		}),
}

export const employeeQuries = {
	all: ['employee'],
	getEmployees: () =>
		queryOptions({
			queryKey: [...employeeQuries.all, 'getEmployees'],
			staleTime: STALE_TIME,
			queryFn: getEmployees,
		}),
	get_employee_by_id: (id: string) =>
		queryOptions({
			queryKey: [...employeeQuries.all, 'getEmployee', id],
			staleTime: STALE_TIME,
			queryFn: () => getEmployee({ data: { id } }),
		}),
	getEmployeesWithShifts: () =>
		queryOptions({
			queryKey: [...employeeQuries.all, 'getEmployeesWithShifts'],
			staleTime: STALE_TIME,
			queryFn: () => getEmployeesWithShifts(),
		}),
	getEmployeeieWithAttendence: () =>
		queryOptions({
			queryKey: [...employeeQuries.all, 'getEmployeeieWithAttendence'],
			staleTime: STALE_TIME,
			queryFn: () => getEmployeeieWithAttendence(),
		}),
}

export const companyQueries = {
	all: ['company'],
	getCompanies: () =>
		queryOptions({
			queryKey: [...companyQueries.all],
			queryFn: getCompanies,
			staleTime: STALE_TIME,
		}),
	getCompany: (id: string) =>
		queryOptions({
			queryKey: [...companyQueries.all],
			queryFn: () => getCompany({ data: { id } }),
			staleTime: STALE_TIME,
		}),
	getCompanyWithAddress: (id: string) =>
		queryOptions({
			queryKey: [...companyQueries.all],
			queryFn: () => getCompanyWithAddress({ data: { id } }),
			staleTime: STALE_TIME,
		}),
	getCompaniesWithAddress: () =>
		queryOptions({
			queryKey: [...companyQueries.all],
			queryFn: getCompaniesWithAddress,
			staleTime: STALE_TIME,
		}),
}

export const siteQueries = {
	all: ['site'],
	getSites: () =>
		queryOptions({
			queryKey: [...siteQueries.all],
			staleTime: STALE_TIME,
			queryFn: getSites,
		}),
	getSite: (id: string) =>
		queryOptions({
			queryKey: [...siteQueries.all, 'getSite', id],
			staleTime: STALE_TIME,
			queryFn: () => getSite({ data: { id } }),
		}),
	getSiteShifts: (id: string) =>
		queryOptions({
			queryKey: [...siteQueries.all, 'getSiteShifts', id],
			queryFn: () => getSiteShifts({ data: { id } }) ?? null,
		}),
}

export const shiftQueries = {
	all: ['shift'],
	getShifts: (data: Parameters<typeof getShifts>[0]['data']) =>
		queryOptions({
			queryKey: [...shiftQueries.all, 'getShifts'],
			staleTime: STALE_TIME,
			queryFn: () => getShifts({ data }),
		}),
}
