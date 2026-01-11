'use client'

import type { ChangeEvent, KeyboardEvent } from 'react'

import { useSearchParams } from 'next/navigation'

import { useState, useCallback } from 'react'

import { UserRound, Mail } from 'lucide-react'

import { ToolbarFilter as ToolbarFilterRoot, useToolbarFilter } from '@/app/system/component/toolbar/filter'
import { Fieldset, Label, Input }                               from '@/component/canggu/form'
import { useTableFilter, useTableFilterClear }                  from '@/component/hook/table'

export function ToolbarFilter() {
	const searchParams 				 	  = useSearchParams()
	const [ filterName, setFilterName ]   = useState<string>(searchParams.get('query') ?? '')
	const [ filterEmail, setFilterEmail ] = useState<string>(searchParams.get('email') ?? '')
	const toolbarFilter 	 	 	 	  = useToolbarFilter()
	const tableFilter 	 	 	 	 	  = useTableFilter()

	const performQueryChange  = useCallback((value: string) => setFilterName(value), [])
	const performEmailChange  = useCallback((value: string) => setFilterEmail(value), [])
	const performQueryKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault()

			tableFilter.perform({ query : filterName || null, email : filterEmail || null })
		}
	}, [ tableFilter, filterName, filterEmail ])

	const performClear  = useTableFilterClear({ filterName : setFilterName })
	const performFilter = useCallback(() => tableFilter.perform({ query : filterName || null }), [ tableFilter, filterName ])

	return (
		<ToolbarFilterRoot filters={[ 'query', 'status' ]} open={toolbarFilter.open} pending={tableFilter.pending} title={'Filter'} onClear={performClear} onFilter={performFilter} onOpenChange={toolbarFilter.setOpen}>
			<Fieldset>
				<Label>Name</Label>
				<Input adornment={<UserRound className={'size-3.5'} strokeWidth={2.350} />} name={'query'} placeholder={'Search'} type={'text'} value={filterName} onChange={(event: ChangeEvent<HTMLInputElement>) => performQueryChange(event.target.value)} onKeyDown={performQueryKeyDown} />
			</Fieldset>

			<Fieldset>
				<Label>Email Address</Label>
				<Input adornment={<Mail className={'size-3.5'} />} name={'query'} type={'text'} value={filterEmail} onChange={(event: ChangeEvent<HTMLInputElement>) => performEmailChange(event.target.value)} onKeyDown={performQueryKeyDown} />
			</Fieldset>
		</ToolbarFilterRoot>
	)
}

export { ToolbarFilterFallback } from '@/app/system/component/toolbar/filter'
