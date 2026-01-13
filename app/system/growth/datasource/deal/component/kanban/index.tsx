'use client'

import type { DealByStage } from '@/app/system/growth/datasource/deal/action/query'
import type { ColumnTable } from '@/app/system/growth/datasource/deal/action/schema'

import { useRouter } from 'next/navigation'
import { useState }  from 'react'

import { updateStage } from '@/app/system/growth/datasource/deal/action/mutation'
import { Div, Span }   from '@/component/canggu/block'
import { Card }        from '@/component/canggu/card'
import { Small }       from '@/component/canggu/typography'
import { DealCard }    from '@/app/system/growth/datasource/deal/component/kanban/card'

type KanbanProps = {
	readonly data : readonly DealByStage[]
}

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('id-ID', {
		style                 : 'currency',
		currency              : 'IDR',
		minimumFractionDigits : 0,
		maximumFractionDigits : 0,
	}).format(amount)
}

export function Kanban({ data }: KanbanProps) {
	const router = useRouter()
	const [ updating, setUpdating ] = useState<string | null>(null)

	async function handleStageChange(dealId: string, newStage: string) {
		setUpdating(dealId)

		try {
			const result = await updateStage(dealId, newStage)

			if (result.status === 'success')
				router.refresh()
		} catch (error) {
			console.error('Failed to update stage:', error)
		} finally {
			setUpdating(null)
		}
	}

	return (
		<Div className={'flex h-full gap-3 overflow-x-auto p-4'}>
			{data.map((stageData) => (
				<Div key={stageData.stage} className={'flex min-w-[280px] flex-col rounded-lg border border-neutral-200 bg-neutral-50/50 dark:border-zinc-800 dark:bg-zinc-900/30'}>
					<Div className={'shrink-0 border-b border-neutral-200 bg-white/80 p-3 dark:border-zinc-800 dark:bg-zinc-950/50'}>
						<Div className={'mb-1 flex items-center justify-between'}>
							<Span className={'text-sm font-semibold text-neutral-900 dark:text-neutral-100'}>{stageData.stage}</Span>
							<Span className={'rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:bg-zinc-800 dark:text-zinc-300'}>{stageData.deals.length}</Span>
						</Div>
						<Small className={'text-xs font-medium text-neutral-600 dark:text-neutral-400'}>
							{formatCurrency(stageData.total)}
						</Small>
					</Div>

					<Div className={'flex flex-1 flex-col gap-2 overflow-y-auto p-3'}>
						{stageData.deals.length === 0 ? (
							<Div className={'flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100/50 dark:border-zinc-700 dark:bg-zinc-800/30'}>
								<Span className={'text-sm text-neutral-400 dark:text-neutral-500'}>Drop items here</Span>
							</Div>
						) : (
							stageData.deals.map((deal) => (
								<DealCard
									key={deal.id}
									deal={deal as ColumnTable & { account : { id : string, name : string } | null }}
									isUpdating={updating === deal.id}
									onStageChange={handleStageChange}
								/>
							))
						)}
					</Div>
				</Div>
			))}
		</Div>
	)
}

