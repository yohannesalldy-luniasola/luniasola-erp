'use client'

import type { DealByStage } from '@/app/system/growth/datasource/deal/action/query'
import type { ColumnTable } from '@/app/system/growth/datasource/deal/action/schema'

import { useRouter } from 'next/navigation'
import { useState }  from 'react'

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { updateStage } from '@/app/system/growth/datasource/deal/action/mutation'
import { Div, Span }   from '@/component/canggu/block'
import { Card }        from '@/component/canggu/card'
import { Small }       from '@/component/canggu/typography'
import { DealCard }    from '@/app/system/growth/datasource/deal/component/kanban/card'
import { DroppableStage } from '@/app/system/growth/datasource/deal/component/kanban/stage'

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
	const [ activeId, setActiveId ] = useState<string | null>(null)

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	)

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

	function handleDragStart(event: DragStartEvent) {
		setActiveId(event.active.id as string)
	}

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event

		setActiveId(null)

		if (!over) return

		const dealId = active.id as string
		const newStage = over.id as string

		// Find the current deal to check if stage actually changed
		let currentDeal: ColumnTable | null = null
		for (const stageData of data) {
			const deal = stageData.deals.find(d => d.id === dealId)
			if (deal) {
				currentDeal = deal as ColumnTable
				break
			}
		}

		if (!currentDeal || currentDeal.stage === newStage) return

		await handleStageChange(dealId, newStage)
	}

	const activeDeal = activeId
		? (() => {
				for (const stageData of data) {
					const deal = stageData.deals.find(d => d.id === activeId)
					if (deal) return deal as ColumnTable & { account : { id : string, name : string } | null }
				}
				return null
			})()
		: null

	return (
		<DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
			<Div className={'flex h-full gap-3 overflow-x-auto p-4'}>
				{data.map((stageData) => (
					<DroppableStage
						key={stageData.stage}
						stage={stageData.stage}
						deals={stageData.deals}
						total={stageData.total}
						updating={updating}
						onStageChange={handleStageChange}
					/>
				))}
			</Div>

			<DragOverlay>
				{activeDeal ? (
					<Card className={'border border-neutral-200 bg-white p-4 shadow-lg opacity-95 dark:border-zinc-700 dark:bg-zinc-950'}>
						<Div className={'mb-3 flex items-start justify-between'}>
							<Div className={'flex-1'}>
								<Span className={'block text-sm leading-tight font-semibold text-neutral-900 dark:text-neutral-100'}>{activeDeal.name}</Span>
								<Small className={'mt-1 block text-xs text-neutral-500 dark:text-neutral-400'}>{activeDeal.account?.name || 'No Account'}</Small>
							</Div>
						</Div>
						<Div className={'mb-3'}>
							<Span className={'text-sm font-bold text-neutral-900 dark:text-neutral-100'}>
								{formatCurrency(Number(activeDeal.amount) || 0)}
							</Span>
						</Div>
					</Card>
				) : null}
			</DragOverlay>
		</DndContext>
	)
}

