'use client'

import * as DialogAlertPrimitive from '@radix-ui/react-alert-dialog'
import * as DialogPrimitive      from '@radix-ui/react-dialog'
import { X }                     from 'lucide-react'

import { Div, Span }  from '@/component/canggu/block'
import { Button }     from '@/component/canggu/button'
import { classNames } from '@/component/utility/style'

export type Dialog                 = ReadonlyComponentProps<typeof DialogPrimitive.Root>
export type DialogTrigger          = ReadonlyComponentProps<typeof DialogPrimitive.Trigger>
export type DialogPortal           = ReadonlyComponentProps<typeof DialogPrimitive.Portal>
export type DialogClose            = ReadonlyComponentProps<typeof DialogPrimitive.Close>
export type DialogOverlay          = ReadonlyComponentProps<typeof DialogPrimitive.Overlay>
export type DialogContent          = ReadonlyComponentProps<typeof DialogPrimitive.Content> & { overlay? : boolean, showCloseButton? : boolean }
export type DialogHeader           = ReadonlyComponentProps<'div'>
export type DialogBody             = ReadonlyComponentProps<'div'>
export type DialogFooter           = ReadonlyComponentProps<'div'>
export type DialogCard             = ReadonlyComponentProps<'div'>
export type DialogTitle            = ReadonlyComponentProps<typeof DialogPrimitive.Title>
export type DialogDescription      = ReadonlyComponentProps<typeof DialogPrimitive.Description>
export type DialogAlert       	   = ReadonlyComponentProps<typeof DialogAlertPrimitive.Root>
export type DialogAlertTrigger	   = ReadonlyComponentProps<typeof DialogAlertPrimitive.Trigger>
export type DialogAlertPortal 	   = ReadonlyComponentProps<typeof DialogAlertPrimitive.Portal>
export type DialogAlertOverlay	   = ReadonlyComponentProps<typeof DialogAlertPrimitive.Overlay>
export type DialogAlertContent	   = ReadonlyComponentProps<typeof DialogAlertPrimitive.Content> & { overlay? : boolean }
export type DialogAlertCard  	   = ReadonlyComponentProps<'div'>
export type DialogAlertHeader 	   = ReadonlyComponentProps<'div'>
export type DialogAlertBody   	   = ReadonlyComponentProps<'div'>
export type DialogAlertFooter 	   = ReadonlyComponentProps<'div'>
export type DialogAlertTitle  	   = ReadonlyComponentProps<typeof DialogAlertPrimitive.Title>
export type DialogAlertDescription = ReadonlyComponentProps<typeof DialogAlertPrimitive.Description>
export type DialogAlertAction	   = ReadonlyComponentProps<typeof DialogAlertPrimitive.Action>
export type DialogAlertCancel	   = ReadonlyComponentProps<typeof DialogAlertPrimitive.Cancel>

export function Dialog({ ...props }: Dialog) {
	return <DialogPrimitive.Root data-slot={'dialog'} {...props} />
}

export function DialogTrigger({ ...props }: DialogTrigger) {
	return <DialogPrimitive.Trigger data-slot={'dialog-trigger'} {...props} />
}

export function DialogPortal({ ...props }: DialogPortal) {
	return <DialogPrimitive.Portal data-slot={'dialog-portal'} {...props} />
}

export function DialogClose({ ...props }: DialogClose) {
	return <DialogPrimitive.Close data-slot={'dialog-close'} {...props} />
}

export function DialogOverlay({ className, ...props }: DialogOverlay) {
	return <DialogPrimitive.Overlay className={classNames('fixed inset-0 z-25 bg-white/70 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 dark:bg-black/75', className)} data-slot={'dialog-overlay'} {...props} />
}

export function DialogContent({ className, children, overlay = true, showCloseButton = true, ...props }: DialogContent) {
	return (
		<DialogPortal data-slot={'dialog-portal'}>
			{overlay && <DialogOverlay />}

			<DialogPrimitive.Content className={classNames('fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-[-50%] rounded-2xl border-2 border-neutral-100/25 bg-transparent bg-[linear-gradient(rgba(255,255,255,.000)_15.000%,rgba(90,35,180,.105)_35.000%,rgba(235,125,250,.155)_65.000%,rgba(90,30,135,.135)_80.000%,rgba(235,75,155,.025)_95.000%)] px-1.75 py-2.25 shadow-xl shadow-black/7.5 backdrop-blur-xs duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 dark:border-neutral-900/45 dark:bg-[linear-gradient(rgba(255,255,255,.000)_15.000%,rgba(90,35,180,.085)_35.000%,rgba(235,125,250,.025)_65.000%,rgba(90,30,135,.050)_80.000%,rgba(235,75,155,.025)_95.000%)]', className)} data-slot={'dialog-content'} {...props}>
				{children}

				{
					showCloseButton && (
						<DialogPrimitive.Close className={'absolute top-5.5 right-6'} data-slot={'dialog-close'} asChild>
							<Button appearance={'ghost'} icon={true} shape={'circle'} size={'sm'}>
								<X /> <Span className={'sr-only'}>Close</Span>
							</Button>
						</DialogPrimitive.Close>
					)
				}
			</DialogPrimitive.Content>
		</DialogPortal>
	)
}

export function DialogCard({ className, ...props }: DialogCard) {
	return <Div className={classNames('flex w-full flex-col gap-6 rounded-xl bg-background/95 p-6 shadow-lg shadow-black/2.5 dark:bg-zinc-900/95 dark:shadow-zinc-800/5', className)} data-slot={'dialog-card'} {...props} />
}

export function DialogHeader({ className, ...props }: DialogHeader) {
	return <Div className={classNames('flex flex-col gap-2 sm:text-left', className)} data-slot={'dialog-header'} {...props} />
}

export function DialogTitle({ className, ...props }: DialogTitle) {
	return <DialogPrimitive.Title className={classNames('text-base leading-none font-semibold', className)} data-slot={'dialog-title'} {...props} />
}

export function DialogDescription({ className, ...props }: DialogDescription) {
	return <DialogPrimitive.Description className={classNames('text-xs text-neutral-600 dark:text-neutral-400', className)} data-slot={'dialog-description'} {...props} />
}

export function DialogBody({ className, ...props }: DialogBody) {
	return <Div className={classNames('flex flex-col gap-2', className)} data-slot={'dialog-body'} {...props} />
}

export function DialogFooter({ className, ...props }: DialogFooter) {
	return <Div className={classNames('flex flex-col-reverse gap-1.25 sm:flex-row sm:justify-end',	className)} data-slot={'dialog-footer'} {...props} />
}

export function DialogAlert({ ...props }: DialogAlert) {
	return <DialogAlertPrimitive.Root data-slot={'dialog-alert'} {...props} />
}

export function DialogAlertTrigger({ ...props }: DialogAlertTrigger) {
	return <DialogAlertPrimitive.Trigger data-slot={'dialog-alert-trigger'} {...props} />
}

export function DialogAlertPortal({ ...props }: DialogAlertPortal) {
	return <DialogAlertPrimitive.Portal data-slot={'dialog-alert-portal'} {...props} />
}

export function DialogAlertOverlay({ className, ...props }: DialogAlertOverlay) {
	return <DialogAlertPrimitive.Overlay className={classNames('fixed inset-0 z-25 bg-white/70 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 dark:bg-black/75', className )} data-slot={'dialog-alert-overlay'} {...props} />
}

export function DialogAlertContent({ className, overlay = true, ...props }: DialogAlertContent) {
	return (
		<DialogAlertPortal>
			{overlay && <DialogAlertOverlay />}
			<DialogAlertPrimitive.Content className={classNames('fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-[-50%] rounded-2xl border-2 border-neutral-100/25 bg-transparent bg-[linear-gradient(rgba(255,255,255,.000)_15.000%,rgba(90,35,180,.105)_35.000%,rgba(235,125,250,.155)_65.000%,rgba(90,30,135,.135)_80.000%,rgba(235,75,155,.025)_95.000%)] px-1.75 py-2.25 shadow-xl shadow-black/7.5 backdrop-blur-xs duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 dark:border-neutral-900/45 dark:bg-[linear-gradient(rgba(255,255,255,.000)_15.000%,rgba(90,35,180,.085)_35.000%,rgba(235,125,250,.025)_65.000%,rgba(90,30,135,.050)_80.000%,rgba(235,75,155,.025)_95.000%)]', className )} data-slot={'dialog-alert-content'} {...props} />
		</DialogAlertPortal>
	)
}

export function DialogAlertCard({ className, ...props }: DialogAlertCard) {
	return <Div className={classNames('flex w-full flex-col gap-6 rounded-xl bg-background/95 p-6 shadow-lg shadow-black/2.5 dark:bg-zinc-900/95 dark:shadow-zinc-800/5', className)} data-slot={'dialog-alert-card'} {...props} />
}

export function DialogAlertHeader({ className, ...props }: DialogAlertHeader) {
	return <Div className={classNames('flex flex-col gap-2 sm:text-left', className)} data-slot={'dialog-alert-header'} {...props} />
}

export function DialogAlertTitle({ className, ...props }: DialogAlertTitle) {
	return <DialogAlertPrimitive.Title className={classNames('flex flex-row items-center gap-2 text-base leading-none font-semibold [&_svg]:size-4', className)} data-slot={'dialog-alert-title'} {...props} />
}

export function DialogAlertDescription({ className, ...props }: DialogAlertDescription) {
	return <DialogAlertPrimitive.Description className={classNames('text-xs text-neutral-600 dark:text-neutral-400', className)} data-slot={'dialog-alert-description'} {...props} />
}

export function DialogAlertBody({ className, ...props }: DialogAlertBody) {
	return <Div className={classNames('flex flex-col gap-2', className)} data-slot={'dialog-alert-body'} {...props} />
}

export function DialogAlertFooter({ className, ...props }: DialogAlertFooter) {
	return <Div className={classNames('flex flex-row-reverse items-start justify-between gap-1.25 md:flex-row md:items-end md:justify-end', className )} data-slot={'dialog-alert-footer'} {...props} />
}

export function DialogAlertAction({ className, ...props }: DialogAlertAction) {
	return <DialogAlertPrimitive.Action className={classNames('w-full sm:w-auto', className)} {...props} />
}

export function DialogAlertCancel({ className, ...props }: DialogAlertCancel) {
	return <DialogAlertPrimitive.Cancel className={classNames('w-full sm:w-auto', className)} {...props} />	
}
