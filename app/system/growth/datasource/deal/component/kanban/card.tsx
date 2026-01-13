'use client'

import type { ColumnTable } from '@/app/system/growth/datasource/deal/action/schema'

import { Edit, Trash2, MoreVertical } from 'lucide-react'

import { STAGE_VALUES } from '@/app/system/growth/datasource/deal/action/schema'
import { Div, Span }    from '@/component/canggu/block'
import { Button }       from '@/component/canggu/button'
import { Card }         from '@/component/canggu/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
}                                                                                           from '@/component/canggu/dropdown'
import { Small } from '@/component/canggu/typography'

type DealCardProps = {
	readonly deal          : ColumnTable & { account : { id : string, name : string } | null }
	readonly isUpdating?   : boolean
	readonly onStageChange : (dealId: string, newStage: string) => Promise<void>
}

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('id-ID', {
		style                 : 'currency',
		currency              : 'IDR',
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
		default:
			return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
	}
}

export function DealCard({ deal, isUpdating, onStageChange }: DealCardProps) {
	const accountName = deal.account?.name || 'No Account'
	const amount = Number(deal.amount) || 0

	return (
		<Card className={'border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-950' + (isUpdating ? ' opacity-50' : '')}>
			<Div className={'mb-3 flex items-start justify-between'}>
				<Div className={'flex-1'}>
					<Span className={'block text-sm leading-tight font-semibold text-neutral-900 dark:text-neutral-100'}>{deal.name}</Span>
					<Small className={'mt-1 block text-xs text-neutral-500 dark:text-neutral-400'}>{accountName}</Small>
				</Div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button appearance={'ghost'} className={'size-6 p-0'} size={'sm'}>
							<MoreVertical className={'size-3.5'} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align={'end'}>
						<Div className={'max-h-48 overflow-y-auto'}>
							{STAGE_VALUES.filter(stage => stage !== deal.stage).map((stage) => (
								<DropdownMenuItem
									disabled={isUpdating}
									key={stage}
									onClick={() => onStageChange(deal.id, stage)}
								>
									Move to {stage}
								</DropdownMenuItem>
							))}
						</Div>
					</DropdownMenuContent>
				</DropdownMenu>
			</Div>

			<Div className={'mb-3'}>
				<Span className={'text-sm font-bold text-neutral-900 dark:text-neutral-100'}>
					{formatCurrency(amount)}
				</Span>
			</Div>

			<Div className={'flex items-center justify-between'}>
				<Span className={'inline-flex rounded-full px-2 py-0.5 text-xs font-medium ' + getSourceColor(deal.source)}>
					{deal.source}
				</Span>
				<Div className={'flex gap-1'}>
					<Button appearance={'ghost'} className={'size-6 p-0'} size={'sm'}>
						<Edit className={'size-3'} />
					</Button>
					<Button appearance={'ghost'} className={'size-6 p-0 text-red-500 hover:text-red-600'} size={'sm'}>
						<Trash2 className={'size-3'} />
					</Button>
				</Div>
			</Div>
		</Card>
	)
}
