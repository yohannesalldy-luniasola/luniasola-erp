'use client'

import type { SchemaSearchParam } from '@/app/system/growth/analytics/metrics/action/schema'

import { useRouter, useSearchParams } from 'next/navigation'

import { useCallback, useState } from 'react'

import { Filter } from 'lucide-react'

import { Div, Span }                                                                             from '@/component/canggu/block'
import { Button }                                                                                from '@/component/canggu/button'
import { Card }                                                                                  from '@/component/canggu/card'
import { Fieldset, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/component/canggu/form'

export function Filters({ params }: { readonly params : SchemaSearchParam }) {
	const router = useRouter()
	const searchParams = useSearchParams()
	
	const [ dateFrom, setDateFrom ] = useState<string>(params.dateFrom || '')
	const [ dateTo, setDateTo ] = useState<string>(params.dateTo || '')
	const [ campaign, setCampaign ] = useState<string>(params.campaign || '')
	const [ channel, setChannel ] = useState<string>(params.channel || 'all')

	const handleFilter = useCallback(() => {
		const newParams = new URLSearchParams(searchParams.toString())

		if (dateFrom)
			newParams.set('dateFrom', dateFrom)
		else
			newParams.delete('dateFrom')

		if (dateTo)
			newParams.set('dateTo', dateTo)
		else
			newParams.delete('dateTo')

		if (campaign)
			newParams.set('campaign', campaign)
		else
			newParams.delete('campaign')

		if (channel && channel !== 'all')
			newParams.set('channel', channel)
		else
			newParams.delete('channel')

		router.push('?' + newParams.toString())
	}, [ dateFrom, dateTo, campaign, channel, router, searchParams ])

	const handleClear = useCallback(() => {
		setDateFrom('')
		setDateTo('')
		setCampaign('')
		setChannel('all')
		router.push('/system/growth/analytics/metrics')
	}, [ router ])

	return (
		<Card className={'p-4'}>
			<Div className={'mb-4 flex items-center gap-2'}>
				<Filter className={'size-4'} />
				<Span className={'text-sm font-semibold'}>Filters</Span>
			</Div>

			<Div className={'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'}>
				<Fieldset>
					<Label htmlFor={'dateFrom'}>Date From</Label>
					<Input
						id={'dateFrom'}
						type={'date'}
						value={dateFrom}
						onChange={(e) => setDateFrom(e.target.value)}
					/>
				</Fieldset>

				<Fieldset>
					<Label htmlFor={'dateTo'}>Date To</Label>
					<Input
						id={'dateTo'}
						type={'date'}
						value={dateTo}
						onChange={(e) => setDateTo(e.target.value)}
					/>
				</Fieldset>

				<Fieldset>
					<Label htmlFor={'campaign'}>Campaign</Label>
					<Input
						id={'campaign'}
						placeholder={'Filter by campaign'}
						type={'text'}
						value={campaign}
						onChange={(e) => setCampaign(e.target.value)}
					/>
				</Fieldset>

				<Fieldset>
					<Label htmlFor={'channel'}>Channel</Label>
					<Select value={channel || 'all'} onValueChange={setChannel}>
						<SelectTrigger id={'channel'}>
							<SelectValue placeholder={'All Channels'} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={'all'}>All Channels</SelectItem>
							<SelectItem value={'google'}>Google</SelectItem>
							<SelectItem value={'facebook'}>Facebook (Meta Ads)</SelectItem>
						</SelectContent>
					</Select>
				</Fieldset>
			</Div>

			<Div className={'mt-4 flex gap-2'}>
				<Button size={'sm'} onClick={handleFilter}>
					Apply Filters
				</Button>
				<Button appearance={'ghost'} size={'sm'} onClick={handleClear}>
					Clear
				</Button>
			</Div>
		</Card>
	)
}
