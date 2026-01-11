'use client'

import type { Dispatch, SetStateAction, ReactNode } from 'react'

import { useCallback } from 'react'

import { Lock, SquaresSubtract } from 'lucide-react'

import { Span }                                                                                                                  from '@/component/canggu/block'
import { Button }                                                                                                                from '@/component/canggu/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCard, DropdownMenuLabel, DropdownMenuCheckboxItem } from '@/component/canggu/dropdown'
import { Skeleton }                                                                                                              from '@/component/canggu/skeleton'
import { classNames }                                                                                                            from '@/component/utility/style'

type ToolbarDisplay<T extends string> = {
	readonly columns       : readonly T[]
	readonly className?    : string
	readonly labels        : Record<T, string>
	readonly visibility    : Record<T, boolean>
	readonly setVisibility : Dispatch<SetStateAction<Record<T, boolean>>>
	readonly disabled?     : boolean
	readonly locked?       : readonly T[]
}

type ToolbarDisplayFallback = {
	readonly className? : string
}

export function ToolbarDisplay<T extends string>({ columns, className, labels, visibility, setVisibility, disabled, locked = [] }: ToolbarDisplay<T>): ReactNode {
	const perform = useCallback((column: T) => {
		if (locked.includes(column))
			return

		setVisibility((previous) => ({ ...previous, [column] : !previous[column] }))
	}, [ setVisibility, locked ])

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button appearance={'ghost'} className={'px-1 text-sm md:px-2'} disabled={disabled} shape={'ellipse'} size={'xs'}>
					<SquaresSubtract className={'size-3.5'} strokeWidth={1.500} />
					<Span className={'hidden sm:block'}>Display</Span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align={'start'} className={classNames('w-42', className)}>
				<DropdownMenuCard>
					<DropdownMenuLabel>Column</DropdownMenuLabel>
					{
						columns.map((column) => {
							const columnLocked = locked.includes(column)

							return (
								<DropdownMenuCheckboxItem checked={visibility[column]} disabled={columnLocked} key={column} onCheckedChange={() => perform(column)}>
									<Span className={'flex items-center gap-1'}>
										{labels[column]}
										{columnLocked && <Lock className={'size-3'} strokeWidth={1.500} />}
									</Span>
								</DropdownMenuCheckboxItem>
							)
						})
					}
				</DropdownMenuCard>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export function ToolbarDisplayFallback({ className }: { readonly className? : string }) {
	return <Skeleton className={classNames('h-6 w-12', className)} />
}
