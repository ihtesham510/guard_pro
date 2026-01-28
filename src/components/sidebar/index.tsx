import type React from 'react'
import { NavMain, type NavMainProps } from '@/components/sidebar/nav-main'
import { NavUser } from '@/components/sidebar/nav-user'
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import { useRoutes } from '@/hooks/use-routes'

interface SideBarProps extends React.ComponentProps<typeof Sidebar> {
	user: {
		email: string
		name: string
		image?: string
	}
}

export function AppSidebar(props: SideBarProps) {
	const list = useRoutes()
	return (
		<Sidebar collapsible='offcanvas' {...props}>
			<SidebarHeader className='pb-2'>
				<NavUser
					user={{
						avatar: props.user.image ?? undefined,
						email: props.user.email,
						name: props.user.name,
					}}
				/>
			</SidebarHeader>
			<SidebarContent>
				{list.map((props, index) => (
					<NavMain {...(props as NavMainProps)} key={index} />
				))}
			</SidebarContent>
		</Sidebar>
	)
}
