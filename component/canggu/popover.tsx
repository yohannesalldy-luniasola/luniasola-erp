'use client'

import * as PopoverPrimitive from '@radix-ui/react-popover'

import { Div }        from '@/component/canggu/block'
import { Small }      from '@/component/canggu/typography'
import { classNames } from '@/component/utility/style'

export type Popover        = ReadonlyComponentProps<typeof PopoverPrimitive.Root>
export type PopoverTrigger = ReadonlyComponentProps<typeof PopoverPrimitive.Trigger>
export type PopoverContent = ReadonlyComponentProps<typeof PopoverPrimitive.Content>
export type PopoverAnchor  = ReadonlyComponentProps<typeof PopoverPrimitive.Anchor>
export type PopoverCard    = ReadonlyComponentProps<'div'>
export type PopoverLabel   = ReadonlyComponentProps<'small'>

export function Popover({ ...props }: Popover) {
	return <PopoverPrimitive.Root data-slot={'popover'} {...props} />
}

export function PopoverTrigger({ ...props }: PopoverTrigger) {
	return <PopoverPrimitive.Trigger data-slot={'popover-trigger'} {...props} />
}

export function PopoverContent({ align = 'center', className, sideOffset = 4, ...props }: PopoverContent) {
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content align={align} className={classNames('z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-lg border border-neutral-100/25 bg-transparent p-1 px-1 py-1.5 text-foreground shadow-xl outline-hidden backdrop-blur-xs data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 dark:border dark:border-zinc-700/10', className)} data-slot={'popover-content'} sideOffset={sideOffset} {...props} />
		</PopoverPrimitive.Portal>
	)
}

export function PopoverCard({ className, ...props }: PopoverCard) {
	return <Div className={classNames('flex flex-col space-y-3.25 rounded-md bg-background p-4 shadow-xl shadow-neutral-200/30 dark:bg-zinc-900/95 dark:shadow-zinc-800/5', className)} data-slot={'popover-card'} {...props} />
}

export function PopoverLabel({ className, ...props }: PopoverLabel) {
	return <Small className={classNames('text-2xs font-semibold text-neutral-400 uppercase data-inset:pl-8 dark:text-neutral-400/65', className)} data-slot={'popover-label'} {...props} />
}

export function PopoverAnchor({ ...props }: PopoverAnchor) {
	return <PopoverPrimitive.Anchor data-slot={'popover-anchor'} {...props} />
}
