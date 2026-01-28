import { zodResolver } from '@hookform/resolvers/zod'
import {
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { EyeIcon, ImageOff, Loader2, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { DashboardTitle } from '@/components/dashboard/dashboard-title'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
	Empty,
	EmptyContent,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty'
import {
	FieldDescription,
	FieldLegend,
	FieldSet,
	FieldTitle,
} from '@/components/ui/field'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { companyQueries, siteQueries } from '@/services/queries'
import {
	addSitePictures,
	deleteSitePicture,
	updateSite,
	uploadSitePictures,
} from '@/services/site.api'
import {
	type SiteInsertSchemaWithAddress,
	type SitePicturesSelectSchema,
	siteInsertSchemaWithAddress,
} from '@/services/site.schema'

export const Route = createFileRoute('/dashboard/sites/edit/$siteId')({
	component: RouteComponent,
	loader: async ({ context: { queryClient }, params }) => {
		await Promise.all([
			queryClient.ensureQueryData(siteQueries.getSite(params.siteId)),
			queryClient.ensureQueryData(companyQueries.getCompanies()),
		])
	},
})

function RouteComponent() {
	const { siteId } = Route.useParams()
	const router = useRouter()
	const queryClient = useQueryClient()
	const { data: site } = useSuspenseQuery(siteQueries.getSite(siteId))
	const companies = useQuery(companyQueries.getCompanies())
	const [viewerOpen, setViewerOpen] = useState(false)
	const [initialSlideIndex, setInitialSlideIndex] = useState(0)
	const [carouselApi, setCarouselApi] = useState<CarouselApi>()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const [isUploading, setIsUploading] = useState(false)

	const uploadPicturesMutation = useMutation({
		mutationFn: uploadSitePictures,
	})

	const addSitePicturesMutation = useMutation({
		mutationFn: addSitePictures,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: siteQueries.all })
		},
	})

	const updateSiteMutation = useMutation({
		mutationFn: updateSite,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: siteQueries.all })
		},
	})

	const form = useForm<SiteInsertSchemaWithAddress>({
		resolver: zodResolver(siteInsertSchemaWithAddress),
		defaultValues: {
			userId: site?.userId || '',
			companyId: site?.companyId || '',
			name: site?.name || '',
			clientName: site?.clientName || undefined,
			contactPerson: site?.contactPerson || undefined,
			contactEmail: site?.contactEmail || undefined,
			contactPhone: site?.contactPhone || undefined,
			address: site?.address
				? {
						address_line_1: site.address.address_line_1 || '',
						address_line_2: site.address.address_line_2 || undefined,
						city: site.address.city || '',
						state: site.address.state || '',
						zip: site.address.zip || '',
						country: site.address.country || '',
					}
				: undefined,
		},
	})

	const handleSubmit = async (data: SiteInsertSchemaWithAddress) => {
		try {
			await updateSiteMutation.mutateAsync({
				data: {
					id: siteId,
					data,
				},
			})

			toast.success('Site updated successfully')

			queryClient.invalidateQueries({ queryKey: siteQueries.all })
			router.navigate({ to: '/dashboard/sites' })
		} catch (error) {
			toast.error('Error updating site')
			console.error('Error updating site:', error)
		}
	}
	const openImageViewer = (index: number) => {
		setInitialSlideIndex(index)
		setViewerOpen(true)
	}

	useEffect(() => {
		if (!carouselApi || !viewerOpen) return
		carouselApi.scrollTo(initialSlideIndex)
	}, [carouselApi, viewerOpen, initialSlideIndex])

	const handleAddPicturesClick = () => {
		fileInputRef.current?.click()
	}

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || [])
		if (files.length > 0) {
			handleUploadPictures(files)
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	const handleUploadPictures = async (files: File[]) => {
		if (files.length === 0) return

		setIsUploading(true)
		try {
			// Convert File objects to base64 format expected by server function
			const fileData = await Promise.all(
				files.map(
					file =>
						new Promise<{ name: string; type: string; data: string }>(
							(resolve, reject) => {
								const reader = new FileReader()
								reader.onload = () => {
									const result = reader.result as string
									// Remove data URL prefix if present
									const parts = result.split(',')
									const base64 = parts.length > 1 ? parts[1]! : result
									resolve({
										name: file.name,
										type: file.type || 'image/jpeg',
										data: base64,
									})
								}
								reader.onerror = reject
								reader.readAsDataURL(file)
							},
						),
				),
			)

			const uploadedPictures = await uploadPicturesMutation.mutateAsync({
				data: fileData,
			})
			await addSitePicturesMutation.mutateAsync({
				data: uploadedPictures.map(pic => ({
					siteId,
					url: pic.url,
					storageId: pic.storageId,
				})),
			})
			toast.success('Pictures uploaded successfully')
		} catch (error) {
			toast.error('Error uploading pictures')
			console.error('Error uploading pictures:', error)
		} finally {
			setIsUploading(false)
		}
	}

	if (!site) {
		return <Spinner />
	}

	return (
		<div className='space-y-6'>
			<DashboardTitle title='Edit Site' />

			<div className='space-y-4'>
				<div className='flex items-start justify-between'>
					<div className='space-y-1'>
						<FieldTitle>Site Pictures</FieldTitle>
						<FieldDescription>
							Manage pictures for this site. Hover over images to delete them.
						</FieldDescription>
					</div>
					<Button
						type='button'
						variant='ghost'
						onClick={handleAddPicturesClick}
						disabled={isUploading}
					>
						{isUploading ? (
							<span className='flex gap-2 items-center'>
								<Spinner />
								Uploading...
							</span>
						) : (
							'Add Pictures'
						)}
					</Button>
					<input
						ref={fileInputRef}
						type='file'
						accept='image/*'
						multiple
						onChange={handleFileInputChange}
						className='hidden'
						disabled={isUploading}
					/>
				</div>

				{site?.pictures && site.pictures.filter(p => p.url).length > 0 && (
					<div className='flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent'>
						{site.pictures
							.filter(p => p.url)
							.map((picture, index) => (
								<RenderPicture
									key={picture.id}
									onView={() => openImageViewer(index)}
									picture={picture}
								/>
							))}
					</div>
				)}
				{(!site?.pictures || site.pictures.filter(p => p.url).length === 0) && (
					<Empty>
						<EmptyHeader>
							<EmptyMedia>
								<ImageOff />
							</EmptyMedia>
							<EmptyTitle>No Images found</EmptyTitle>
							<EmptyContent>
								<Button onClick={handleAddPicturesClick} disabled={isUploading}>
									Add Images
								</Button>
							</EmptyContent>
						</EmptyHeader>
					</Empty>
				)}
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
					<FieldSet>
						<FieldLegend>Site Information</FieldLegend>
						<FieldDescription>Provide basic site information.</FieldDescription>

						<FormField
							control={form.control}
							name='companyId'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel>Company</FormLabel>
									<FormControl>
										<Select
											value={field.value}
											onValueChange={e => field.onChange(e)}
										>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='select company' />
											</SelectTrigger>
											<SelectContent>
												{companies.data?.map(company => (
													<SelectItem key={company.id} value={company.id}>
														{company.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel>Site Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='clientName'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel>Client Name (optional)</FormLabel>
									<FormControl>
										<Input {...field} value={field.value ?? undefined} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldSet>

					<FieldSet>
						<FieldLegend>Contact Information</FieldLegend>
						<FieldDescription>
							Provide site contact person details.
						</FieldDescription>
						<FormField
							control={form.control}
							name='contactPerson'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Contact Person (optional)</FormLabel>
									<FormControl>
										<Input {...field} value={field.value ?? undefined} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='contactEmail'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Contact Email (optional)</FormLabel>
									<FormControl>
										<Input
											type='email'
											{...field}
											value={field.value ?? undefined}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='contactPhone'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Contact Phone (optional)</FormLabel>
									<FormControl>
										<Input {...field} value={field.value ?? undefined} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldSet>

					<FieldSet>
						<FieldLegend>Site Address</FieldLegend>
						<FieldDescription>Provide site address.</FieldDescription>
						<FormField
							control={form.control}
							name='address.address_line_1'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address line 1</FormLabel>
									<FormControl>
										<Textarea
											className='resize-none'
											{...field}
											value={field.value ?? undefined}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='address.address_line_2'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address line 2 (optional)</FormLabel>
									<FormControl>
										<Textarea
											className='resize-none'
											{...field}
											value={field.value ?? undefined}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</FieldSet>

					<FieldSet>
						<FieldLegend>Site Location</FieldLegend>
						<FieldDescription>
							Provide site location, state, city and postal code
						</FieldDescription>
						<div className='flex justify-between items-center gap-2'>
							<FormField
								control={form.control}
								name='address.zip'
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormLabel>Zip/Postal Code</FormLabel>
										<FormControl>
											<Input {...field} value={field.value ?? undefined} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='address.city'
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormLabel>City</FormLabel>
										<FormControl>
											<Input {...field} value={field.value ?? undefined} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className='flex justify-between items-center gap-2'>
							<FormField
								control={form.control}
								name='address.state'
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormLabel>State</FormLabel>
										<FormControl>
											<Input {...field} value={field.value ?? undefined} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='address.country'
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormLabel>Country</FormLabel>
										<FormControl>
											<Input {...field} value={field.value ?? undefined} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</FieldSet>

					<div className='flex justify-end gap-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => router.navigate({ to: '/dashboard/sites' })}
						>
							Cancel
						</Button>
						<Button
							type='submit'
							disabled={updateSiteMutation.isPending || isUploading}
						>
							{updateSiteMutation.isPending || isUploading
								? 'Saving...'
								: 'Save Changes'}
						</Button>
					</div>
				</form>
			</Form>

			{/* Image Viewer Dialog */}
			<Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
				<DialogContent
					showCloseButton={true}
					className='min-w-[75vw] max-w-[85vw]'
				>
					<Carousel
						className='mx-10 min-w-xs'
						setApi={setCarouselApi}
						opts={{
							loop: true,
							align: 'center',
						}}
					>
						<CarouselContent>
							{site.pictures
								.filter(p => p.url)
								.map((pic, index) => (
									<CarouselItem key={index}>
										<div className='p-1 flex items-center justify-center min-h-[65vh]'>
											<Avatar className='w-[60vw] h-[70vh]  max-h-[75vh] rounded-md flex items-center justify-center'>
												<AvatarImage
													src={pic.url!}
													alt='image'
													className='object-contain w-full h-full rounded-md'
													style={{ maxHeight: '100%', maxWidth: '100%' }}
												/>
												<AvatarFallback className='relative rounded-md'>
													<Skeleton className='absolute inset-0 rounded-md' />
												</AvatarFallback>
											</Avatar>
										</div>
									</CarouselItem>
								))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</DialogContent>
			</Dialog>
		</div>
	)
}

function RenderPicture({
	onView,
	picture,
}: {
	onView?: () => void
	picture: SitePicturesSelectSchema
}) {
	const queryClient = useQueryClient()
	const deletePictureMutation = useMutation({
		mutationFn: deleteSitePicture,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: siteQueries.all })
			toast.success('Picture deleted successfully')
		},
		onError: () => {
			toast.error('Error deleting picture')
		},
	})

	return (
		<div className='group relative shrink-0 aspect-square w-32 h-32 rounded-lg overflow-hidden border bg-muted'>
			<Avatar className='w-full h-full object-cover rounded-md'>
				<AvatarImage src={picture.url!} alt='Site picture' />
				<AvatarFallback className='rounded-md relative'>
					<Skeleton className='inset-0 rounded-md absolute' />
				</AvatarFallback>
			</Avatar>
			<div className='absolute inset-0 bg-black/0 group-hover:bg-black/50 group-hover:backdrop-blur-[0.4px] transition-colors duration-200 flex items-center justify-center gap-1'>
				<Button
					type='button'
					size='icon'
					className='hidden opacity-0 group-hover:inline-flex group-hover:opacity-100 transition-opacity duration-200 h-8 w-8'
					onClick={onView}
				>
					<EyeIcon className='h-4 w-4' />
				</Button>
				<Button
					type='button'
					variant='destructive'
					size='icon'
					className='hidden opacity-0 group-hover:inline-flex group-hover:opacity-100 transition-opacity duration-200 h-8 w-8'
					onClick={() =>
						deletePictureMutation.mutate({ data: { id: picture.id } })
					}
					disabled={deletePictureMutation.isPending}
				>
					{deletePictureMutation.isPending ? (
						<Loader2 className='h-4 w-4 animate-spin' />
					) : (
						<Trash2 className='size-4' />
					)}
				</Button>
			</div>
		</div>
	)
}
