'use client'

import type { ColumnDefinition }     from '@/component/hook/table'
import type { ReactNode, RefObject } from 'react'

import { Trash2, Plus, ListFilter } from 'lucide-react'
import { motion }                   from 'motion/react'

import { State }                                                                      from '@/app/component/state'
import { TableSort }                                                                  from '@/app/system/component/table/sort'
import { Span, Break, Strong }                                                        from '@/component/canggu/block'
import { Button }                                                                     from '@/component/canggu/button'
import { Checkbox }                                                                   from '@/component/canggu/form'
import { Keyboard }                                                                   from '@/component/canggu/keyboard'
import { Skeleton }                                                                   from '@/component/canggu/skeleton'
import { Table as TableRoot, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/component/canggu/table'
import { useTableSelectionToast }                                                     from '@/component/hook/table'
import { classNames }                                                                 from '@/component/utility/style'

type Table		        		 = { readonly id : string } & Record<string, unknown>
type TableProps<T extends Table> = {
	readonly data              : readonly T[]
	readonly columns           : readonly ColumnDefinition<string>[]
	readonly pending?          : boolean
	readonly renderCell        : (item: T, columnKey: string) => ReactNode
	readonly renderAction?     : (item: T)                    => ReactNode
	readonly label             : string
	readonly selectionState    : ReadonlySet<string>
	readonly selectionAll      : () 		  => void
	readonly selection         : (id: string) => void
	readonly selectedAll       : boolean
	readonly selectedPartial   : boolean
	readonly removalProcess    : (id: string) => boolean
	readonly removalSuccess    : (id: string) => boolean
	readonly onCreate?         : ()	 	 	  => void
	readonly onFilter?         : () 	 	  => void
	readonly onActionBatch?    : () 	 	  => void
	readonly actionBatchCount? : number
	readonly visibility?       : Record<string, boolean>
	readonly refToast?         : RefObject<string | number | null>
}

type TableSkeleton = {
	readonly row?       : number
	readonly width      : readonly string[] 
	readonly selection? : boolean
	readonly action?    : boolean
}

const TOAST = {
	title : (
		<Span className={'flex flex-row items-center gap-1.25'}>
			<Trash2 className={'-mt-0.25! size-3.5 stroke-red-500!'} strokeWidth={2.500} />
			<Span className={'flex flex-row items-center gap-1'}>Batch Removal Confirmation</Span>
		</Span>
	),
	actionLabel : (
		<Span className={'flex flex-row items-center gap-1'}>
			Remove <Keyboard className={'hidden bg-primary-300 text-white lg:block dark:bg-primary-700'}>R</Keyboard> 
		</Span>
	),
} as const

export function Table<T extends Table>({ data, columns, pending, renderCell, renderAction, label, selectionState, selectionAll, selection, selectedAll, selectedPartial, removalProcess, removalSuccess, onCreate, onFilter, onActionBatch, actionBatchCount, visibility, refToast }: TableProps<T>) {
	useTableSelectionToast(selectionState.size, actionBatchCount ?? 0, refToast ?? { current : null }, { onAction : onActionBatch ?? (() => {}), title : TOAST.title, actionLabel : TOAST.actionLabel })

	if (data.length === 0) {
		if (pending)
			return <TableSkeleton action={true} row={25} selection={true} width={columns.map(() => 'w-32')} />

		return (
			<TableRoot className={'relative size-full overflow-auto'}>
				<TableBody>
					<TableRow className={'hover:bg-transparent dark:hover:bg-transparent'}>
						<TableCell colSpan={columns.length + 2}>
							<State description={<> There is nothing to display here yet. <Break /> Create a new <Strong className={'font-semibold'}>{label}</Strong> record or adjust filters. </>} type={'empty'}>
								{
									onCreate && (
										<Button appearance={'primary'} shape={'ellipse'} size={'sm'} onClick={onCreate}>
											<Plus className={'size-3.5'} /> New <Keyboard className={'hidden bg-primary-300 text-white lg:block dark:bg-primary-700'}>N</Keyboard>
										</Button>
									)
								}

								{
									onFilter && (
										<Button appearance={'ghost'} shape={'ellipse'} size={'sm'} onClick={onFilter}>
											<ListFilter className={'size-3.5'} /> Modify Filters
										</Button>
									)
								}
							</State>
						</TableCell>
					</TableRow>
				</TableBody>
			</TableRoot>
		)
	}

	return (
		<TableRoot className={'relative size-full overflow-auto'}>
			<TableHeader className={'sticky top-0 z-20 bg-white after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-neutral-100 hover:bg-white dark:bg-zinc-950 dark:after:bg-zinc-800 dark:hover:bg-zinc-950'}>
				<TableRow>
					<TableHead className={'w-12'}>
						<Checkbox checked={selectedAll || (selectedPartial && 'indeterminate')} className={'relative -top-2'} onCheckedChange={selectionAll} />
					</TableHead>

					{
						columns.map((column) => {
							if (visibility && visibility[column.key] === false) 
								return null

							if (column.sort === false)
								return (
									<TableHead key={column.key}>
										{column.label}
									</TableHead>
								)
                        
							return (
								<TableSort column={column.key} key={column.key}>
									{column.label}
								</TableSort>
							)
						})
					}

					<TableHead className={'text-right'} />
				</TableRow>
			</TableHeader>

			<TableBody>
				{
					data.map((item) => {
						const removing = removalProcess(item.id)
						const removed  = removalSuccess(item.id)

						return (
							<motion.tr animate={{ opacity : removed ? .250 : removing ? .250 : 1.000, transitionEnd : { display : removed ? 'none' : 'table-row' }}} className={'group border-b border-neutral-100 hover:bg-neutral-50 data-[state=selected]:bg-neutral-50 dark:border-zinc-800/50 dark:hover:bg-zinc-900/50 dark:data-[state=selected]:bg-zinc-900/50'} key={item.id} transition={{ duration : .500, ease : 'easeOut' }}>
								<TableCell>
									<Checkbox checked={selectionState.has(item.id)} className={'relative -top-0.25'} disabled={removing} onCheckedChange={() => selection(item.id)} />
								</TableCell>

								{
									columns.map((column) => {
										if (visibility && visibility[column.key] === false) 
											return null
                                
										return (
											<TableCell key={column.key}>
												{renderCell(item, column.key)}
											</TableCell>
										)
									})
								}

								<TableCell className={'text-right'}>
									{
										renderAction && (
											<div className={'flex items-center justify-end gap-1'}>
												{renderAction(item)}
											</div>
										)
									}
								</TableCell>
							</motion.tr>
						)
					})}
			</TableBody>
		</TableRoot>
	)
}

export function TableSkeleton({ row = 10, width, selection = true, action = true }: TableSkeleton) {
	return (
		<TableRoot className={'relative size-full overflow-auto'}>
			<TableHeader className={'sticky top-0 z-10 bg-white after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-neutral-100 dark:bg-zinc-950 dark:after:bg-zinc-800/50'}>
				<TableRow>
					{
						selection && (
							<TableHead className={'w-12'}>
								<Skeleton className={'size-4.75 rounded-sm'} />
							</TableHead>
						)
					}

					{
						width.map((width, index) => (
							<TableHead key={index}>
								<Skeleton className={classNames('h-5', width.replace('w-', 'w-1/2 '))} /> 
							</TableHead>
						))
					}

					{action && <TableHead className={'text-right'} />}
				</TableRow>
			</TableHeader>

			<TableBody>
				{
					Array.from({ length : row }).map((_, index) => (
						<TableRow className={'h-12.75'} key={index}>
							{
								selection && (
									<TableCell>
										<Skeleton className={'relative -top-0.25 size-4.5 rounded-sm'} />
									</TableCell>
								)
							}

							{
								width.map((width, colIndex) => (
									<TableCell key={colIndex}>
										<Skeleton className={classNames('h-5', width)} />
									</TableCell>
								))
							}

							{
								action && (
									<TableCell className={'text-right'}>
										<Skeleton className={'ml-auto h-5 w-14'} />
									</TableCell>
								)
							}
						</TableRow>
					))
				}
			</TableBody>
		</TableRoot>
	)
}
