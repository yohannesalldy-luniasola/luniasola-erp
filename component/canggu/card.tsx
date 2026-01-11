import type { ReadonlyComponentProps } from '@/component/utility/component'

import { Div }        from '@/component/canggu/block'
import { classNames } from '@/component/utility/style'

type Card        = ReadonlyComponentProps<'div'>
type CardHeader  = ReadonlyComponentProps<'div'>
type CardTitle   = ReadonlyComponentProps<'h3'>
type CardContent = ReadonlyComponentProps<'div'>
type CardFooter  = ReadonlyComponentProps<'div'>

export function Card({ className, ...props }: Card) {
	return <Div className={classNames('rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950', className)} {...props} />
}

export function CardHeader({ className, ...props }: CardHeader) {
	return <Div className={classNames('flex flex-col space-y-1.5 p-6', className)} {...props} />
}

export function CardTitle({ className, ...props }: CardTitle) {
	return <h3 className={classNames('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
}

export function CardContent({ className, ...props }: CardContent) {
	return <Div className={classNames('p-6 pt-0', className)} {...props} />
}

export function CardFooter({ className, ...props }: CardFooter) {
	return <Div className={classNames('flex items-center p-6 pt-0', className)} {...props} />
}

