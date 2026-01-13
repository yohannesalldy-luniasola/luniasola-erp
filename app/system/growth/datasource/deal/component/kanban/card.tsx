'use client'

import type { ColumnTable } from '@/app/system/growth/datasource/deal/action/schema'

import { useRouter } from 'next/navigation'

import { useState, Suspense } from 'react'

import { useDraggable }               from '@dnd-kit/core'
import { CSS }                        from '@dnd-kit/utilities'
import { Edit, MoreVertical, Trash2 } from 'lucide-react'
import { toast }                      from 'sonner'

import { remove }           from '@/app/system/growth/datasource/deal/action/mutation'
import { STAGE_VALUES }     from '@/app/system/growth/datasource/deal/action/schema'
import { FormUpdateServer } from '@/app/system/growth/datasource/deal/component/form/server'
import { Div, Span }        from '@/component/canggu/block'
import { Button }           from '@/component/canggu/button'
import { Card }             from '@/component/canggu/card'
import {
	DialogAlert,
	DialogAlertAction,
	DialogAlertCancel,
	DialogAlertContent,
	DialogAlertDescription,
	DialogAlertFooter,
	DialogAlertHeader,
	DialogAlertTitle,
}                                                                                           from '@/component/canggu/dialog'
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
	const router = useRouter()
	const [ editOpen, setEditOpen ] = useState(false)
	const [ deleteOpen, setDeleteOpen ] = useState(false)
	const [ deleting, setDeleting ] = useState(false)

	const accountName = deal.account?.name || 'No Account'
	const amount = Number(deal.amount) || 0

	const {
		attributes,
		isDragging,
		listeners,
		setNodeRef,
		transform,
	} = useDraggable({
		id : deal.id,
	})

	const style = {
		opacity   : isDragging ? 0.5 : 1,
		transform : CSS.Translate.toString(transform),
	}

	const handleUpdate = async (id: string, data: Partial<ColumnTable>) => {
		// This is called before the form submission completes
		// The form will handle the actual update
		void id
		void data
	}

	async function handleDelete() {
		setDeleting(true)

		try {
			const result = await remove(deal.id)

			if (result.status === 'success') {
				toast.success(result.message)
				setDeleteOpen(false)
				router.refresh()
			} else if (result.status === 'error') {
				toast.error(result.message)
			}
		} catch (error) {
			toast.error('Failed to delete deal')
			console.error('Failed to delete deal:', error)
		} finally {
			setDeleting(false)
		}
	}

	return (
		<Card
			{...attributes}
			{...listeners}
			className={'cursor-grab border border-neutral-200 bg-white p-4 shadow-sm transition-shadow active:cursor-grabbing hover:shadow-md dark:border-zinc-700 dark:bg-zinc-950 ' + (isUpdating ? ' opacity-50' : '') + (isDragging ? ' ring-2 ring-primary-500' : '')}
			ref={setNodeRef}
			style={style}
		>
			<Div className={'mb-3 flex items-start justify-between'}>
				<Div className={'flex-1'}>
					<Span className={'block text-sm leading-tight font-semibold text-neutral-900 dark:text-neutral-100'}>{deal.name}</Span>
					<Small className={'mt-1 block text-xs text-neutral-500 dark:text-neutral-400'}>{accountName}</Small>
				</Div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							appearance={'ghost'}
							className={'size-6 p-0'}
							size={'sm'}
							onClick={(e) => {
								e.stopPropagation()
							}}
							onPointerDown={(e) => {
								e.stopPropagation()
							}}
						>
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
					{/* <Button
						appearance={'ghost'}
						className={'size-6 p-0'}
						size={'sm'}
						onClick={(e) => {
							e.stopPropagation()
							setEditOpen(true)
						}}
						onPointerDown={(e) => {
							e.stopPropagation()
						}}
					>
						<Edit className={'size-3'} />
					</Button> */}
					<Button
						appearance={'ghost'}
						className={'size-6 p-0 text-red-500 hover:text-red-600'}
						size={'sm'}
						onClick={(e) => {
							e.stopPropagation()
							setDeleteOpen(true)
						}}
						onPointerDown={(e) => {
							e.stopPropagation()
						}}
					>
						<Trash2 className={'size-3'} />
					</Button>
				</Div>
			</Div>

			{editOpen && (
				<Suspense fallback={null} key={deal.id + '-edit-' + editOpen}>
					<FormUpdateServer
						data={deal}
						open={editOpen}
						onOpenChange={(open) => {
							setEditOpen(open)
							if (!open)
								router.refresh()
						}}
						onUpdate={handleUpdate}
					/>
				</Suspense>
			)}

			<DialogAlert open={deleteOpen} onOpenChange={setDeleteOpen}>
				<DialogAlertContent className={'sm:max-w-md'} overlay={true}>
					<DialogAlertHeader>
						<DialogAlertTitle>
							<Trash2 className={'text-red-500'} strokeWidth={2.500} /> Remove Deal
						</DialogAlertTitle>
						<DialogAlertDescription>This action is permanent and cannot be reversed</DialogAlertDescription>
					</DialogAlertHeader>

					<DialogAlertFooter>
						<DialogAlertCancel asChild>
							<Button appearance={'ghost'} className={'font-normal'} shape={'ellipse'} size={'sm'} type={'button'}>Cancel</Button>
						</DialogAlertCancel>

						<DialogAlertAction asChild>
							<Button appearance={'destructive'} disabled={deleting} shape={'ellipse'} size={'sm'} type={'button'} onClick={handleDelete}>
								{deleting ? 'Removing...' : 'Remove'}
							</Button>
						</DialogAlertAction>
					</DialogAlertFooter>
				</DialogAlertContent>
			</DialogAlert>
		</Card>
	)
}
