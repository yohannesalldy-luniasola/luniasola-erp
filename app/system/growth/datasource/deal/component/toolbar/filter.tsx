'use client'

import type { SchemaSearchParam } from '@/app/system/growth/datasource/deal/action/schema'

import { useRouter, useSearchParams } from 'next/navigation'

import { useCallback, useEffect, useState } from 'react'

import { Filter } from 'lucide-react'

import { SOURCE_VALUES, STAGE_VALUES }                                    from '@/app/system/growth/datasource/deal/action/schema'
import { Button }                                                         from '@/component/canggu/button'
import { Div, Span }                                                      from '@/component/canggu/block'
import { Fieldset, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/component/canggu/form'

type ToolbarFilterProps = {
	readonly params : SchemaSearchParam
	readonly account : readonly { id : string, name : string, status : string | null }[]
}

export function ToolbarFilter({ params, account }: ToolbarFilterProps) {
	const router = useRouter()
	const searchParams = useSearchParams()

	const [ stage, setStage ] = useState<string>(params.stage || '')
	const [ source, setSource ] = useState<string>((searchParams.get('source') as string) || '')
	const [ accountFilter, setAccountFilter ] = useState<string>((searchParams.get('account') as string) || '')

	useEffect(() => {
		setStage(params.stage || '')
		setSource((searchParams.get('source') as string) || '')
		setAccountFilter((searchParams.get('account') as string) || '')
	}, [ params.stage, searchParams ])

	const handleFilter = useCallback(() => {
		const newParams = new URLSearchParams(searchParams.toString())

		if (stage)
			newParams.set('stage', stage)
		else
			newParams.delete('stage')

		if (source)
			newParams.set('source', source)
		else
			newParams.delete('source')

		if (accountFilter)
			newParams.set('account', accountFilter)
		else
			newParams.delete('account')

		router.push('?' + newParams.toString())
	}, [ stage, source, accountFilter, router, searchParams ])

	const handleClear = useCallback(() => {
		setStage('')
		setSource('')
		setAccountFilter('')
		router.push('/system/growth/datasource/deal')
	}, [ router ])

	return (
		<Div className={'flex items-center gap-2'}>
			<Filter className={'size-4 text-neutral-500'} />
			<Span className={'text-xs text-neutral-500'}>Filter</Span>

			<Select value={stage || 'all'} onValueChange={(value) => setStage(value === 'all' ? '' : value)}>
				<SelectTrigger className={'h-7 w-32 text-xs'} id={'filter-stage'}>
					<SelectValue placeholder={'All Stages'} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={'all'}>All Stages</SelectItem>
					{STAGE_VALUES.map((s) => (
						<SelectItem key={s} value={s}>
							{s}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select value={source || 'all'} onValueChange={(value) => setSource(value === 'all' ? '' : value)}>
				<SelectTrigger className={'h-7 w-32 text-xs'} id={'filter-source'}>
					<SelectValue placeholder={'All Sources'} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={'all'}>All Sources</SelectItem>
					{SOURCE_VALUES.map((s) => (
						<SelectItem key={s} value={s}>
							{s}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select value={accountFilter || 'all'} onValueChange={(value) => setAccountFilter(value === 'all' ? '' : value)}>
				<SelectTrigger className={'h-7 w-40 text-xs'} id={'filter-account'}>
					<SelectValue placeholder={'All Accounts'} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={'all'}>All Accounts</SelectItem>
					{account.map((acc) => (
						<SelectItem key={acc.id} value={acc.id}>
							{acc.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Button appearance={'ghost'} className={'h-7 text-xs'} onClick={handleFilter} size={'sm'}>
				Apply
			</Button>
			<Button appearance={'ghost'} className={'h-7 text-xs'} onClick={handleClear} size={'sm'}>
				Clear
			</Button>
		</Div>
	)
}

