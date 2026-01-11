'use client'

import { Div, Table as TableRoot, THead, TBody, TFoot, TR, TH, TD, Caption } from '@/component/canggu/block'
import { classNames }                                                        from '@/component/utility/style'

type Table        = ReadonlyComponentProps<'table'>
type TableHeader  = ReadonlyComponentProps<'thead'>
type TableBody    = ReadonlyComponentProps<'tbody'>
type TableFooter  = ReadonlyComponentProps<'tfoot'>
type TableRow     = ReadonlyComponentProps<'tr'>
type TableHead    = ReadonlyComponentProps<'th'>
type TableCell    = ReadonlyComponentProps<'td'>
type TableCaption = ReadonlyComponentProps<'caption'>

export function Table({ className, ...props }: Table) {
	return (
		<Div className={'relative w-full overflow-x-auto'} data-slot={'table-container'}>
			<TableRoot className={classNames('w-full caption-bottom text-sm', className)} data-slot={'table'} {...props} />
		</Div>
	)
}

export function TableHeader({ className, ...props }: TableHeader) {
	return <THead className={classNames('group/table-header hover:bg-transparent [&_tr]:border-b', className)} data-slot={'table-header'} {...props} />
}

export function TableHead({ className, ...props }: TableHead) {
	return <TH className={classNames('h-8 bg-transparent px-3 text-left align-middle text-xs font-semibold whitespace-nowrap text-foreground md:px-4 [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-2', className )} data-slot={'table-head'} {...props} />
}

export function TableBody({ className, ...props }: TableBody) {
	return <TBody className={classNames('[&_tr:last-child]:border-0', className)} data-slot={'table-body'} {...props} />
}

export function TableFooter({ className, ...props }: TableFooter) {
	return <TFoot className={classNames('group/table-footer [&>tr]:last:border-b-0', className)} data-slot={'table-footer'} {...props} />
}

export function TableRow({ className, ...props }: TableRow) {
	return <TR className={classNames('h-fit border-b border-neutral-100 p-200 group-hover/table-footer:bg-transparent! group-hover/table-header:bg-transparent! hover:bg-neutral-50/75 data-[state=selected]:bg-neutral-200 dark:border-zinc-800/50 dark:hover:bg-zinc-800/20', className )} data-slot={'table-row'} {...props} />
}

export function TableCell({ className, ...props }: TableCell) {
	return <TD className={classNames('px-3 py-2.25 align-middle text-sm whitespace-nowrap md:px-4 [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-[2px]', className )} data-slot={'table-cell'} {...props} />
}

export function TableCaption({ className, ...props }: TableCaption) {
	return <Caption className={classNames('mt-4 text-xs text-neutral-500', className)} data-slot={'table-caption'} {...props} />
}
