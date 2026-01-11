import * as React from 'react'

import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'

import { Nav, UnorderedList, List, A } from '@/component/canggu/block'
import { Span }                        from '@/component/canggu/block'
import { Button, Variant }             from '@/component/canggu/button'
import { classNames }                  from '@/component/utility/style'

export type Pagination         = ReadonlyComponentProps<'nav'>
export type PaginationContent  = ReadonlyComponentProps<'ul'>
export type PaginationItem     = ReadonlyComponentProps<'li'>
export type PaginationEllipsis = ReadonlyComponentProps<'span'>
export type PaginationLink     = { active? : boolean, disabled? : boolean } & Pick<ReadonlyComponentProps<typeof Button>, 'size'> & React.ComponentProps<'a'>
export type PaginationPrevious = ReadonlyComponentProps<typeof PaginationLink>
export type PaginationNext     = ReadonlyComponentProps<typeof PaginationLink>

export function Pagination({ className, ...props }: Pagination) {
	return <Nav aria-label={'pagination'} className={classNames('mx-auto flex w-full justify-end', className)} data-slot={'pagination'} role={'navigation'} {...props} />
}

export function PaginationContent({ className, ...props }: PaginationContent) {
	return <UnorderedList className={classNames('flex flex-row items-center justify-center gap-1.5', className)} data-slot={'pagination-content'} {...props} />
}

export function PaginationItem({ ...props }: PaginationItem) {
	return <List className={'flex items-center justify-center align-middle'} data-slot={'pagination-item'} {...props} />
}

export function PaginationLink({ className, active, disabled, size = 'sm', onClick, ...props }: PaginationLink) {
	return <A aria-current={active ? 'page' : undefined} aria-disabled={disabled} className={classNames(Variant({ appearance : active ? 'primary' : 'ghost', icon : true, shape : 'circle', size }), 'text-xs font-normal', disabled && 'pointer-events-none opacity-50', className )} data-active={active} data-slot={'pagination-link'} onClick={(event) => (disabled && event.preventDefault(), !disabled && onClick?.(event))} {...props} />
	
}

export function PaginationPrevious({ className, children, ...props }: PaginationPrevious) {
	return (
		<PaginationLink aria-label={'Go to previous page'} className={classNames('font-normal', className)} size={'sm'} {...props}>
			{children ? children : <ChevronLeftIcon className={'size-3.5'} strokeWidth={1.500} />}
		</PaginationLink>
	)
}

export function PaginationNext({ className, children, ...props }: PaginationNext) {
	return (
		<PaginationLink aria-label={'Go to next page'} className={classNames('font-normal', className)} size={'sm'} {...props}>
			{children ? children : <ChevronRightIcon className={'size-3.5'} strokeWidth={1.500} />}
		</PaginationLink>
	)
}

export function PaginationEllipsis({ className, ...props }: PaginationEllipsis) {
	return (
		<Span className={classNames('flex size-9 items-center justify-center', className)} data-slot={'pagination-ellipsis'} {...props}>
			<MoreHorizontalIcon className={'size-3.5'} strokeWidth={1.500} />
			<Span className={'sr-only'}>More pages</Span>
		</Span>
	)
}
