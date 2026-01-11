'use client'

import type { ReactNode } from 'react'

import { useMemo } from 'react'

import { ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from 'lucide-react'

import { Div, Span }    from '@/component/canggu/block'
import { Button }       from '@/component/canggu/button'
import { TableHead }    from '@/component/canggu/table'
import { useTableSort } from '@/component/hook/table'
import { classNames }   from '@/component/utility/style'

export function TableSort({ children, column, className }: { readonly children : ReactNode, readonly column : string, readonly className? : string }) {
	const tableSort = useTableSort(column)

	const Icon = useMemo(() => {
		switch (tableSort.state) {
			case 'asc':
				return <ArrowUp aria-hidden={'true'} className={'size-3!'} />
			
			case 'desc':
				return <ArrowDown aria-hidden={'true'} className={'size-3!'} />
			
			default:
				if (tableSort.pending)
					return <Loader2 aria-hidden={'true'} className={'size-3! animate-spin'} />
				
				return <ArrowUpDown aria-hidden={'true'} className={'size-3! opacity-50 transition-opacity group-focus-visible/button:opacity-100 focus-visible:opacity-100 md:group-hover:opacity-50 lg:opacity-0 lg:group-focus-visible:opacity-100'} />
		}
	}, [ tableSort.pending, tableSort.state ])

	const aria = tableSort.state === 'asc' ? 'ascending' : tableSort.state === 'desc' ? 'descending' : 'none'

	return (
		<TableHead aria-sort={aria} className={classNames('group select-none', className)}>
			<Div className={'flex items-center gap-0.5 md:gap-1'}>
				<Span className={'truncate'}>{children}</Span>
				<Button appearance={'ghost'} className={'group/button cursor-pointer'} disabled={tableSort.pending} icon={true} shape={'circle'} size={'xs'} type={'button'} onClick={tableSort.perform}>{Icon}</Button>
			</Div>
		</TableHead>
	)
}
