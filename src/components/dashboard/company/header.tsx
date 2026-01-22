import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAppState } from '@/context/app-context'

export function CompanyHeader() {
	const { dialogs } = useAppState()
	return (
		<div className='p-8 border-b border-border'>
			<div className='flex items-center justify-between mb-6'>
				<div>
					<h1 className='text-3xl font-bold text-foreground mb-2'>Companies</h1>
					<p className='text-muted-foreground'>Manage and organize all your companies in one place</p>
				</div>
				<Button className='gap-2' onClick={() => dialogs.open('add-company')}>
					<Plus className='w-4 h-4' />
					Add Company
				</Button>
			</div>

			<div className='relative'>
				<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
				<Input placeholder='Search companies by name or email...' className='pl-10' />
			</div>
		</div>
	)
}
