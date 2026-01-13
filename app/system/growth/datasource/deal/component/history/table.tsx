'use client'

import type { ColumnTable } from '@/app/system/growth/datasource/deal/action/schema'

import { Building2, Calendar } from 'lucide-react'

import { Div, Span } from '@/component/canggu/block'
import { Card } from '@/component/canggu/card'
import { Small } from '@/component/canggu/typography'
import { format } from 'date-fns'

type HistoryTableProps = {
	readonly data : readonly (ColumnTable & { account : { id : string, name : string } | null })[]
}

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('id-ID', {
		style    : 'currency',
		currency : 'IDR',
		minimumFractionDigits : 0,
		maximumFractionDigits : 0,
	}).format(amount)
}

function getSourceColor(source: string): string {
	switch (source) {
		case 'Google Ads':
			return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
		case 'Upwork':
			return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
		case 'Referral':
			return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
		case 'Meta Ads':
			return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
		default:
			return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
	}
}

export function HistoryTable({ data }: HistoryTableProps) {
	if (data.length === 0)
		return (
			<Div className={'flex items-center justify-center py-12'}>
				<Small className={'text-neutral-500'}>No lost deals found</Small>
			</Div>
		)

	return (
		<Div className={'space-y-3'}>
			{data.map((deal) => {
				const accountName = deal.account?.name || 'No Account'
				const amount = Number(deal.amount) || 0

				return (
					<Card key={deal.id} className={'border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-950'}>
						<Div className={'mb-3 flex items-start justify-between'}>
							<Div className={'flex-1'}>
								<Span className={'block text-base font-semibold text-neutral-900 dark:text-neutral-100'}>{deal.name}</Span>
								<Div className={'mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400'}>
									{deal.account ? (
										<Div className={'flex items-center gap-1.5'}>
											<Building2 className={'size-3'} />
											<Span>{accountName}</Span>
										</Div>
									) : (
										<Span>No Account</Span>
									)}
									<Span className={'text-neutral-300 dark:text-neutral-600'}>•</Span>
									<Div className={'flex items-center gap-1.5'}>
										<Calendar className={'size-3'} />
										<Span>{format(new Date(deal.date_creation), 'dd MMM yyyy')}</Span>
									</Div>
								</Div>
							</Div>
						</Div>

						<Div className={'mb-3'}>
							<Span className={'text-lg font-bold text-neutral-900 dark:text-neutral-100'}>
								{formatCurrency(amount)}
							</Span>
						</Div>

						<Div className={'flex items-center justify-between'}>
							<Span className={'inline-flex rounded-full px-2.5 py-1 text-xs font-medium ' + getSourceColor(deal.source)}>
								{deal.source}
							</Span>
						</Div>
					</Card>
				)
			})}
		</Div>
	)
}

