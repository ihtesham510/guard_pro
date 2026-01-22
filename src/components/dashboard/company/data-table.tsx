import * as React from 'react'
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table'
import { MoreHorizontal, SearchIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { useRouter } from '@tanstack/react-router'
import { CompanySelectSchema } from '@/services/company.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCompany } from '@/services/company.api'
import { companyQueries } from '@/services/queries'
import { toast } from 'sonner'

type Company = CompanySelectSchema

interface CompanyDataTableProps {
	data: Company[]
}

export function CompanyDataTable({ data }: CompanyDataTableProps) {
	const router = useRouter()
	const queryClient = useQueryClient()

	const deleteCompanyMutation = useMutation({
		mutationFn: deleteCompany,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: companyQueries.all })
			toast.success('Company deleted successfully')
		},
		onError: () => {
			toast.error('Error deleting company')
		},
	})

	const handleEdit = React.useCallback(
		(company: Company) => {
			router.navigate({
				to: '/dashboard/companies/edit/$companyId',
				params: { companyId: company.id },
			})
		},
		[router],
	)

	const handleDelete = React.useCallback(
		async (company: Company) => {
			if (confirm(`Are you sure you want to delete ${company.name}?`)) {
				await deleteCompanyMutation.mutateAsync({ data: { id: company.id } })
			}
		},
		[deleteCompanyMutation],
	)

	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})

	const columns = React.useMemo<ColumnDef<Company>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
			},
			{
				accessorKey: 'email',
				header: 'Email',
				cell: ({ row }) => <div className='lowercase'>{row.getValue('email') || '-'}</div>,
			},
			{
				accessorKey: 'phone',
				header: 'Phone',
				cell: ({ row }) => <div>{row.getValue('phone') || '-'}</div>,
			},
			{
				id: 'actions',
				enableHiding: false,
				cell: ({ row }) => {
					const company = row.original

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
								<DropdownMenuItem onClick={() => navigator.clipboard.writeText(company.id)}>Copy id</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleEdit(company)}>Edit</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleDelete(company)}>Delete</DropdownMenuItem>
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
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	})

	return (
		<div className='w-full mb-2'>
			<div className='flex items-center justify-between mb-4'>
				<InputGroup className='max-w-sm'>
					<InputGroupInput
						placeholder='Filter by name...'
						value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
						onChange={event => table.getColumn('name')?.setFilterValue(event.target.value)}
					/>
					<InputGroupAddon align='inline-start'>
						<SearchIcon />
					</InputGroupAddon>
				</InputGroup>
			</div>

			<Table>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map(row => (
							<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
								{row.getVisibleCells().map(cell => (
									<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className='h-24 text-center'>
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	)
}
