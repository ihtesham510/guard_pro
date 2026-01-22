import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

export function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text)
			setCopied(true)

			setTimeout(() => {
				setCopied(false)
			}, 1000)
		} catch (err) {
			console.error('Failed to copy:', err)
		}
	}

	return (
		<Tooltip delayDuration={1600}>
			<TooltipTrigger asChild>
				<button
					onClick={handleCopy}
					className='rounded-lg transition-all duration-300 bg-transparent text-primary hover:bg-transparent px-2 py-0.5 cursor-pointer'
				>
					{copied ? <Check className='size-3' /> : <Copy className='size-3' />}
				</button>
			</TooltipTrigger>
			<TooltipContent>Copy to Clipboard</TooltipContent>
		</Tooltip>
	)
}
