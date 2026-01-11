import { Kbd as KbdPrimitive } from '@/component/canggu/block'
import { classNames }          from '@/component/utility/style'

export type Keyboard 	  = ReadonlyComponentProps<'kbd'>
export type KeyboardGroup = ReadonlyComponentProps<'kbd'>

export function Keyboard({ className, ...props }: Keyboard) {
	return <KbdPrimitive className={classNames('pointer-events-none inline-flex h-4 max-h-4 w-fit min-w-4 items-center justify-center gap-1 rounded-sm bg-neutral-100 px-1 align-middle font-sans text-2xs font-semibold text-neutral-500 select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-white dark:bg-zinc-900 dark:text-neutral-400 dark:in-data-[slot=tooltip-content]:bg-background dark:in-data-[slot=tooltip-content]:text-neutral-400 [&_svg]:size-3', className )} data-slot={'keyboard'} {...props} />
}

export function KeyboardGroup({ className, ...props }: KeyboardGroup) {
	return <KbdPrimitive className={classNames('inline-flex items-center justify-center gap-1 align-middle', className )} data-slot={'keyboard-group'} {...props} />
}
