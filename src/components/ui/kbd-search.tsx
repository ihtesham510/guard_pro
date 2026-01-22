import { SearchIcon } from 'lucide-react'

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Kbd, KbdGroup } from '@/components/ui/kbd'

export function KbdSearch(
	props: React.ComponentProps<typeof InputGroupInput> & {
		kbd?: string | string[]
	},
) {
	return (
		<InputGroup className='min-w-xs max-w-md'>
			<InputGroupInput placeholder='Search...' {...props} />
			<InputGroupAddon>
				<SearchIcon />
			</InputGroupAddon>
			{props.kbd ? (
				<InputGroupAddon align='inline-end'>
					{Array.isArray(props.kbd) ? (
						<KbdGroup>
							{props.kbd.map((kbd, index) => (
								<Kbd key={index}>{kbd}</Kbd>
							))}
						</KbdGroup>
					) : (
						<Kbd>{props.kbd}</Kbd>
					)}
				</InputGroupAddon>
			) : null}
		</InputGroup>
	)
}
