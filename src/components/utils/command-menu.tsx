import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { useAppState } from '@/context/app-context'
import { DialogType } from '@/context/app-context'
import { useRoutes } from '@/hooks/use-routes'
import { useRouter } from '@tanstack/react-router'
import { Building2, ClockIcon, Navigation, User } from 'lucide-react'
import React from 'react'

export function CommandMenu() {
	const { dialogs } = useAppState()
	const routes = useRoutes()
	const router = useRouter()
	const open = dialogs.state['command-menu']
	const setOpen = (e: boolean) => {
		dialogs.setState('command-menu', e)
	}

	function openDialog(dialog: DialogType) {
		dialogs.open(dialog)
		dialogs.setState('command-menu', false)
	}

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen(!open)
			}
		}
		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [])

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder='Type a command or search...' />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading='Navigation'>
					{routes.map(route_lists =>
						route_lists.items
							.filter(route => route.title !== 'Search')
							.map(route => (
								<CommandItem
									onSelect={() => {
										router.navigate({
											to: route.href?.to,
										})
										dialogs.close('command-menu')
									}}
								>
									<route.icon />
									<span>{route.title}</span>
								</CommandItem>
							)),
					)}
				</CommandGroup>
				<CommandGroup heading='Actions'>
					<CommandItem onSelect={() => openDialog('add-employee')}>
						<User /> <span>Add Employee</span>
					</CommandItem>
					<CommandItem onSelect={() => openDialog('add-site')}>
						<Navigation /> <span>Add Site</span>
					</CommandItem>
					<CommandItem onSelect={() => openDialog('add-shift')}>
						<ClockIcon /> <span>Add Shift</span>
					</CommandItem>
					<CommandItem onSelect={() => openDialog('add-company')}>
						<Building2 /> <span>Add Company</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	)
}
