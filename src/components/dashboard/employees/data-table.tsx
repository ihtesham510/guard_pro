import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import type {
	ColumnDef,
	ColumnFiltersState,
	FilterFnOption,
	SortingState,
	VisibilityState,
} from '@tanstack/react-table'
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type Row,
	useReactTable,
} from '@tanstack/react-table'
import {
	CheckIcon,
	CornerDownRight,
	MoreHorizontal,
	SearchIcon,
	UserPlus2Icon,
} from 'lucide-react'
import * as React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/ui/copy-btn'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useAppState } from '@/context/app-context'
import { deleteEmployee } from '@/services/employee.api'
import type { EmployeeSelectSchema } from '@/services/employee.schema'
import { employeeQuries } from '@/services/queries'

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

interface EmployeesDataTableProps {
	data: Employee[]
}

export function EmployeesDataTable({ data }: EmployeesDataTableProps) {
	const router = useRouter()

	const deleteEmployeeMutation = useMutation({
		mutationFn: deleteEmployee,
		meta: {
			invalidateQuries: [...employeeQuries.all],
			errorMessage: 'Error deleting employee',
			successMessage: 'Employee deleted successfully',
		},
	})

	const handleEdit = React.useCallback(
		(employee: Employee) => {
			router.navigate({
				to: '/dashboard/employees/edit/$employeeId',
				params: { employeeId: employee.id },
			})
		},
		[router],
	)

	const handleDelete = React.useCallback(
		async (employee: Employee) => {
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

	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	)
	const [globalFilter, setGlobalFilter] = React.useState<string>('')
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})

	const customGlobalFilterFn = React.useCallback(
		(row: Row<Employee>, _columnId: string, filterValue: unknown) => {
			const searchValue = String(filterValue || '')
				.toLowerCase()
				.trim()
			if (!searchValue) return true

			const employee = row.original
			const searchableText = [
				employee.firstName,
				employee.lastName,
				employee.employeeCode,
				employee.email,
				employee.phone || '',
			]
				.join(' ')
				.toLowerCase()

			return searchableText.includes(searchValue)
		},
		[],
	)

	const columns = React.useMemo<ColumnDef<Employee>[]>(
		() => [
			{
				id: 'avatar',
				enableGlobalFilter: false,
				cell: ({ row }) => (
					<Avatar
						className='size-10 shrink-0 cursor-pointer'
						onClick={() => row.toggleSelected()}
					>
						<AvatarFallback className='bg-primary/10 text-primary'>
							{row.getIsSelected() ? (
								<CheckIcon className='size-4' />
							) : (
								<p>
									{`${row.original.firstName[0]}${row.original.lastName[0]}`.toUpperCase()}
								</p>
							)}
						</AvatarFallback>
					</Avatar>
				),
			},
			{
				id: 'name & code',
				accessorFn: row =>
					`${row.firstName} ${row.lastName} ${row.employeeCode}`,
				enableGlobalFilter: true,
				cell: ({ row }) => (
					<div className='font-medium flex flex-col'>
						<p className='flex items-center gap-0.5'>
							{row.original.firstName} {row.original.lastName}{' '}
							<CopyButton text={row.original.employeeCode} />
						</p>
						<span className='flex gap-1 items-center'>
							<CornerDownRight className='size-3' />
							<p className='text-xs text-muted-foreground/60'>
								{row.original.employeeCode}
							</p>
						</span>
					</div>
				),
			},
			{
				id: 'email & phone_no',
				accessorFn: row => `${row.email} ${row.phone || ''}`,
				enableGlobalFilter: true,
				cell: ({ row }) => (
					<div className='font-medium flex flex-col'>
						<p>{row.original.email}</p>
						<span className='flex gap-1 items-center'>
							<CornerDownRight className='size-3' />
							<p className='text-xs text-muted-foreground/60'>
								{row.original.phone}
							</p>
						</span>
					</div>
				),
			},
			{
				accessorKey: 'position',
				enableGlobalFilter: false,
				cell: ({ row }) => (
					<PositionBadge position={row.getValue('position')} />
				),
			},
			{
				accessorKey: 'status',
				enableGlobalFilter: false,
				cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
			},
			{
				id: 'actions',
				enableHiding: false,
				enableGlobalFilter: false,
				cell: ({ row }) => {
					const employee = row.original

					return (
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
									onClick={() => navigator.clipboard.writeText(employee.id)}
								>
									Copy employee ID
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleEdit(employee)}>
									Edit employee
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleDelete(employee)}>
									Delete employee
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)
				},
			},
		],
		[handleEdit, handleDelete],
	)

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: customGlobalFilterFn as FilterFnOption<Employee>,
		enableGlobalFilter: true,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			globalFilter,
			columnVisibility,
			rowSelection,
		},
	})

	const { dialogs } = useAppState()

	return (
		<div className='w-full mb-2'>
			<div className='flex items-center justify-between mb-4'>
				<InputGroup className='max-w-sm'>
					<InputGroupInput
						placeholder='Search by name, code, email, phone...'
						value={(table.getState().globalFilter as string) ?? ''}
						onChange={event => {
							const value = event.target.value
							setGlobalFilter(value)
							table.setGlobalFilter(value)
						}}
					/>
					<InputGroupAddon align='inline-start'>
						<SearchIcon />
					</InputGroupAddon>
				</InputGroup>
				<Button onClick={() => dialogs.open('add-employee')}>
					<UserPlus2Icon />
					<p className='font-medium hidden md:inline-flex'>Add Employee</p>
				</Button>
			</div>
			<div className='border-border border rounded-lg'>
				<Table>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow className='border-b border-border'>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
