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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { useRouter } from '@tanstack/react-router'
import { SiteSelectSchemaWithAddress } from '@/services/site.schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSite } from '@/services/site.api'
import { siteQueries } from '@/services/queries'
import { toast } from 'sonner'

type Site = SiteSelectSchemaWithAddress

interface DataTableProps {
	data: Site[]
}

export function SiteDataTable({ data }: DataTableProps) {
	const router = useRouter()
	const queryClient = useQueryClient()

	const deleteSiteMutation = useMutation({
		mutationFn: deleteSite,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: siteQueries.all })
			toast.success('Site deleted successfully')
		},
		onError: () => {
			toast.error('Error deleting site')
		},
	})

	const handleEdit = React.useCallback(
		(site: Site) => {
			router.navigate({
				to: '/dashboard/sites/edit/$siteId',
				params: { siteId: site.id },
			})
		},
		[router],
	)

	const handleDelete = React.useCallback(
		async (site: Site) => {
			if (confirm(`Are you sure you want to delete ${site.name}?`)) {
				await deleteSiteMutation.mutateAsync({ data: { id: site.id } })
			}
		},
		[deleteSiteMutation],
	)

	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})

	const columns = React.useMemo<ColumnDef<Site>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
			},
			{
				accessorKey: 'clientName',
				header: 'Client Name',
				cell: ({ row }) => <div>{row.getValue('clientName') || '-'}</div>,
			},
			{
				accessorKey: 'contactPerson',
				header: 'Contact Person',
				cell: ({ row }) => <div>{row.getValue('contactPerson') || '-'}</div>,
			},
			{
				accessorKey: 'contactEmail',
				header: 'Contact Email',
				cell: ({ row }) => <div className='lowercase'>{row.getValue('contactEmail') || '-'}</div>,
			},
			{
				accessorKey: 'contactPhone',
				header: 'Contact Phone',
				cell: ({ row }) => <div>{row.getValue('contactPhone') || '-'}</div>,
			},
			{
				accessorKey: 'address.address_line_1',
				header: 'Address',
				cell: ({ row }) => {
					const address = row.original.address
					return <div>{address?.address_line_1 || '-'}</div>
				},
			},
			{
				accessorKey: 'address.city',
				header: 'City',
				cell: ({ row }) => {
					const address = row.original.address
					return <div>{address?.city || '-'}</div>
				},
			},
			{
				id: 'actions',
				enableHiding: false,
				cell: ({ row }) => {
					const site = row.original

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
								<DropdownMenuItem onClick={() => navigator.clipboard.writeText(site.id)}>Copy id</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleEdit(site)}>Edit</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleDelete(site)}>Delete</DropdownMenuItem>
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
				<TableHeader>
					{table.getHeaderGroups().map(headerGroup => (
						<TableRow key={headerGroup.id} className='max-h-max'>
							{headerGroup.headers.map(header => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map(row => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && 'selected'}
								onClick={async () => {
									const id = (await row.getValue('id')) as string
									if (id) {
										router.navigate({
											to: '/dashboard/sites/$siteId',
											params: { siteId: id },
										})
									}
								}}
								className='cursor-pointer'
							>
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
