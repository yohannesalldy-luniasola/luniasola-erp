'use client'

import type { ComponentProps } from 'react'

import * as DropdownMenuPrimitive      from '@radix-ui/react-dropdown-menu'
import { CheckIcon, ChevronRightIcon } from 'lucide-react'

import { Div, Span }  from '@/component/canggu/block'
import { classNames } from '@/component/utility/style'

export type DropdownMenu             = ReadonlyComponentProps<typeof DropdownMenuPrimitive.Root>
export type DropdownMenuPortal       = ReadonlyComponentProps<typeof DropdownMenuPrimitive.Portal>
export type DropdownMenuTrigger      = ReadonlyComponentProps<typeof DropdownMenuPrimitive.Trigger>
export type DropdownMenuGroup        = ReadonlyComponentProps<typeof DropdownMenuPrimitive.Group>
export type DropdownMenuRadioGroup   = ReadonlyComponentProps<typeof DropdownMenuPrimitive.RadioGroup>
export type DropdownMenuCheckboxItem = ReadonlyComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>
export type DropdownMenuRadioItem    = ReadonlyComponentProps<typeof DropdownMenuPrimitive.RadioItem>
export type DropdownMenuSeparator    = ReadonlyComponentProps<typeof DropdownMenuPrimitive.Separator>
export type DropdownMenuSub          = ReadonlyComponentProps<typeof DropdownMenuPrimitive.Sub>
export type DropdownMenuSubContent   = ReadonlyComponentProps<typeof DropdownMenuPrimitive.SubContent>
export type DropdownMenuCard         = ReadonlyComponentProps<'div'>
export type DropdownMenuShortcut     = ReadonlyComponentProps<'span'>
export type DropdownMenuSubTrigger   = Readonly<Omit<ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>, 'inset'> 	 & { readonly inset? : boolean }>
export type DropdownMenuLabel        = Readonly<Omit<ComponentProps<typeof DropdownMenuPrimitive.Label>, 	   'inset'> 	 & { readonly inset? : boolean }>
export type DropdownMenuItem         = Readonly<Omit<ComponentProps<typeof DropdownMenuPrimitive.Item>, 	   'inset'>      & { readonly inset? : boolean }>
export type DropdownMenuContent      = Readonly<Omit<ComponentProps<typeof DropdownMenuPrimitive.Content>,    'sideOffset'> & { readonly sideOffset? : number }>

export function DropdownMenu(props: DropdownMenu) {
	return <DropdownMenuPrimitive.Root data-slot={'dropdown-menu'} {...props} />
}

export function DropdownMenuPortal(props: DropdownMenuPortal) {
	return <DropdownMenuPrimitive.Portal data-slot={'dropdown-menu-portal'} {...props} />
}

export function DropdownMenuTrigger(props: DropdownMenuTrigger) {
	return <DropdownMenuPrimitive.Trigger data-slot={'dropdown-menu-trigger'} {...props} />
}

export function DropdownMenuContent({ className, sideOffset = 4, ...props }: DropdownMenuContent) {
	return (
		<DropdownMenuPrimitive.Portal>
			<DropdownMenuPrimitive.Content className={classNames('z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg border border-neutral-100/25 bg-transparent p-1 px-1 py-1.5 text-foreground shadow-xl backdrop-blur-xs data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 dark:border dark:border-zinc-700/10', className )} data-slot={'dropdown-menu-content'} sideOffset={sideOffset} {...props} />
		</DropdownMenuPrimitive.Portal>
	)
}

export function DropdownMenuCard({ className, ...props }: DropdownMenuCard) {
	return <Div className={classNames('flex flex-col gap-1.5 rounded-md bg-background px-2.5 py-4 shadow-xl shadow-neutral-200/30 dark:bg-zinc-900/95 dark:shadow-zinc-800/5', className)} data-slot={'dropdown-menu-list'} {...props} />
}

export function DropdownMenuGroup(props: DropdownMenuGroup) {
	return <DropdownMenuPrimitive.Group data-slot={'dropdown-menu-group'} {...props} />
}

export function DropdownMenuItem({ className, inset, ...props }: DropdownMenuItem) {
	return <DropdownMenuPrimitive.Item className={classNames('relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-neutral-100/75 focus:text-foreground data-disabled:pointer-events-none data-disabled:opacity-25 data-inset:pl-8 dark:focus:bg-zinc-800/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 [&_svg:not([class*=\'text-\'])]:text-neutral-200', className )} data-inset={inset} data-slot={'dropdown-menu-item'} {...props} />
}

export function DropdownMenuCheckboxItem({ className, children, checked, ...props }: DropdownMenuCheckboxItem) {
	return (
		<DropdownMenuPrimitive.CheckboxItem checked={checked} className={classNames('relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-neutral-100/75 focus:text-foreground data-disabled:pointer-events-none data-disabled:opacity-25 dark:focus:bg-zinc-800/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4', className )} data-slot={'dropdown-menu-checkbox-item'} {...props}>
			<Span className={'pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'}>
				<DropdownMenuPrimitive.ItemIndicator>
					<CheckIcon className={'size-4'} />
				</DropdownMenuPrimitive.ItemIndicator>
			</Span>

			{children}
		</DropdownMenuPrimitive.CheckboxItem>
	)
}

export function DropdownMenuRadioGroup(props: DropdownMenuRadioGroup) {
	return <DropdownMenuPrimitive.RadioGroup data-slot={'dropdown-menu-radio-group'} {...props} />
}

export function DropdownMenuRadioItem({ className, children, ...props }: DropdownMenuRadioItem) {
	return (
		<DropdownMenuPrimitive.RadioItem className={classNames('relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-neutral-100/75 focus:text-foreground data-disabled:pointer-events-none data-disabled:opacity-25 dark:focus:bg-zinc-800/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4', className )} data-slot={'dropdown-menu-radio-item'} {...props}>
			<Span className={'pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'}>
				<DropdownMenuPrimitive.ItemIndicator>
					<CheckIcon className={'size-4'} />
				</DropdownMenuPrimitive.ItemIndicator>
			</Span>

			{children}
		</DropdownMenuPrimitive.RadioItem>
	)
}

export function DropdownMenuLabel({ className, inset, ...props }: DropdownMenuLabel) {
	return <DropdownMenuPrimitive.Label className={classNames('px-2 py-0 text-2xs font-semibold text-neutral-400 uppercase data-inset:pl-8 dark:text-neutral-400/65', className)} data-inset={inset} data-slot={'dropdown-menu-label'} {...props} />
}

export function DropdownMenuSeparator({ className, ...props }: DropdownMenuSeparator) {
	return <DropdownMenuPrimitive.Separator className={classNames('-mx-1 my-1 h-px bg-neutral-100/75 dark:bg-zinc-800/50', className)} data-slot={'dropdown-menu-separator'} {...props} />
}

export function DropdownMenuShortcut({ className, ...props }: DropdownMenuShortcut) {
	return <Span className={classNames('ml-auto text-xs tracking-widest text-neutral-400', className)} data-slot={'dropdown-menu-shortcut'} {...props} />
}

export function DropdownMenuSub(props: DropdownMenuSub) {
	return <DropdownMenuPrimitive.Sub data-slot={'dropdown-menu-sub'} {...props} />
}

export function DropdownMenuSubTrigger({ className, inset, children, ...props }: DropdownMenuSubTrigger) {
	return (
		<DropdownMenuPrimitive.SubTrigger className={classNames('flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-neutral-100/75 focus:text-foreground data-inset:pl-8 data-[state=open]:bg-neutral-100/75 data-[state=open]:text-foreground dark:focus:bg-zinc-800/50 dark:data-[state=open]:bg-zinc-800/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 [&_svg:not([class*=\'text-\'])]:text-neutral-200', className )} data-inset={inset} data-slot={'dropdown-menu-sub-trigger'} {...props}>
			{children}

			<ChevronRightIcon className={'ml-auto size-4'} />
		</DropdownMenuPrimitive.SubTrigger>
	)
}

export function DropdownMenuSubContent({ className, children, ...props }: DropdownMenuSubContent) {
	return (
		<DropdownMenuPrimitive.SubContent className={classNames('z-50 min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border border-neutral-100/25 bg-transparent p-1 px-1 py-1.5 text-foreground shadow-xl backdrop-blur-xs data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 dark:border dark:border-zinc-700/10', className )} data-slot={'dropdown-menu-sub-content'} {...props}>
			<DropdownMenuCard className={'gap-0'}>
				{children}
			</DropdownMenuCard>
		</DropdownMenuPrimitive.SubContent>
	)
}
