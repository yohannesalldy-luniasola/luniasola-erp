import { Div }        from '@/component/canggu/block'
import { classNames } from '@/component/utility/style'

export function Skeleton({ className, ...props }: ReadonlyComponentProps<'div'>) {
	return <Div aria-hidden={true} className={classNames('animate-pulse rounded-2xl bg-neutral-200/50 dark:bg-neutral-800/85', className)} data-slot={'skeleton'} {...props} />
}
