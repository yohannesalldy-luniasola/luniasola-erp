'use client'

import type { ColumnTable } from '@/app/system/growth/datasource/account/action/schema'
import type { ReactNode }   from 'react'

import { useCallback } from 'react'

import { PenLine, Trash2, CircleUserRound, Flag } from 'lucide-react'

import { useForm }                                                                                       from '@/app/system/component/form'
import { Table as TableRoot, TableSkeleton as TableSkeletonRoot }                                        from '@/app/system/component/table'
import { useToolbarFilter }                                                                              from '@/app/system/component/toolbar/filter'
import { remove, removeBatch }                                                                           from '@/app/system/growth/datasource/account/action/mutation'
import { TABLE_COLUMNS, TABLE_COLUMN_INITIAL, TABLE_COLUMN_LOCKED, SCHEMA_SEARCH_PARAMS_INITIAL, LABEL } from '@/app/system/growth/datasource/account/action/schema'
import { FormRemoval, FormUpdate }                                                                       from '@/app/system/growth/datasource/account/component/form'
import { Badge }                                                                                         from '@/component/canggu/badge'
import { Div, Span }                                                                                     from '@/component/canggu/block'
import { Button }                                                                                        from '@/component/canggu/button'
import { ExtraSmall, Small }                                                                             from '@/component/canggu/typography'
import { useKeyboard }                                                                                   from '@/component/hook/keyboard'
import { useTable, useTableColumnVisibility }                                                            from '@/component/hook/table'
import { classNames }                                                                                    from '@/component/utility/style'

export function Table({ data }: { readonly data : readonly ColumnTable[] }) {
	const table 		 = useTable(data)
	const [ visibility ] = useTableColumnVisibility(LABEL, TABLE_COLUMN_INITIAL, TABLE_COLUMN_LOCKED)
	const toolbarFilter  = useToolbarFilter()
	const form  		 = useForm()

	const performRemoval 	  = useCallback(async (id: string) => await table.performRemoval(id, async (target) => await remove(target)), [ table ])
	const performRemovalBatch = useCallback(async () => await table.performRemovalBatch(async (ids) => await removeBatch(ids)), [ table ])

	useKeyboard({ key : 'r', condition : table.selectionState.size > 0, onAction : performRemovalBatch })

	const mapCountry = useCallback((country: string | undefined) => {
		if (!country || country === '')
			return '-'

		return {
			ID : 'Indonesia',
			MY : 'Malaysia',
			SG : 'Singapore',
			US : 'United States of America',
			GB : 'United Kingdom',
			DE : 'Germany',
			FR : 'France',
		}[ country ] ?? '-'
	}, [])

	const performRenderCell = useCallback((column: ColumnTable, key: string) => {
		switch (key) {
			case 'name':
				return (
					<Div className={'flex flex-row items-center gap-2.5'}>
						<CircleUserRound className={'size-3.5'} />
						<Span className={'text-sm font-medium'}>{column.name}</Span>
					</Div>
				)

			case 'country':
				return (
					<Div className={'flex flex-row items-center gap-2.5'}>
						<Flag className={'size-3.5'} />
						<Span className={'inline-flex items-center text-sm'}>
							{column.country && column.country !== '' ? mapCountry(column.country) : <ExtraSmall className={'text-neutral-500'}>No Country Provided (Update Required)</ExtraSmall>}
						</Span>
					</Div>
				)

			case 'status':
				return (
					<Badge>
						<Span className={classNames('size-2 rounded-full bg-neutral-400', column.status === 'active' && 'bg-emerald-500')} />
						<ExtraSmall className={'font-semibold text-inherit! capitalize'}>{column.status}</ExtraSmall>
					</Badge>
				)

			default: {
				return <Small>{(column[key as keyof ColumnTable] as ReactNode) ?? '—'}</Small>
			}
		}
	}, [ mapCountry ])

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
			
			{table.rowSelection	    && (<FormUpdate data={table.rowSelection} open={table.updateOpen} onOpenChange={table.performRowUpdateCancellation} onUpdate={table.performUpdate} />)}
			{table.removalSelection && (<FormRemoval provision={{ id : table.removalSelection.id }} onDelete={async id => (await performRemoval(id), table.performRowRemovalCancellation(false))} onOpenChange={table.performRowRemovalCancellation} />)}
		</>
	)
}

export function TableSkeleton() {
	return <TableSkeletonRoot row={SCHEMA_SEARCH_PARAMS_INITIAL.limit} width={TABLE_COLUMNS.map(column => column.skeleton)} />
}
