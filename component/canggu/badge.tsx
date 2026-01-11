import type { ComponentProps } from 'react'

import { Slot }                   from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { classNames } from '@/component/utility/style'

export type Badge = Readonly<Omit<ComponentProps<'span'>, 'size'>> & VariantProps<typeof Variant> & { readonly asChild? : boolean }

export const Variant = cva('inline-flex w-fit shrink-0 items-center justify-center gap-1.25 overflow-hidden rounded-full px-1.25 py-0.5 text-xs font-medium whitespace-nowrap focus-visible:border-neutral-200 focus-visible:ring-[3px] focus-visible:ring-neutral-200/50 aria-invalid:border-red-500 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 [&>svg]:pointer-events-none [&>svg]:size-3', {
	variants : {
		appearance : {
			base : 'text-foreground bg-neutral-100 dark:bg-black',
		},
	},
	defaultVariants : {
		appearance : 'base',
	},
})

export function Badge({ className, appearance, asChild = false, ...props }: Badge) {
	const Component = asChild ? Slot : 'span'

	return <Component className={classNames(Variant({ appearance }), className)} data-slot={'badge'} {...props} />
}
