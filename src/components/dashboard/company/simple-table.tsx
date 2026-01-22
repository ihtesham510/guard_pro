import * as React from 'react'
import { useRouter } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MoreHorizontal, SearchIcon, Building2, Plus } from 'lucide-react'
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
import { CompanySelectSchema } from '@/services/company.schema'
import { deleteCompany } from '@/services/company.api'
import { companyQueries } from '@/services/queries'
import { toast } from 'sonner'
import { useIsMobile } from '@/hooks/use-mobile'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAppState } from '@/context/app-context'

type Company = CompanySelectSchema

interface CompanySimpleTableProps {
	data: Company[]
}

export function CompanySimpleTable({ data }: CompanySimpleTableProps) {
	const router = useRouter()
	const queryClient = useQueryClient()
	const isMobile = useIsMobile()
	const { dialogs } = useAppState()
	const [searchQuery, setSearchQuery] = React.useState('')

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
		(company: Company, e?: React.MouseEvent) => {
			e?.stopPropagation()
			router.navigate({
				to: '/dashboard/companies/edit/$companyId',
				params: { companyId: company.id },
			})
		},
		[router],
	)

	const handleDelete = React.useCallback(
		async (company: Company, e?: React.MouseEvent) => {
			e?.stopPropagation()
			if (confirm(`Are you sure you want to delete ${company.name}?`)) {
				await deleteCompanyMutation.mutateAsync({ data: { id: company.id } })
			}
		},
		[deleteCompanyMutation],
	)

	const handleRowClick = React.useCallback(
		(company: Company) => {
			router.navigate({
				to: '/dashboard/companies/$Id',
				params: { Id: company.id },
			})
		},
		[router],
	)

	const filteredData = React.useMemo(() => {
		if (!searchQuery) return data
		const query = searchQuery.toLowerCase()
		return data.filter(
			company =>
				company.name.toLowerCase().includes(query) ||
				(company.email && company.email.toLowerCase().includes(query)) ||
				(company.phone && company.phone.toLowerCase().includes(query)),
		)
	}, [data, searchQuery])

	if (isMobile) {
		return (
			<div className='space-y-4'>
				<div className='flex items-center justify-between gap-4'>
					<InputGroup className='flex-1'>
						<InputGroupInput
							placeholder='Search companies...'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
						/>
						<InputGroupAddon align='inline-start'>
							<SearchIcon />
						</InputGroupAddon>
					</InputGroup>
					<Button onClick={() => dialogs.open('add-company')} size='icon'>
						<Plus className='h-4 w-4' />
					</Button>
				</div>

				<div className='space-y-3'>
					{filteredData.length === 0 ? (
						<div className='text-center py-8 text-muted-foreground'>No companies found.</div>
					) : (
						filteredData.map(company => (
							<div
								key={company.id}
								onClick={() => handleRowClick(company)}
								className='bg-card border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors'
							>
								<div className='flex items-start justify-between gap-4'>
									<div className='flex items-center gap-3 flex-1 min-w-0'>
										<Avatar className='size-10 shrink-0'>
											<AvatarFallback className='bg-primary/10 text-primary'>
												<Building2 className='h-5 w-5' />
											</AvatarFallback>
										</Avatar>
										<div className='flex-1 min-w-0'>
											<p className='font-semibold truncate'>{company.name}</p>
											{company.email && <p className='text-sm text-muted-foreground truncate'>{company.email}</p>}
											{company.phone && <p className='text-sm text-muted-foreground truncate mt-1'>{company.phone}</p>}
										</div>
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
											<Button variant='ghost' size='icon' className='h-8 w-8 shrink-0'>
												<span className='sr-only'>Open menu</span>
												<MoreHorizontal className='h-4 w-4' />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align='end'>
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
											<DropdownMenuItem onClick={() => navigator.clipboard.writeText(company.id)}>
												Copy ID
											</DropdownMenuItem>
											<DropdownMenuItem onClick={e => handleEdit(company, e)}>Edit</DropdownMenuItem>
											<DropdownMenuItem onClick={e => handleDelete(company, e)}>Delete</DropdownMenuItem>
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
						placeholder='Search companies...'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
					<InputGroupAddon align='inline-start'>
						<SearchIcon />
					</InputGroupAddon>
				</InputGroup>
				<Button onClick={() => dialogs.open('add-company')}>
					<Plus className='h-4 w-4 mr-2' />
					Add Company
				</Button>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Phone</TableHead>
						<TableHead className='w-[50px]'></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredData.length === 0 ? (
						<TableRow>
							<TableCell colSpan={4} className='h-24 text-center'>
								No companies found.
							</TableCell>
						</TableRow>
					) : (
						filteredData.map(company => (
							<TableRow key={company.id} onClick={() => handleRowClick(company)} className='cursor-pointer'>
								<TableCell className='font-medium'>{company.name}</TableCell>
								<TableCell className='lowercase'>{company.email || '-'}</TableCell>
								<TableCell>{company.phone || '-'}</TableCell>
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
											<DropdownMenuItem onClick={() => navigator.clipboard.writeText(company.id)}>
												Copy ID
											</DropdownMenuItem>
											<DropdownMenuItem onClick={e => handleEdit(company, e)}>Edit</DropdownMenuItem>
											<DropdownMenuItem onClick={e => handleDelete(company, e)}>Delete</DropdownMenuItem>
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
