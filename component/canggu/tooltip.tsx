'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { classNames } from '@/component/utility/style'

export type Tooltip         = ReadonlyComponentProps<typeof TooltipPrimitive.Root>
export type TooltipProvider = ReadonlyComponentProps<typeof TooltipPrimitive.Provider>
export type TooltipTrigger  = ReadonlyComponentProps<typeof TooltipPrimitive.Trigger>
export type TooltipContent  = ReadonlyComponentProps<typeof TooltipPrimitive.Content>

export function Tooltip({ ...props }: Tooltip) {
	return (
		<TooltipProvider>
			<TooltipPrimitive.Root data-slot={'tooltip'} {...props} />
		</TooltipProvider>
	)
}

export function TooltipProvider({ delayDuration = 1, ...props }: TooltipProvider) {
	return <TooltipPrimitive.Provider data-slot={'tooltip-provider'} delayDuration={delayDuration} {...props} />
}

export function TooltipTrigger({ ...props }: TooltipTrigger) {
	return <TooltipPrimitive.Trigger data-slot={'tooltip-trigger'} {...props} />
}

export function TooltipContent({ className, sideOffset = 0, children, ...props }: TooltipContent) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content className={classNames('z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in rounded-2xl bg-zinc-900 px-2.5 py-1.5 text-xs text-balance text-white duration-300 fade-in-0 zoom-in-20 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-10 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95', className )} data-slot={'tooltip-content'} sideOffset={sideOffset} {...props}>
				{children}
				<TooltipPrimitive.Arrow className={'z-50 size-2.5 translate-y-[calc(-50%-.175rem)] rotate-45 bg-zinc-900 fill-zinc-900 data-[side=left]:size-2 data-[side=right]:size-2'} />
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	)
}
