'use client'

import type { ColumnTable } from '@/app/system/growth/datasource/people/action/schema'
import type { ReactNode }   from 'react'

import { useCallback } from 'react'

import { Mail, Flag, PenLine, Trash2, UserRound, Phone } from 'lucide-react'

import { useForm }                                                                                       from '@/app/system/component/form'
import { Table as TableRoot, TableSkeleton as TableSkeletonRoot }                                        from '@/app/system/component/table'
import { useToolbarFilter }                                                                              from '@/app/system/component/toolbar/filter'
import { remove, removeBatch }                                                                           from '@/app/system/growth/datasource/people/action/mutation'
import { TABLE_COLUMNS, TABLE_COLUMN_INITIAL, TABLE_COLUMN_LOCKED, SCHEMA_SEARCH_PARAMS_INITIAL, LABEL } from '@/app/system/growth/datasource/people/action/schema'
import { FormRemoval, FormUpdate }                                                                       from '@/app/system/growth/datasource/people/component/form'
import { Badge }                                                                                         from '@/component/canggu/badge'
import { Div, Span }                                                                                     from '@/component/canggu/block'
import { Button }                                                                                        from '@/component/canggu/button'
import { Tooltip, TooltipTrigger, TooltipContent }                                                       from '@/component/canggu/tooltip'
import { Small, ExtraSmall }                                                                             from '@/component/canggu/typography'
import { useKeyboard }                                                                                   from '@/component/hook/keyboard'
import { useTable, useTableColumnVisibility }                                                            from '@/component/hook/table'

export function Table({ data, account }: { readonly data : readonly ColumnTable[], readonly account : readonly { id : string, name : string }[] }) {
	const table 		 = useTable(data)
	const [ visibility ] = useTableColumnVisibility(LABEL, TABLE_COLUMN_INITIAL, TABLE_COLUMN_LOCKED)
	const toolbarFilter  = useToolbarFilter()
	const form  		 = useForm()

	const performRemoval 	  = useCallback(async (id: string) => await table.performRemoval(id, async (target) => await remove(target)), [ table ])
	const performRemovalBatch = useCallback(async () => await table.performRemovalBatch(async (ids) => await removeBatch(ids)), [ table ])

	useKeyboard({ key : 'r', condition : table.selectionState.size > 0, onAction : performRemovalBatch })

	const performRenderCell = useCallback((column: ColumnTable, key: string) => {
		switch (key) {
			case 'name':
				return (
					<Div className={'flex flex-row items-center gap-2.5'}>
						<UserRound className={'size-3.5'} />
						<Span className={'text-sm font-medium'}>{column.name}</Span>
					</Div>
				)

			case 'email':
				return (
					<Div className={'flex flex-row items-center gap-2.5'}>
						<Mail className={'size-3.5'} />
						<Span className={'inline-flex items-center text-sm'}>{column.email && column.email !== '' ? column.email : <ExtraSmall className={'text-neutral-500'}>No Email Provided (Update Required)</ExtraSmall>}</Span>
					</Div>
				)

			case 'account': {
				const account = column.accountPeople?.map((association) => association.account?.name).filter(Boolean) || []

				if (account.length === 0)
					return (
						<Div className={'flex flex-row items-center gap-2.5'}>
							<Flag className={'size-3.5'} />
							<ExtraSmall className={'text-neutral-500'}>No Account Provided (Update Required)</ExtraSmall>
						</Div>
					)

				return (
					<Div className={'flex flex-row items-center gap-2'}>
						<Flag className={'size-3.5'} />
					
						{
							account.length > 1 ? (
								<Span className={'flex flex-row items-center justify-center gap-1.5 text-sm'}>
									{account[0]} 
										
									<Tooltip>
										<TooltipTrigger>
											<Badge className={'text-2xs'}>+{account.length - 1} More</Badge>
										</TooltipTrigger>
										<TooltipContent>
											{account.slice(1).join(', ')}
										</TooltipContent>
									</Tooltip>
								</Span>
							) : (
								<Span className={'text-sm'}>{account[0]}</Span>
							)
						}
					</Div>
				)
			}

			case 'phone':
				return (
					<Div className={'flex flex-row items-center gap-2.5'}>
						<Phone className={'size-3.5'} />
						<Span className={'inline-flex items-center text-sm'}>{column.phone && column.phone !== '' ? column.phone : <ExtraSmall className={'text-neutral-500'}>No Phone Number Provided (Update Required)</ExtraSmall>}</Span>
					</Div>
				)

			default: {
				return <Small>{(column[key as keyof ColumnTable] as ReactNode) ?? '—'}</Small>
			}
		}
	}, [])

	const performRenderAction = useCallback((data: ColumnTable) => (
		<>
			<Button appearance={'ghost'} disabled={table.removalProcess.has(data.id)} icon={true} shape={'ellipse'} size={'sm'} onClick={() => table.performRowUpdate(data)}>
				<PenLine className={'size-3.5'} />
			</Button>

			<Button appearance={'ghost'} disabled={table.removalProcess.has(data.id)} icon={true} shape={'ellipse'} size={'sm'} onClick={() => table.performRowRemoval(data)}>
				<Trash2 className={'size-3.5'} />
			</Button>
		</>
	), [ table ])

	return (
		<>
			<TableRoot actionBatchCount={table.removalProcess.size} columns={TABLE_COLUMNS} data={table.optimistic} label={LABEL} pending={table.pending} refToast={table.refToast} removalProcess={(id) => table.removalProcess.has(id)} removalSuccess={(id) => table.removalSuccess.has(id)} renderAction={performRenderAction} renderCell={performRenderCell} selectedAll={table.selectionSelectedAll ?? false} selectedPartial={table.selectionSelectedPartial ?? false} selection={table.selection} selectionAll={table.selectionAll} selectionState={table.selectionState} visibility={visibility} onActionBatch={performRemovalBatch} onCreate={form.create.openDialog} onFilter={toolbarFilter.performOpen} />
			
			{table.rowSelection	    && (<FormUpdate account={account} data={table.rowSelection} open={table.updateOpen} onOpenChange={table.performRowUpdateCancellation} onUpdate={table.performUpdate} />)}
			{table.removalSelection && (<FormRemoval provision={{ id : table.removalSelection.id }} onDelete={async id => (await performRemoval(id), table.performRowRemovalCancellation(false))} onOpenChange={table.performRowRemovalCancellation} />)}
		</>
	)
}

export function TableSkeleton() {
	return <TableSkeletonRoot row={SCHEMA_SEARCH_PARAMS_INITIAL.limit} width={TABLE_COLUMNS.map(column => column.skeleton)} />
}
