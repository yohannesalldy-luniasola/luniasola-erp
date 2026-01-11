import { cva, type VariantProps } from 'class-variance-authority'

import { Div }        from '@/component/canggu/block'
import { classNames } from '@/component/utility/style'

type State            = ReadonlyComponentProps<'div'>
type StateHeader      = ReadonlyComponentProps<'div'>
type StateTitle       = ReadonlyComponentProps<'div'>
type StateDescription = ReadonlyComponentProps<'div'>
type StateContent     = ReadonlyComponentProps<'div'>
type StateMedia       = ReadonlyComponentProps<'div'> & VariantProps<typeof Variant>

const Variant = cva('mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0', {
	variants : {
		appearance : {
			default : 'bg-transparent',
			icon    : 'bg-primary text-foreground flex size-10 shrink-0 text-white items-center justify-center rounded-full',
		},
	},
	defaultVariants : {
		appearance : 'default',
	},
})

export function State({ className, ...props }: State) {
	return <Div className={classNames('flex min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-lg border-dashed p-6 text-center text-balance md:p-12', className )} data-slot={'state'} {...props} />
}

export function StateHeader({ className, ...props }: StateHeader) {
	return <Div className={classNames( 'flex max-w-sm flex-col items-center justify-center gap-2 text-center', className )} data-slot={'state-header'} {...props} />
}

export function StateMedia({ className, appearance = 'default', ...props }: StateMedia) {
	return <Div className={classNames(Variant({ appearance, className }))} data-slot={'state-icon'} data-variant={appearance} {...props} />
}

export function StateTitle({ className, ...props }: StateTitle) {
	return <Div className={classNames('text-center text-sm font-semibold', className)} data-slot={'state-title'} {...props} />
}

export function StateDescription({ className, ...props }: StateDescription) {
	return <Div className={classNames('text-sm/relaxed text-neutral-500 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary', className )} data-slot={'state-description'} {...props} />
}

export function StateContent({ className, ...props }: StateContent) {
	return <Div className={classNames('flex w-full max-w-sm flex-row items-center justify-center gap-1.5 text-center text-sm text-balance', className )} data-slot={'state-content'} {...props} />
}
