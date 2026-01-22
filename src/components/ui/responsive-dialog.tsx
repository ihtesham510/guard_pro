import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { PropsWithChildren } from 'react'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FieldValues, UseFormReturn } from 'react-hook-form'

export function ResponsiveDialog({
	children,
	...rest
}: PropsWithChildren & { open?: boolean; onOpenChange?: (e: boolean) => void }) {
	const isMobile = useIsMobile()
	if (isMobile) {
		return <Drawer {...rest}>{children}</Drawer>
	}
	return <Dialog {...rest}>{children}</Dialog>
}

export function ResponsiveDialogContent({ children, className }: PropsWithChildren & { className?: string }) {
	const isMobile = useIsMobile()
	if (isMobile) {
		return <DrawerContent className={cn('min-h-max', className)}>{children}</DrawerContent>
	}
	return <DialogContent className={cn('', className)}>{children}</DialogContent>
}

export function ResponsiveDialogHeader({ children, className }: PropsWithChildren & { className?: string }) {
	const isMobile = useIsMobile()
	if (isMobile) {
		return <DrawerHeader className={cn('', className)}>{children}</DrawerHeader>
	}
	return <DialogHeader className={cn('', className)}>{children}</DialogHeader>
}

export function ResponsiveDialogForm<TFieldValues extends FieldValues>({
	children,
	className,
	form,
	onSubmit,
}: PropsWithChildren<{
	className?: string
	form: UseFormReturn<TFieldValues>
	onSubmit?: React.FormEventHandler<HTMLFormElement>
}>) {
	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className={cn(className)}>
				{children}
			</form>
		</Form>
	)
}
export function ResponsiveDialogTitle({ children, className }: PropsWithChildren & { className?: string }) {
	const isMobile = useIsMobile()
	if (isMobile) {
		return <DrawerTitle className={cn('', className)}>{children}</DrawerTitle>
	}
	return <DialogTitle className={cn('', className)}>{children}</DialogTitle>
}

export function ResponsiveDialogDescription({ children, className }: PropsWithChildren & { className?: string }) {
	const isMobile = useIsMobile()
	if (isMobile) {
		return <DrawerDescription className={cn('', className)}>{children}</DrawerDescription>
	}
	return <DialogDescription className={cn('', className)}>{children}</DialogDescription>
}

export function ResoponsiveDrawerFooter({ children, className }: PropsWithChildren & { className?: string }) {
	const isMobile = useIsMobile()
	if (isMobile) {
		return <DrawerFooter className={cn('', className)}>{children}</DrawerFooter>
	}
	return <DialogFooter>{children}</DialogFooter>
}

export function ResoponsiveDrawerClose({ children, className }: PropsWithChildren & { className?: string }) {
	const isMobile = useIsMobile()
	if (isMobile) {
		return <DrawerClose className={cn('', className)}>{children}</DrawerClose>
	}
	return <DialogClose>{children}</DialogClose>
}

export function ResponsiveDialogSubmitButtons({
	children,
	className,
	disabled,
}: PropsWithChildren & { className?: string; disabled?: boolean }) {
	const isMobile = useIsMobile()
	if (isMobile) {
		return (
			<DrawerFooter className={cn('', className)}>
				<Button disabled={disabled}>{children}</Button>
				<DrawerClose asChild>
					<Button variant='secondary' disabled={disabled}>
						Cancel
					</Button>
				</DrawerClose>
			</DrawerFooter>
		)
	}
	return (
		<DialogFooter className={cn('', className)}>
			<Button>{children}</Button>
			<DialogClose asChild>
				<Button variant='secondary'>Cancel</Button>
			</DialogClose>
		</DialogFooter>
	)
}
