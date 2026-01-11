import { Slot }                         from '@radix-ui/react-slot'
import { ChevronRight, MoreHorizontal } from 'lucide-react'

import { List, Nav, OrderedList, Span } from '@/component/canggu/block'
import { classNames }                   from '@/component/utility/style'

export type Breadcrumb     	    = ReadonlyComponentProps<'nav'>
export type BreadcrumbList	    = ReadonlyComponentProps<'ol'>
export type BreadcrumbItem	    = ReadonlyComponentProps<'li'>
export type BreadcrumbSeparator = ReadonlyComponentProps<'li'>
export type BreadcrumbPage	    = ReadonlyComponentProps<'span'>
export type BreadcrumbEllipsis  = ReadonlyComponentProps<'span'>
export type BreadcrumbLink	    = ReadonlyComponentProps<'a'> & { readonly asChild? : boolean }

export function Breadcrumb({ ...props }: Breadcrumb) {
	return <Nav aria-label={'breadcrumb'} data-slot={'breadcrumb'} {...props} />
}

export function BreadcrumbList({ className, ...props }: BreadcrumbList) {
	return <OrderedList className={classNames('flex flex-wrap items-center gap-0 text-sm font-normal wrap-break-word text-neutral-500 sm:gap-1.5', className )} data-slot={'breadcrumb-list'} type={'1'} {...props} />
}

export function BreadcrumbItem({ className, ...props }: BreadcrumbItem) {
	return <List className={classNames('inline-flex items-center gap-1.5', className)} data-slot={'breadcrumb-item'} {...props} />
}

export function BreadcrumbLink({ asChild = false, className, ...props }: BreadcrumbLink) {
	const Component = asChild ? Slot : 'a'

	return <Component className={classNames('transition-colors hover:text-foreground', className)} data-slot={'breadcrumb-link'} {...props} />
}

export function BreadcrumbPage({ className, ...props }: BreadcrumbPage) {
	return <Span aria-current={'page'} aria-disabled={'true'} className={classNames('font-normal text-foreground', className)} data-slot={'breadcrumb-page'} role={'link'} {...props} />
}

export function BreadcrumbSeparator({ children, className, ...props }: BreadcrumbSeparator) {
	return (
		<List aria-hidden={'true'} className={classNames('[&>svg]:size-3.25', className)} data-slot={'breadcrumb-separator'} role={'presentation'} {...props}>
			{children ?? <ChevronRight />}
		</List>
	)
}

export function BreadcrumbEllipsis({ className, ...props }: BreadcrumbEllipsis) {
	return (
		<Span aria-hidden={'true'} className={classNames('flex items-center justify-center', className)} data-slot={'breadcrumb-ellipsis'} role={'presentation'} {...props}>
			<MoreHorizontal />
			<Span className={'sr-only'}>More</Span>
		</Span>
	)
}
