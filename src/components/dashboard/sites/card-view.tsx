import { SiteSelectSchemaWithAddress } from '@/services/site.schema'
import { TrailCard } from '@/components/ui/trail-card'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { deleteSite } from '@/services/site.api'
import { siteQueries } from '@/services/queries'

type Site = SiteSelectSchemaWithAddress & {
	pictures?: Array<{ id: string; url: string | null; storageId: string | null }>
}

interface SiteCardViewProps {
	data: Site[]
}

export function SiteCardView({ data }: SiteCardViewProps) {
	const router = useRouter()

	const deleteSiteMutation = useMutation({
		mutationFn: deleteSite,
		meta: {
			successMessage: 'Site deleted successfully',
			errorMessage: 'Error deleting site',
			invalidateQuries: siteQueries.all,
		},
	})

	const handleEdit = (site: Site) => {
		router.navigate({
			to: '/dashboard/sites/edit/$siteId',
			params: { siteId: site.id },
		})
	}

	const handleDelete = async (site: Site) => {
		if (confirm(`Are you sure you want to delete ${site.name}?`)) {
			await deleteSiteMutation.mutateAsync({ data: { id: site.id } })
		}
	}

	const getFirstPicture = (site: Site) => {
		return site.pictures && site.pictures.length > 0 ? site.pictures[0] : null
	}

	const getSecondPicture = (site: Site) => {
		return site.pictures && site.pictures.length > 1 ? site.pictures[1] : null
	}

	const formatLocation = (site: Site): string => {
		const parts = []
		if (site.address.state) parts.push(site.address.state)
		if (site.address.country) parts.push(site.address.country)
		return parts.length > 0 ? parts.join(', ') : 'No address'
	}

	const placeholderImage = 'https://via.placeholder.com/400x240?text=No+Image'

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
			{data.map(site => {
				const firstPicture = getFirstPicture(site)
				const secondPicture = getSecondPicture(site)
				const imageUrl = firstPicture?.url ?? undefined
				const mapImageUrl = secondPicture?.url ?? firstPicture?.url ?? placeholderImage

				return (
					<div key={site.id} className='relative min-w-full'>
						<TrailCard
							imageUrl={imageUrl}
							mapImageUrl={mapImageUrl}
							title={site.name}
							location={formatLocation(site)}
							className='min-w-full'
							onClick={() =>
								router.navigate({
									to: '/dashboard/sites/$siteId',
									params: { siteId: site.id },
								})
							}
						/>
						<div className='absolute top-2 right-2 z-10'>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='ghost' size='icon' className='h-8 w-8 bg-background/80 backdrop-blur-sm'>
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
						</div>
					</div>
				)
			})}
		</div>
	)
}
