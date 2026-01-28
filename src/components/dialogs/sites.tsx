import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CircleX, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import Stepper, { Step } from '@/components/Stepper'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { FieldDescription, FieldLegend, FieldSet } from '@/components/ui/field'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogForm,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAppState } from '@/context/app-context'
import { useIsMobile } from '@/hooks/use-mobile'
import { useAuthentication } from '@/lib/auth-client'
import { companyQueries, siteQueries } from '@/services/queries'
import {
	addSite,
	addSitePictures,
	uploadSitePictures,
} from '@/services/site.api'
import {
	type SiteInsertSchemaWithAddress,
	siteInsertSchemaWithAddress,
} from '@/services/site.schema'

export function SiteDialog() {
	const { user } = useAuthentication()
	const queryClient = useQueryClient()
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])
	const [isUploading, setIsUploading] = useState(false)
	const siteMutation = useMutation({
		mutationKey: ['add-site'],
		mutationFn: addSite,
	})
	const companies = useQuery(companyQueries.getCompanies())
	const form = useForm<SiteInsertSchemaWithAddress>({
		resolver: zodResolver(siteInsertSchemaWithAddress),
		defaultValues: {
			userId: user!.id,
			address: undefined,
		},
	})
	const { dialogs } = useAppState()
	const isMobile = useIsMobile()

	const handleSubmit = async (data: SiteInsertSchemaWithAddress) => {
		try {
			// Create site first
			const result = await siteMutation.mutateAsync({
				data,
			})

			const siteId = result[0]?.id

			// Upload pictures if any
			if (selectedFiles.length > 0 && siteId) {
				setIsUploading(true)
				try {
					// Convert File objects to base64 format expected by server function
					const fileData = await Promise.all(
						selectedFiles.map(
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

					const uploadedPictures = await uploadSitePictures({ data: fileData })
					// Save picture records to database
					await addSitePictures({
						data: uploadedPictures.map(pic => ({
							siteId,
							url: pic.url,
							storageId: pic.storageId,
						})),
					})
					toast.success('Site and pictures uploaded successfully')
				} catch (error) {
					toast.error('Site created but failed to upload pictures')
					console.error('Error uploading pictures:', error)
				} finally {
					setIsUploading(false)
				}
			} else {
				toast.success('Site created successfully')
			}

			queryClient.invalidateQueries({ queryKey: siteQueries.all })
			form.reset()
			setSelectedFiles([])
			dialogs.close('add-site')
		} catch (error) {
			toast.error('Error creating site')
			console.error('Error creating site:', error)
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || [])
		setSelectedFiles(prev => [...prev, ...files])
	}

	const removeFile = (index: number) => {
		setSelectedFiles(prev => prev.filter((_, i) => i !== index))
	}

	useEffect(() => {
		if (!dialogs.state['add-site']) {
			form.reset()
			setSelectedFiles([])
		}
	}, [dialogs.state['add-site'], form.reset])

	return (
		<ResponsiveDialog
			open={dialogs.state['add-site']}
			onOpenChange={e => dialogs.setState('add-site', e)}
		>
			<ResponsiveDialogContent>
				<ResponsiveDialogForm
					form={form}
					onSubmit={form.handleSubmit(handleSubmit)}
				>
					<ResponsiveDialogHeader>
						<ResponsiveDialogTitle>Add Site</ResponsiveDialogTitle>
					</ResponsiveDialogHeader>
					{!companies.isLoading &&
						(!companies.data || companies.data?.length === 0) && (
							<div className='flex flex-col justify-center gap-2 mt-5'>
								<Alert variant='destructive'>
									<CircleX />
									<AlertTitle>No Companies Present</AlertTitle>
									<AlertDescription>
										A company is required before adding a site, please add a
										company before adding sites for that company.
									</AlertDescription>
								</Alert>
								<Button
									onClick={() => {
										dialogs.open('add-company')
										dialogs.close('add-site')
									}}
								>
									Add Company
								</Button>
							</div>
						)}

					{!companies.isLoading &&
						companies.data &&
						companies.data.length !== 0 && (
							<Stepper hideSteps={isMobile}>
								<Step>
									<FieldSet>
										<FieldLegend>Site Information</FieldLegend>
										<FieldDescription>
											Provide basic site information.
										</FieldDescription>

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
																	<SelectItem
																		value={company.id}
																		key={company.id}
																	>
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
														<Input
															{...field}
															value={field.value ?? undefined}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</FieldSet>
								</Step>
								<Step>
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
														<Input
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
														<Input
															{...field}
															value={field.value ?? undefined}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</FieldSet>
								</Step>
								<Step>
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
								</Step>
								<Step>
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
															<Input
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
												name='address.city'
												render={({ field }) => (
													<FormItem className='w-full'>
														<FormLabel>City</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value ?? undefined}
															/>
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
															<Input
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
												name='address.country'
												render={({ field }) => (
													<FormItem className='w-full'>
														<FormLabel>Country</FormLabel>
														<FormControl>
															<Input
																{...field}
																value={field.value ?? undefined}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</FieldSet>
								</Step>
								<Step>
									<FieldSet>
										<FieldLegend>Site Pictures</FieldLegend>
										<FieldDescription>
											Upload pictures of the site (optional).
										</FieldDescription>
										<FormItem>
											<FormLabel>Pictures</FormLabel>
											<FormControl>
												<Input
													type='file'
													accept='image/*'
													multiple
													onChange={handleFileChange}
													disabled={isUploading || siteMutation.isPending}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
										{selectedFiles.length > 0 && (
											<div className='mt-4 space-y-2'>
												<p className='text-sm text-muted-foreground'>
													Selected files:
												</p>
												<div className='space-y-2'>
													{selectedFiles.map((file, index) => (
														<div
															key={index}
															className='flex items-center justify-between p-2 border rounded-md'
														>
															<span className='text-sm truncate flex-1'>
																{file.name}
															</span>
															<Button
																type='button'
																variant='ghost'
																size='icon'
																className='h-6 w-6'
																onClick={() => removeFile(index)}
																disabled={isUploading || siteMutation.isPending}
															>
																<X className='h-4 w-4' />
															</Button>
														</div>
													))}
												</div>
											</div>
										)}
									</FieldSet>
								</Step>
							</Stepper>
						)}
				</ResponsiveDialogForm>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	)
}
