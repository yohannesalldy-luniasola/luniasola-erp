'use client'

import type { FormEvent, ReactNode, Dispatch, SetStateAction } from 'react'

import { useSearchParams } from 'next/navigation'

import { useCallback, useRef, useState, useMemo, useContext, createContext, useTransition } from 'react'

import { ListFilter, ListRestart, Loader2 } from 'lucide-react'
import { motion }                           from 'motion/react'

import { Div, Span }                                                          from '@/component/canggu/block'
import { Button }                                                             from '@/component/canggu/button'
import { Form }                                                               from '@/component/canggu/form'
import { Popover, PopoverContent, PopoverCard, PopoverLabel, PopoverTrigger } from '@/component/canggu/popover'
import { Skeleton }                                                           from '@/component/canggu/skeleton'
import { useTableFilter }                                                     from '@/component/hook/table'
import { classNames }                                                         from '@/component/utility/style'

type ToolbarFilter = {
	readonly title         : string
	readonly filters       : readonly string[]
	readonly children      : ReactNode
	readonly onClear       : () => void
	readonly onFilter?     : () => void
	readonly pending?      : boolean
	readonly open?         : boolean
	readonly onOpenChange? : (open: boolean) => void
}

type ToolbarFilterFallback = {
	readonly className? : string
}

type ToolbarFilterContext = {
	readonly open         : boolean
	readonly setOpen      : Dispatch<SetStateAction<boolean>>
	readonly performOpen  : () => void
	readonly performClose : () => void
}

type ToolbarFilterProvider = {
	readonly children : ReactNode
}

export const ToolbarFilterContext = createContext<ToolbarFilterContext | null>(null)

export function useToolbarFilter() {
	const context = useContext(ToolbarFilterContext)

	if (!context)
		throw new Error('useToolbarFilter must be invoked within a ToolbarFilterProvider context')

	return context
}

export function ToolbarFilterProvider({ children }: ToolbarFilterProvider) {
	const [ open, setOpen ] = useState(false)

	const performOpen  = useCallback(() => setOpen(true), [])
	const performClose = useCallback(() => setOpen(false), [])

	const value = useMemo(() => ({ open, setOpen, performOpen, performClose }), [ open, performOpen, performClose ])

	return (
		<ToolbarFilterContext value={value}>
			{children}
		</ToolbarFilterContext>
	)
}

export function ToolbarFilter({ title, filters, children, onClear, onFilter, open, onOpenChange, pending }: ToolbarFilter) {
	const searchParams 	 	 	 	 	 	 	 	= useSearchParams()
	const [ filterPendingClear, startPendingClear ] = useTransition()
	const formRef 	   		 		  		 	 	= useRef<HTMLFormElement>(null)
	const tableFilter 	 	 	 	 	 	 	 	= useTableFilter()
	
	const filterPending = pending ?? tableFilter.pending

	const active = filters.some((key) => {
		const value = searchParams.get(key)

		return value !== null && value !== undefined && value !== '' && value !== 'all'
	})

	const performFilter = useCallback(() => {
		if (onFilter) {
			onFilter()

			return
		}

		if (!formRef.current)
			return

		const formData = new FormData(formRef.current)
		const values: Record<string, string | null> = {}

		filters.forEach((key) => {
			const value = formData.get(key)
            
			if (typeof value === 'string' && value.trim() !== '')
				values[key] = value
			else
				values[key] = null
		})

		tableFilter.perform(values)
	}, [ tableFilter, filters, onFilter ])

	const performClear = useCallback(() => {
		startPendingClear(() => {
			onClear()
        
			if (formRef.current)
				formRef.current.reset()

			tableFilter.clear(filters)
		})
	}, [ tableFilter, filters, onClear, startPendingClear ])

	const performSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		performFilter()
	}, [ performFilter ])

	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>
				<Button appearance={'ghost'} className={'relative px-1 text-sm md:px-2'} shape={'ellipse'} size={'xs'}>
					<ListFilter className={'size-3.5'} strokeWidth={1.500} /> 
					<Span className={'hidden sm:block'}>Filter</Span>
					
					{
						active && (
							<Div className={'absolute top-0.5 right-0.5 flex size-1.5 items-center justify-center'}>
								<motion.span animate={{ scale : [ .800, 3.500 ], opacity : [ .000, .600, .000 ] }} className={'absolute inset-0 rounded-full bg-primary-300'} initial={{ opacity : .000, scale : .800 }} transition={{ duration : 2.000, repeat : Infinity, ease : 'easeInOut'  }} />
								<Span className={'relative z-10 size-1.5 rounded-full bg-primary'} />
							</Div>
						)
					}
				</Button>
			</PopoverTrigger>

			<PopoverContent align={'start'} className={'w-64'}>
				<PopoverCard>
					<PopoverLabel>{title}</PopoverLabel>

					<Form ref={formRef} onSubmit={performSubmit}>
						{children}

						<Div className={'flex justify-end gap-2 border-t border-neutral-100 pt-3 dark:border-zinc-800'}>
							<Button appearance={'ghost'} className={'w-full text-xs'} disabled={filterPendingClear || filterPending} icon={true} shape={'ellipse'} size={'sm'} type={'button'} onClick={performClear}>
								{filterPendingClear ? <Loader2 className={'size-3.5! animate-spin'} /> : <ListRestart className={'size-3.5!'} />} {filterPendingClear ? 'Clearing' : 'Clear'}
							</Button>

							<Button appearance={'primary'} className={'w-full text-xs'} disabled={filterPending || filterPendingClear} shape={'ellipse'} size={'sm'} type={'submit'}>
								{filterPending ? <Loader2 className={'size-3.5! animate-spin'} /> : <ListFilter className={'size-3.5!'} />} {filterPending ? 'Applying' : 'Apply'}
							</Button>
						</Div>
					</Form>
				</PopoverCard>
			</PopoverContent>
		</Popover>
	)
}

export function ToolbarFilterFallback({ className }: ToolbarFilterFallback) {
	return <Skeleton className={classNames('h-6 w-18', className)} />
}
