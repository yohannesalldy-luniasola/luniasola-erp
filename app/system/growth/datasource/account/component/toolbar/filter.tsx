'use client'

import type { ChangeEvent } from 'react'

import { useSearchParams } from 'next/navigation'

import { useState, useCallback } from 'react'

import { CircleUserRound } from 'lucide-react'

import { ToolbarFilter as ToolbarFilterRoot, useToolbarFilter }                                  from '@/app/system/component/toolbar/filter'
import { LABEL }                                                                                 from '@/app/system/growth/datasource/account/action/schema'
import { Span }                                                                                  from '@/component/canggu/block'
import { Fieldset, Label, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/component/canggu/form'
import { useTableFilter, useTableFilterClear }                                                   from '@/component/hook/table'
import { classNames }                                                                            from '@/component/utility/style'

const STATUS = [ 
	{
		value : 'active',
		label : 'Active', 
		color : 'bg-emerald-500',
	}, { 
		value : 'inactive',
		label : 'Inactive', 
		color : 'bg-neutral-400',
	},
] as const

export function ToolbarFilter() {
	const searchParams 				 	 	= useSearchParams()
	const [ filterName, setFilterName ]    	= useState<string>(searchParams.get('query')  ?? '')
	const [ filterStatus, setFilterStatus ] = useState<string>(searchParams.get('status') ?? '')
	const toolbarFilter 	 	 	 	 	= useToolbarFilter()
	const tableFilter 	 	 	 	 	 	= useTableFilter()

	const performQueryChange  = useCallback((value: string) => setFilterName(value), [])
	const performQueryKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault()

			const value = (event.target as HTMLInputElement).value

			tableFilter.perform({ query : value || null, status : filterStatus || null })
		}
	}, [ tableFilter, filterStatus ])

	const performStatusChange = useCallback((value: string) => {
		const status = value === 'all' ? '' : value

		setFilterStatus(status)

		tableFilter.perform({ query : filterName || null, status : status || null })
	}, [ tableFilter, filterName ])

	const performClear  = useTableFilterClear({ filterName : setFilterName, filterStatus : setFilterStatus })
	const performFilter = useCallback(() => tableFilter.perform({ query : filterName || null, status : filterStatus || null }), [ tableFilter, filterName, filterStatus ])

	return (
		<ToolbarFilterRoot filters={[ 'query', 'status' ]} open={toolbarFilter.open} pending={tableFilter.pending} title={'Filter'} onClear={performClear} onFilter={performFilter} onOpenChange={toolbarFilter.setOpen}>
			<Fieldset>
				<Label>{LABEL} Name</Label>
				<Input adornment={<CircleUserRound className={'size-3.5'} />} name={'query'} placeholder={'Search'} type={'text'} value={filterName} onChange={(event: ChangeEvent<HTMLInputElement>) => performQueryChange(event.target.value)} onKeyDown={performQueryKeyDown} />
			</Fieldset>

			<Fieldset>
				<Label>Status</Label>
				<Select value={filterStatus || 'all'} onValueChange={performStatusChange}>
					<SelectTrigger className={'w-full'}>
						<SelectValue placeholder={'All Status'} />
					</SelectTrigger>

					<SelectContent align={'start'} position={'popper'} sideOffset={5}>
						<SelectItem value={'all'}>All Status</SelectItem>

						{
							STATUS.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									<Span className={'flex items-center gap-1.75'}>
										<Span className={classNames('size-2 rounded-full', option.color)} />
										{option.label}
									</Span>
								</SelectItem>
							))
						}
					</SelectContent>
				</Select>
			</Fieldset>
		</ToolbarFilterRoot>
	)
}

export { ToolbarFilterFallback } from '@/app/system/component/toolbar/filter'
