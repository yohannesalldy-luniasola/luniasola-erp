'use client'

import type { ColumnTable } from '@/app/system/growth/datasource/deal/action/schema'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { Div, Span } from '@/component/canggu/block'
import { Card }      from '@/component/canggu/card'
import { Small }     from '@/component/canggu/typography'
import { DealCard }  from '@/app/system/growth/datasource/deal/component/kanban/card'

type DroppableStageProps = {
	readonly stage         : string
	readonly deals         : readonly (ColumnTable & { account : { id : string, name : string } | null })[]
	readonly total         : number
	readonly updating      : string | null
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

export function DroppableStage({ stage, deals, total, updating, onStageChange }: DroppableStageProps) {
	const { setNodeRef, isOver } = useDroppable({
		id: stage,
	})

	return (
		<Div
			ref={setNodeRef}
			className={'flex min-w-[280px] flex-col rounded-lg border border-neutral-200 bg-neutral-50/50 transition-colors dark:border-zinc-800 dark:bg-zinc-900/30 ' + (isOver ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20' : '')}
		>
			<Div className={'shrink-0 border-b border-neutral-200 bg-white/80 p-3 dark:border-zinc-800 dark:bg-zinc-950/50'}>
				<Div className={'mb-1 flex items-center justify-between'}>
					<Span className={'text-sm font-semibold text-neutral-900 dark:text-neutral-100'}>{stage}</Span>
					<Span className={'rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:bg-zinc-800 dark:text-zinc-300'}>{deals.length}</Span>
				</Div>
				<Small className={'text-xs font-medium text-neutral-600 dark:text-neutral-400'}>
					{formatCurrency(total)}
				</Small>
			</Div>

			<Div className={'flex flex-1 flex-col gap-2 overflow-y-auto p-3'}>
				{deals.length === 0 ? (
					<Div className={'flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100/50 dark:border-zinc-700 dark:bg-zinc-800/30'}>
						<Span className={'text-sm text-neutral-400 dark:text-neutral-500'}>Drop items here</Span>
					</Div>
				) : (
					<SortableContext items={deals.map(deal => deal.id)} strategy={verticalListSortingStrategy}>
						{deals.map((deal) => (
							<DealCard
								key={deal.id}
								deal={deal}
								isUpdating={updating === deal.id}
								onStageChange={onStageChange}
							/>
						))}
					</SortableContext>
				)}
			</Div>
		</Div>
	)
}

