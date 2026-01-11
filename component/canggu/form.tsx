'use client'

import type { ReactNode, RefObject } from 'react'

import { useRef, useCallback } from 'react'

import * as CheckboxPrimitive                        from '@radix-ui/react-checkbox'
import * as LabelPrimitive                           from '@radix-ui/react-label'
import * as SelectPrimitive                          from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

import { Div, Span }  from '@/component/canggu/block'
import { classNames } from '@/component/utility/style'

export type Input	  	 	  	   = ReadonlyComponentProps<'input'> & { adornment? : ReactNode, action? : ReactNode }
export type Checkbox	  	 	   = ReadonlyComponentProps<typeof CheckboxPrimitive.Root>
export type Form    	 	  	   = ReadonlyComponentProps<'form'>
export type Fieldset	 	  	   = ReadonlyComponentProps<'fieldset'>
export type Message 	 	  	   = ReadonlyComponentProps<'span'>
export type Label  	      		   = ReadonlyComponentProps<typeof LabelPrimitive.Root>
export type Select    	  		   = ReadonlyComponentProps<typeof SelectPrimitive.Root>
export type SelectGroup	  		   = ReadonlyComponentProps<typeof SelectPrimitive.Group>
export type SelectValue	  		   = ReadonlyComponentProps<typeof SelectPrimitive.Value>
export type SelectTrigger      	   = ReadonlyComponentProps<typeof SelectPrimitive.Trigger>
export type SelectContent   	   = ReadonlyComponentProps<typeof SelectPrimitive.Content>
export type SelectLabel	  		   = ReadonlyComponentProps<typeof SelectPrimitive.Label>
export type SelectItem             = ReadonlyComponentProps<typeof SelectPrimitive.Item>
export type SelectSeparator        = ReadonlyComponentProps<typeof SelectPrimitive.Separator>
export type SelectScrollUpButton   = ReadonlyComponentProps<typeof SelectPrimitive.ScrollUpButton>
export type SelectScrollDownButton = ReadonlyComponentProps<typeof SelectPrimitive.ScrollDownButton>
export type Textarea               = ReadonlyComponentProps<'textarea'>

export function Form({ className, ...props }: Form) {
	return <form className={classNames('flex w-full flex-col gap-0.75', className)} {...props} />
}

export function Fieldset({ className, ...props }: Fieldset) {
	return <fieldset className={classNames('mb-3.5 flex w-full flex-col gap-2 last:mb-0', className)} {...props} />
}

export function Message({ className, ...props }: Message) {
	return <Span className={classNames('text-xs whitespace-pre-line text-red-600', className)} {...props} />
}

export function Label({ className, ...props }: Label) {
	return <LabelPrimitive.Root className={classNames('flex items-center gap-2 text-xs leading-none font-semibold select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50', className)} data-slot={'form-label'} {...props} />
}

export function Input({ action, adornment, className, disabled, type,  ref, ...props }: Input) {
	const STYLE = classNames('h-8.5 w-full min-w-0 rounded-md border-[.100rem] border-neutral-200/85 bg-transparent p-2 text-sm tracking-normal shadow-md shadow-black/5 transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:font-semibold placeholder:text-neutral-400 focus-visible:border-primary-500 focus-visible:shadow-none focus-visible:ring-3 focus-visible:ring-primary-500/5 focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-zinc-800/75 dark:bg-black dark:placeholder:text-neutral-700 dark:focus-visible:border-zinc-500/25')

	const refInput 	  = useRef<HTMLInputElement>(null)
	const setRefInput = useCallback((element: HTMLInputElement | null) => {
		refInput.current = element

		if (typeof ref === 'function')
			ref(element)
		else if (ref && typeof ref === 'object')
			(ref as RefObject<HTMLInputElement | null>).current = element
	}, [ ref ])

	function performFocus() {
		if (refInput.current && !disabled)
			refInput.current.focus()
	}

	if (Boolean(adornment || action))
		return (
			<Div className={classNames(STYLE, 'inline-flex items-center gap-1.5 bg-transparent px-2 focus-within:border-primary-500 focus-within:shadow-none focus-within:ring-3 focus-within:ring-primary-500/5 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:bg-neutral-100/75 data-[disabled=true]:opacity-50 dark:data-[disabled=true]:bg-zinc-900/35', className)} data-disabled={disabled} data-slot={'input-wrapper'} onClick={performFocus}>
				{
					adornment && (
						<Span className={'flex w-fit items-center justify-center text-sm text-neutral-500 select-none'}>
							{adornment}
						</Span>
					)
				}
                
				<input className={classNames('w-full flex-1 border-none bg-transparent p-0 text-sm shadow-none outline-none selection:bg-primary selection:text-primary-foreground file:border-0 file:bg-transparent file:text-sm file:font-semibold placeholder:text-neutral-400 dark:placeholder:text-neutral-700', type === 'file' ? 'text-xs!' : '' )} data-slot={'form-input'} disabled={disabled} ref={setRefInput} type={type} {...props} />

				{
					action && (
						<Span className={'flex items-center justify-center text-sm text-neutral-500 select-none'}>
							{action}
						</Span>
					)
				}
			</Div>
		)

	return <input className={classNames(STYLE, 'focus-visible:border-primary-500 focus-visible:shadow-none focus-visible:ring-3 focus-visible:ring-primary-500/5 focus-visible:outline-none', type === 'file' ? 'text-xs! file:font-semibold!' : '', className)} data-slot={'form-input'} disabled={disabled} type={type} {...props} />
}

export function Checkbox({ className, ...props }: Checkbox) {
	return (
		<CheckboxPrimitive.Root className={classNames('peer size-4.75 shrink-0 cursor-pointer rounded-[4px] border-[.100rem] border-neutral-200/85 bg-transparent shadow-md shadow-black/5 transition-shadow outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:border-zinc-800/75 dark:bg-black dark:data-[state=checked]:bg-primary', className )} data-slot={'checkbox'} {...props}>
			<CheckboxPrimitive.Indicator className={'grid place-content-center text-current transition-none'} data-slot={'checkbox-indicator'}>
				<CheckIcon className={'size-3.5'} />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
}

export function Select({ ...props }: Select) {
	return <SelectPrimitive.Root data-slot={'select'} {...props} />
}

export function SelectGroup({ ...props }: SelectGroup) {
	return <SelectPrimitive.Group data-slot={'select-group'} {...props} />
}

export function SelectValue({ ...props }: SelectValue) {
	return <SelectPrimitive.Value data-slot={'select-value'} {...props} />
}

export function SelectTrigger({ className, children, ...props }: SelectTrigger) {
	return (
		<SelectPrimitive.Trigger className={classNames('flex h-8.5 w-full cursor-pointer items-center justify-between gap-1 rounded-md border-[.100rem] border-neutral-200/85 bg-transparent p-2 text-sm whitespace-nowrap shadow-md shadow-black/5 transition-[color,box-shadow] outline-none hover:shadow-black/7.5 focus:border-primary focus-visible:border-primary-500 focus-visible:shadow-none focus-visible:ring-3 focus-visible:ring-primary-500/5 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-400 aria-invalid:ring-red-400/20 data-placeholder:text-neutral-400 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:border-zinc-800/75 dark:bg-black dark:focus-visible:border-zinc-500/25 dark:aria-invalid:ring-red-400/40 dark:data-placeholder:text-neutral-700 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 [&_svg:not([class*=\'text-\'])]:text-foreground', className )} data-slot={'select-trigger'} {...props}>
			{children}

			<SelectPrimitive.Icon asChild>
				<ChevronDownIcon className={'size-4 stroke-neutral-500 opacity-60 dark:stroke-neutral-400'} />
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	)
}

export function SelectContent({ className, children, position = 'item-aligned', align = 'center', ...props}: SelectContent) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content align={align} className={classNames('relative z-50 max-h-(--radix-select-content-available-height) min-w-32 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border-neutral-200/85 bg-background text-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 dark:bg-black', position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1', className )} data-slot={'select-content'} position={position} {...props}>
				<SelectScrollUpButton />

				<SelectPrimitive.Viewport className={classNames('p-1', position === 'popper' && 'h-[(--radix-select-trigger-height)] w-full min-w-[(--radix-select-trigger-width)] scroll-my-1')}>
					{children}
				</SelectPrimitive.Viewport>

				<SelectScrollDownButton />
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	)
}

export function SelectLabel({ className, ...props }: SelectLabel) {
	return <SelectPrimitive.Label className={classNames('flex items-center gap-1 px-2 py-1.5 text-2xs font-semibold text-neutral-400 uppercase dark:text-neutral-400/65 [&_svg]:size-3', className)} data-slot={'select-label'} {...props} />
}

export function SelectItem({ className, children, ...props }: SelectItem) {
	return (
		<SelectPrimitive.Item className={classNames('relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-neutral-100/85 focus:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 dark:focus:bg-zinc-800/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 [&_svg:not([class*=\'text-\'])]:text-neutral-400 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2', className)} data-slot={'select-item'} {...props}>
			<Span className={'absolute right-2 flex size-3.5 items-center justify-center'} data-slot={'select-item-indicator'}>
				<SelectPrimitive.ItemIndicator>
					<CheckIcon className={'size-4 stroke-primary dark:stroke-white'} />
				</SelectPrimitive.ItemIndicator>
			</Span>
			
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	)
}

export function SelectSeparator({ className, ...props }: SelectSeparator) {
	return <SelectPrimitive.Separator className={classNames('pointer-events-none -mx-1 my-1 h-px bg-neutral-100/75 dark:bg-zinc-800/50', className)} data-slot={'select-separator'} {...props} />
}

export function SelectScrollUpButton({ className, ...props }: SelectScrollUpButton) {
	return (
		<SelectPrimitive.ScrollUpButton className={classNames('flex cursor-default items-center justify-center py-1', className)} data-slot={'select-scroll-up-button'} {...props}>
			<ChevronUpIcon className={'size-4'} />
		</SelectPrimitive.ScrollUpButton>
	)
}

export function SelectScrollDownButton({ className,...props }: SelectScrollDownButton) {
	return (
		<SelectPrimitive.ScrollDownButton className={classNames('flex cursor-default items-center justify-center py-1', className)} data-slot={'select-scroll-down-button'} {...props}>
			<ChevronDownIcon className={'size-4'} />
		</SelectPrimitive.ScrollDownButton>
	)
}

export function Textarea({ className, ...props }: Textarea) {
	return <textarea className={classNames('flex field-sizing-content min-h-22 w-full rounded-md border-[.100rem] border-neutral-200/85 bg-transparent p-2 text-base shadow-md shadow-black/5 transition-[color,box-shadow] outline-none placeholder:text-neutral-400 focus-visible:border-primary-500 focus-visible:shadow-none focus-visible:ring-3 focus-visible:ring-primary-500/5 focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-400 aria-invalid:ring-red-400/20 md:text-sm dark:border-zinc-800/75 dark:bg-black dark:placeholder:text-neutral-700 dark:focus-visible:border-zinc-500/25 dark:aria-invalid:ring-red-400/40', className)} data-slot={'form-textarea'} {...props} />
}
