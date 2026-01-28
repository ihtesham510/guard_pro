import { Link, type LinkProps } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'

export interface NavMainProps {
	label?: string
	limit?: number
	items: {
		title: string
		onClick?: () => void
		href?: LinkProps
		isActive?: boolean
		icon?: LucideIcon
	}[]
}

export function NavMain({ items, label }: NavMainProps) {
	return (
		<SidebarGroup>
			{label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
			<SidebarGroupContent className='flex flex-col gap-4'>
				<SidebarMenu>
					{items.map(item => {
						return (
							<Link {...item.href} key={item.title}>
								<SidebarMenuItem onClick={item.onClick}>
									<SidebarMenuButton
										isActive={item.isActive}
										tooltip={item.title}
									>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</Link>
						)
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
