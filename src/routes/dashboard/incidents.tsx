import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty'
import { createFileRoute } from '@tanstack/react-router'
import { OctagonX } from 'lucide-react'

export const Route = createFileRoute('/dashboard/incidents')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<OctagonX />
				</EmptyMedia>
				<EmptyTitle>No Incidenets reported yet.</EmptyTitle>
			</EmptyHeader>
		</Empty>
	)
}
