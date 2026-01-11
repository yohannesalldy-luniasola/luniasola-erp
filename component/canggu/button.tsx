import type { ComponentProps } from 'react'

import { Slot }                   from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { classNames } from '@/component/utility/style'

export type Button = Readonly<Omit<ComponentProps<'button'>, 'size'>> & VariantProps<typeof Variant> & { readonly asChild? : boolean }

export const Variant = cva('inline-flex items-center justify-center gap-1.5 font-sans text-sm font-semibold whitespace-nowrap transition-[transform] duration-250 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0', {
	variants : {
		appearance : {
			'primary'     : 'bg-primary text-primary-foreground hover:ring-3 hover:ring-primary-600/25 hover:bg-primary-600 active:bg-primary/75 focus-visible:ring-3 focus-visible:ring-primary/50',
			'destructive' : 'bg-red-500 text-white hover:ring-3 hover:ring-red-600/25 hover:bg-red-600 active:bg-red-500/75 focus-visible:ring-3 focus-visible:ring-red-500/50',
			'ghost'       : 'bg-transparent hover:bg-neutral-100 hover:text-black active:bg-neutral-200 focus-visible:ring-3 focus-visible:ring-neutral-200/50 dark:text-white dark:hover:bg-zinc-800/50 dark:hover:text-white dark:active:bg-zinc-800/50 dark:focus-visible:ring-zinc-800',
		},
		size : {
			'2xs' : 'h-6 px-1',
			'xs'  : 'h-6 px-2',
			'sm'  : 'h-8 px-3',
			'md'  : 'h-9 px-4',
			'lg'  : 'h-10 px-5',
			'xl'  : 'h-11 px-6',
			'2xl' : 'h-12 px-7',
			'3xl' : 'h-14 px-8',
		},
		shape : {
			'square'  : 'rounded-none',
			'round'   : 'rounded-md',
			'ellipse' : 'rounded-4xl',
			'circle'  : 'rounded-full',
		},
		icon : {
			true  : 'p-0 active:scale-90',
			false : '',
		},
	},
	defaultVariants : {
		appearance : 'primary',
		shape      : 'round',
		size       : 'md',
		icon       : false,
	},
	compoundVariants : [
		{ 
			icon      : true, 
			size      : '2xs', 
			className : 'size-5', 
		},
		{ 
			icon      : true, 
			size      : 'xs', 
			className : 'size-6', 
		},
		{ 
			icon      : true, 
			size      : 'sm', 
			className : 'size-8', 
		},
		{ 
			icon      : true, 
			size      : 'md', 
			className : 'size-9', 
		},
		{ 
			icon      : true, 
			size      : 'lg', 
			className : 'size-10', 
		},
		{ 
			icon      : true, 
			size      : 'xl', 
			className : 'size-12', 
		},
		{ 
			icon      : true, 
			size      : '2xl', 
			className : 'size-14', 
		},
		{ 
			icon      : true, 
			size      : '3xl', 
			className : 'size-16', 
		},
	],
})

export function Button({ appearance, size, icon, shape, className, asChild = false, type = 'button', ...props }: Button) {
	const Component = asChild ? Slot : 'button'

	return <Component className={classNames(Variant({ appearance, size, icon, shape }), className)} type={asChild ? undefined : type} {...props} />
}
