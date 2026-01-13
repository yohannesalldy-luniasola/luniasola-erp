'use client'

import type { DealByStage } from '@/app/system/growth/datasource/deal/action/schema'
import type { ColumnTable } from '@/app/system/growth/datasource/deal/action/schema'

import { useRouter } from 'next/navigation'

import { useState } from 'react'

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { CheckCircle }                                                                                 from 'lucide-react'
import { toast }                                                                                       from 'sonner'

import { updateStage }     from '@/app/system/growth/datasource/deal/action/mutation'
import { STAGE_VALUES }    from '@/app/system/growth/datasource/deal/action/schema'
import { FormCreateStage } from '@/app/system/growth/datasource/deal/component/kanban/form'
import { DroppableStage }  from '@/app/system/growth/datasource/deal/component/kanban/stage'
import { Div, Span }       from '@/component/canggu/block'
import { Button }          from '@/component/canggu/button'
import { Card }            from '@/component/canggu/card'
import {
	DialogAlert,
	DialogAlertAction,
	DialogAlertCancel,
	DialogAlertContent,
	DialogAlertDescription,
	DialogAlertFooter,
	DialogAlertHeader,
	DialogAlertTitle,
}                                                                                                      from '@/component/canggu/dialog'
import { Small }           from '@/component/canggu/typography'

type KanbanProps = {
	readonly data    : readonly DealByStage[]
	readonly account : readonly { id : string, name : string, status : string | null }[]
	readonly people  : readonly { id : string, name : string }[]
}

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('id-ID', {
		style                 : 'currency',
		currency              : 'IDR',
		minimumFractionDigits : 0,
		maximumFractionDigits : 0,
	}).format(amount)
}

export function Kanban({ data, account, people }: KanbanProps) {
	const router = useRouter()
	const [ updating, setUpdating ] = useState<string | null>(null)
	const [ activeId, setActiveId ] = useState<string | null>(null)
	const [ selectedStage, setSelectedStage ] = useState<typeof STAGE_VALUES[number] | null>(null)
	const [ formOpen, setFormOpen ] = useState(false)
	const [ wonConfirmOpen, setWonConfirmOpen ] = useState(false)
	const [ pendingWonChange, setPendingWonChange ] = useState<{ dealId: string, newStage: string } | null>(null)

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint : {
				distance : 8,
			},
		}),
	)

	function handleAddClick(stage: typeof STAGE_VALUES[number]) {
		setSelectedStage(stage)
		setFormOpen(true)
	}

	function handleFormClose(open: boolean) {
		setFormOpen(open)
		if (!open) {
			setSelectedStage(null)
			router.refresh()
		}
	}

	async function handleStageChange(dealId: string, newStage: string, showToast = false) {
		setUpdating(dealId)

		let toastId: string | number | null = null

		if (showToast && newStage === 'Won') {
			toastId = toast.loading('Sending data to Google...', {
				description : 'Updating deal status and syncing with Google',
				duration    : Infinity,
			})
		}

		try {
			const result = await updateStage(dealId, newStage)

			if (result.status === 'success') {
				if (toastId) {
					toast.success('Status updated successfully', {
						description : 'Deal status has been synced with Google',
						id          : toastId,
					})
				}

				router.refresh()
			} else if (result.status === 'error') {
				if (toastId) {
					toast.error('Update failed', {
						description : result.message || 'Failed to sync with Google',
						id          : toastId,
					})
				}
			}
		} catch (error) {
			console.error('Failed to update stage:', error)

			if (toastId) {
				toast.error('Update failed', {
					description : 'Failed to sync with Google',
					id          : toastId,
				})
			}
		} finally {
			setUpdating(null)
		}
	}

	async function handleConfirmWon() {
		if (!pendingWonChange) return

		setWonConfirmOpen(false)
		await handleStageChange(pendingWonChange.dealId, pendingWonChange.newStage, true)
		setPendingWonChange(null)
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

		// Check if moving to "Won" stage
		if (newStage === 'Won') {
			setPendingWonChange({ dealId, newStage })
			setWonConfirmOpen(true)
		} else {
			await handleStageChange(dealId, newStage)
		}
	}

	const activeDeal = activeId
		? (() => {
			for (const stageData of data) {
				const deal = stageData.deals.find(d => d.id === activeId)

				if (deal)
					return deal

				return null
			}
		})()
		: null

	return (
		<>
			<DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
				<Div className={'flex h-full gap-3 overflow-x-auto p-4'}>
					{data.map((stageData) => (
						<DroppableStage
							deals={stageData.deals}
							key={stageData.stage}
							stage={stageData.stage}
							total={stageData.total}
							updating={updating}
							onAddClick={handleAddClick}
							onStageChange={handleStageChange}
						/>
					))}
				</Div>

				<DragOverlay>
					{activeDeal ? (
						<Card className={'border border-neutral-200 bg-white p-4 opacity-95 shadow-lg dark:border-zinc-700 dark:bg-zinc-950'}>
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

			<FormCreateStage
				account={account}
				defaultStage={selectedStage}
				open={formOpen}
				people={people}
				onOpenChange={handleFormClose}
			/>

			<DialogAlert open={wonConfirmOpen} onOpenChange={setWonConfirmOpen}>
				<DialogAlertContent className={'sm:max-w-md'} overlay={true}>
					<DialogAlertHeader>
						<DialogAlertTitle>
							<CheckCircle className={'text-emerald-500'} strokeWidth={2.500} /> Move to Won Stage
						</DialogAlertTitle>
						<DialogAlertDescription>
							Are you sure you want to change the stage status to &quot;Won&quot;? This action will sync the data with Google.
						</DialogAlertDescription>
					</DialogAlertHeader>

					<DialogAlertFooter>
						<DialogAlertCancel asChild>
							<Button appearance={'ghost'} className={'font-normal'} shape={'ellipse'} size={'sm'} type={'button'} onClick={() => setPendingWonChange(null)}>
								Cancel
							</Button>
						</DialogAlertCancel>

						<DialogAlertAction asChild>
							<Button appearance={'primary'} shape={'ellipse'} size={'sm'} type={'button'} onClick={handleConfirmWon}>
								Confirm
							</Button>
						</DialogAlertAction>
					</DialogAlertFooter>
				</DialogAlertContent>
			</DialogAlert>
		</>
	)
}
