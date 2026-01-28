import * as React from 'react'
import { useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MoreHorizontal, SearchIcon, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { EmployeeSelectSchema } from '@/services/employee.schema'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group'
import { deleteEmployee } from '@/services/employee.api'
import { employeeQuries } from '@/services/queries'
import { toast } from 'sonner'
import { useIsMobile } from '@/hooks/use-mobile'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAppState } from '@/context/app-context'

type Employee = EmployeeSelectSchema

const StatusBadge = ({ status }: { status: Employee['status'] }) => {
	const variants = {
		active: 'bg-primary text-primary-foreground',
		inactive: 'bg-muted text-muted-foreground',
		terminated: 'bg-destructive text-destructive-foreground',
	}

	return (
		<Badge variant='secondary' className={variants[status]}>
			{status.charAt(0).toUpperCase() + status.slice(1)}
		</Badge>
	)
}

const PositionBadge = ({ position }: { position: Employee['position'] }) => {
	return (
		<Badge variant='secondary'>
			{position.charAt(0).toUpperCase() + position.slice(1)}
		</Badge>
	)
}

interface EmployeesSimpleTableProps {
	data: Employee[]
}

export function EmployeesSimpleTable({ data }: EmployeesSimpleTableProps) {
	const router = useRouter()
	const queryClient = useQueryClient()
	const isMobile = useIsMobile()
	const { dialogs } = useAppState()
	const [searchQuery, setSearchQuery] = React.useState('')

	const deleteEmployeeMutation = useMutation({
		mutationFn: deleteEmployee,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: employeeQuries.all })
			toast.success('Employee deleted successfully')
		},
		onError: () => {
			toast.error('Error deleting employee')
		},
	})

	const handleEdit = React.useCallback(
		(employee: Employee, e?: React.MouseEvent) => {
			e?.stopPropagation()
			router.navigate({
				to: '/dashboard/employees/edit/$employeeId',
				params: { employeeId: employee.id },
			})
		},
		[router],
	)

	const handleDelete = React.useCallback(
		async (employee: Employee, e?: React.MouseEvent) => {
			e?.stopPropagation()
			if (
				confirm(
					`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`,
				)
			) {
				await deleteEmployeeMutation.mutateAsync({ data: { id: employee.id } })
			}
		},
		[deleteEmployeeMutation],
	)

	const handleRowClick = React.useCallback(
		(employee: Employee) => {
			router.navigate({
				to: '/dashboard/employees/$Id',
				params: { Id: employee.id },
			})
		},
		[router],
	)

	const filteredData = React.useMemo(() => {
		if (!searchQuery) return data
		const query = searchQuery.toLowerCase()
		return data.filter(
			employee =>
				employee.firstName.toLowerCase().includes(query) ||
				employee.lastName.toLowerCase().includes(query) ||
				employee.email.toLowerCase().includes(query) ||
				employee.employeeCode.toLowerCase().includes(query),
		)
	}, [data, searchQuery])

	if (isMobile) {
		return (
			<div className='space-y-4'>
				<div className='flex items-center justify-between gap-4'>
					<InputGroup className='flex-1'>
						<InputGroupInput
							placeholder='Search employees...'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
						/>
						<InputGroupAddon align='inline-start'>
							<SearchIcon />
						</InputGroupAddon>
					</InputGroup>
					<Button onClick={() => dialogs.open('add-employee')} size='icon'>
						<UserPlus className='h-4 w-4' />
					</Button>
				</div>

				<div className='space-y-3'>
					{filteredData.length === 0 ? (
						<div className='text-center py-8 text-muted-foreground'>
							No employees found.
						</div>
					) : (
						filteredData.map(employee => (
							<div
								key={employee.id}
								onClick={() => handleRowClick(employee)}
								className='bg-card border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors'
							>
								<div className='flex items-start justify-between gap-4'>
									<div className='flex items-center gap-3 flex-1 min-w-0'>
										<Avatar className='size-10 shrink-0'>
											<AvatarFallback className='bg-primary/10 text-primary'>
												{`${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className='flex-1 min-w-0'>
											<p className='font-semibold truncate'>
												{employee.firstName} {employee.lastName}
											</p>
											<p className='text-sm text-muted-foreground truncate'>
												{employee.email}
											</p>
											<div className='flex items-center gap-2 mt-1'>
												<span className='text-xs text-muted-foreground'>
													{employee.employeeCode}
												</span>
												<PositionBadge position={employee.position} />
												<StatusBadge status={employee.status} />
											</div>
										</div>
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger
											asChild
											onClick={e => e.stopPropagation()}
										>
											<Button
												variant='ghost'
												size='icon'
												className='h-8 w-8 shrink-0'
											>
												<span className='sr-only'>Open menu</span>
												<MoreHorizontal className='h-4 w-4' />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align='end'>
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
											<DropdownMenuItem
												onClick={() =>
													navigator.clipboard.writeText(employee.id)
												}
											>
												Copy employee ID
											</DropdownMenuItem>
											<DropdownMenuItem onClick={e => handleEdit(employee, e)}>
												Edit employee
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={e => handleDelete(employee, e)}
											>
												Delete employee
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between gap-4'>
				<InputGroup className='max-w-sm'>
					<InputGroupInput
						placeholder='Search employees...'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
					<InputGroupAddon align='inline-start'>
						<SearchIcon />
					</InputGroupAddon>
				</InputGroup>
				<Button onClick={() => dialogs.open('add-employee')}>
					<UserPlus className='h-4 w-4 mr-2' />
					Add Employee
				</Button>
			</div>

			<Table>
				<TableBody>
					{filteredData.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className='h-24 text-center'>
								No employees found.
							</TableCell>
						</TableRow>
					) : (
						filteredData.map(employee => (
							<TableRow
								key={employee.id}
								onClick={() => handleRowClick(employee)}
								className='cursor-pointer'
							>
								<TableCell className='font-medium'>
									<Avatar className='size-10 shrink-0'>
										<AvatarFallback className='bg-primary/10 text-primary'>
											{`${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</TableCell>
								<TableCell className='font-medium'>
									{employee.employeeCode}
								</TableCell>
								<TableCell>
									{employee.firstName} {employee.lastName}
								</TableCell>
								<TableCell className='lowercase'>{employee.email}</TableCell>
								<TableCell>{employee.phone || '-'}</TableCell>
								<TableCell>
									<PositionBadge position={employee.position} />
								</TableCell>
								<TableCell>
									<StatusBadge status={employee.status} />
								</TableCell>
								<TableCell onClick={e => e.stopPropagation()}>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant='ghost' className='h-8 w-8 p-0'>
												<span className='sr-only'>Open menu</span>
												<MoreHorizontal className='h-4 w-4' />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align='end'>
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
											<DropdownMenuItem
												onClick={() =>
													navigator.clipboard.writeText(employee.id)
												}
											>
												Copy employee ID
											</DropdownMenuItem>
											<DropdownMenuItem onClick={e => handleEdit(employee, e)}>
												Edit employee
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={e => handleDelete(employee, e)}
											>
												Delete employee
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	)
}
