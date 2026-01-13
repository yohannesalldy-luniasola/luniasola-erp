'use client'

import type { ChangeEvent, KeyboardEvent } from 'react'

import { useSearchParams } from 'next/navigation'

import { useState, useCallback } from 'react'

import { Link, UserRound } from 'lucide-react'

import { ToolbarFilter as ToolbarFilterRoot, useToolbarFilter }                                  from '@/app/system/component/toolbar/filter'
import { Span }                                                                                  from '@/component/canggu/block'
import { Fieldset, Label, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/component/canggu/form'
import { useTableFilter, useTableFilterClear }                                                   from '@/component/hook/table'
import { classNames }                                                                            from '@/component/utility/style'

const STATUS = [ 
	{
		value : 'pending',
		label : 'Pending', 
		color : 'bg-yellow-500',
	}, { 
		value : 'in progress',
		label : 'In Progress', 
		color : 'bg-blue-500',
	}, { 
		value : 'cancelled',
		label : 'Cancelled', 
		color : 'bg-red-500',
	}, { 
		value : 'passed',
		label : 'Passed', 
		color : 'bg-emerald-500',
	},
] as const

const PIC_OPTIONS = [ 'sales1', 'sales2', 'sales3' ] as const

export function ToolbarFilter() {
	const searchParams 				 	  = useSearchParams()
	const [ filterName, setFilterName ]     = useState<string>(searchParams.get('query') ?? '')
	const [ filterGclid, setFilterGclid ]   = useState<string>(searchParams.get('gclid') ?? '')
	const [ filterFbclid, setFilterFbclid ] = useState<string>(searchParams.get('fbclid') ?? '')
	const [ filterStatus, setFilterStatus ] = useState<string>(searchParams.get('status') ?? '')
	const [ filterPic, setFilterPic ]      = useState<string>(searchParams.get('purchase_pic') ?? '')
	const toolbarFilter 	 	 	 	    = useToolbarFilter()
	const tableFilter 	 	 	 	 	    = useTableFilter()

	const performQueryChange  = useCallback((value: string) => setFilterName(value), [])
	const performGclidChange  = useCallback((value: string) => setFilterGclid(value), [])
	const performFbclidChange = useCallback((value: string) => setFilterFbclid(value), [])
	const performStatusChange = useCallback((value: string) => {
		const status = value === 'all' ? '' : value

		setFilterStatus(status)

		tableFilter.perform({ query : filterName || null, gclid : filterGclid || null, fbclid : filterFbclid || null, status : status || null, purchase_pic : filterPic || null })
	}, [ tableFilter, filterName, filterGclid, filterFbclid, filterPic ])
	const performPicChange = useCallback((value: string) => {
		const pic = value === 'all' ? '' : value

		setFilterPic(pic)

		tableFilter.perform({ query : filterName || null, gclid : filterGclid || null, fbclid : filterFbclid || null, status : filterStatus || null, purchase_pic : pic || null })
	}, [ tableFilter, filterName, filterGclid, filterFbclid, filterStatus ])
	const performQueryKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault()

			tableFilter.perform({ query : filterName || null, gclid : filterGclid || null, fbclid : filterFbclid || null, status : filterStatus || null, purchase_pic : filterPic || null })
		}
	}, [ tableFilter, filterName, filterGclid, filterFbclid, filterStatus, filterPic ])

	const performClear  = useTableFilterClear({ filterName : setFilterName, filterGclid : setFilterGclid, filterFbclid : setFilterFbclid, filterStatus : setFilterStatus, filterPic : setFilterPic })
	const performFilter = useCallback(() => tableFilter.perform({ query : filterName || null, gclid : filterGclid || null, fbclid : filterFbclid || null, status : filterStatus || null, purchase_pic : filterPic || null }), [ tableFilter, filterName, filterGclid, filterFbclid, filterStatus, filterPic ])

	return (
		<ToolbarFilterRoot filters={[ 'query', 'gclid', 'fbclid', 'status', 'purchase_pic' ]} open={toolbarFilter.open} pending={tableFilter.pending} title={'Filter'} onClear={performClear} onFilter={performFilter} onOpenChange={toolbarFilter.setOpen}>
			<Fieldset>
				<Label>Name</Label>
				<Input adornment={<UserRound className={'size-3.5'} strokeWidth={2.350} />} name={'query'} placeholder={'Search'} type={'text'} value={filterName} onChange={(event: ChangeEvent<HTMLInputElement>) => performQueryChange(event.target.value)} onKeyDown={performQueryKeyDown} />
			</Fieldset>

			<Fieldset>
				<Label>GCLID</Label>
				<Input adornment={<Link className={'size-3.5'} />} name={'gclid'} placeholder={'GCLID'} type={'text'} value={filterGclid} onChange={(event: ChangeEvent<HTMLInputElement>) => performGclidChange(event.target.value)} onKeyDown={performQueryKeyDown} />
			</Fieldset>

			<Fieldset>
				<Label>FBCLID</Label>
				<Input adornment={<Link className={'size-3.5'} />} name={'fbclid'} placeholder={'FBCLID'} type={'text'} value={filterFbclid} onChange={(event: ChangeEvent<HTMLInputElement>) => performFbclidChange(event.target.value)} onKeyDown={performQueryKeyDown} />
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

			<Fieldset>
				<Label>PIC</Label>
				<Select value={filterPic || 'all'} onValueChange={performPicChange}>
					<SelectTrigger className={'w-full'}>
						<SelectValue placeholder={'All PIC'} />
					</SelectTrigger>

					<SelectContent align={'start'} position={'popper'} sideOffset={5}>
						<SelectItem value={'all'}>All PIC</SelectItem>

						{
							PIC_OPTIONS.map((pic) => (
								<SelectItem key={pic} value={pic}>
									{pic}
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
