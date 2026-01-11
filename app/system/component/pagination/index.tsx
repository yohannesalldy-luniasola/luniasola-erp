'use client'

import type { MouseEvent } from 'react'

import { Loader2 } from 'lucide-react'

import { Pagination as PaginationRoot, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis  } from '@/component/canggu/pagination'
import { usePagination }                                                                                                                            from '@/component/hook/pagination'

export function Pagination({ current, total }: Readonly<{ current : number, total : number }>) {
	const pagination = usePagination(current, total)
	
	if (total <= 1)
		return null

	return (
		<PaginationRoot>
			<PaginationContent className={'overflow-x-auto'}>
				<PaginationItem>
					<PaginationPrevious disabled={pagination.pending || current <= 1} href={pagination.push(current - 1)} onClick={(event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(), current > 1 && pagination.perform(current - 1) }} />
				</PaginationItem>

				{
					pagination.visibility.map((number, index) => {
						if (number === '...')
							return (
								<PaginationItem key={'pagination-ellipsis' + '-' + index}>
									<PaginationEllipsis />
								</PaginationItem>
							)

						return (
							<PaginationItem key={'pagination-current' + '-' + number}>
								<PaginationLink active={current === number} disabled={pagination.pending} href={pagination.push(number)} onClick={(event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(), pagination.perform(number) }}>
									{pagination.pending && pagination.target === number ? <Loader2 className={'size-3.5 animate-spin'} strokeWidth={1.500} /> : number}
								</PaginationLink>
							</PaginationItem>
						)
					})
				}

				<PaginationItem>
					<PaginationNext disabled={pagination.pending || current >= total} href={pagination.push(current + 1)} onClick={(event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(), current < total && pagination.perform(current + 1) }} />
				</PaginationItem>
			</PaginationContent>
		</PaginationRoot>
	)
}
