'use client'

import * as SheetPrimitive from '@radix-ui/react-dialog'
import { X }               from 'lucide-react'
import { motion }          from 'motion/react'

import { Div, Span }  from '@/component/canggu/block'
import { classNames } from '@/component/utility/style'

export type Sheet	         = ReadonlyComponentProps<typeof SheetPrimitive.Root>
export type SheetTrigger     = ReadonlyComponentProps<typeof SheetPrimitive.Trigger>
export type SheetClose       = ReadonlyComponentProps<typeof SheetPrimitive.Close>
export type SheetPortal      = ReadonlyComponentProps<typeof SheetPrimitive.Portal>
export type SheetOverlay     = ReadonlyComponentProps<typeof SheetPrimitive.Overlay>
export type SheetSide 		 = 'top' | 'bottom' | 'right' | 'left'
export type SheetHeader      = ReadonlyComponentProps<'div'>
export type SheetBody        = ReadonlyComponentProps<'div'>
export type SheetFooter      = ReadonlyComponentProps<'div'>
export type SheetTitle       = ReadonlyComponentProps<typeof SheetPrimitive.Title>
export type SheetDescription = ReadonlyComponentProps<typeof SheetPrimitive.Description>
export type SheetContent	 = ReadonlyComponentProps<typeof SheetPrimitive.Content> & { readonly side? : SheetSide }

export const ANIMATION = {
	overlay : {
		type      : 'spring',
		stiffness : 300.000,
		damping   : 30.000,
	},
	content : {
		transition : {
			duration : .750,
			ease     : [ .325, .720, .000, 1.000 ],
		},
		variants : {
			top : {
				initial : 'polygon(.000% .000%, 100.000% .000%, 100.000% .000%, .000% .000%)',
				animate : 'polygon(.000% .000%, 100.000% .000%, 100.000% 100.000%, .000% 100.000%)',
				exit    : 'polygon(.000% .000%, 100.000% .000%, 100.000% .000%, .000% .000%)',
			},
			bottom : {
				initial : 'polygon(.000% 100.000%, 100.000% 100.000%, 100.000% 100.000%, .000% 100.000%)',
				animate : 'polygon(.000% .000%, 100.000% .000%, 100.000% 100.000%, .000% 100.000%)',
				exit    : 'polygon(.000% 100.000%, 100.000% 100.000%, 100.000% 100.000%, .000% 100.000%)',
			},
			right : {
				initial : 'polygon(100.000% .000%, 100.000% .000%, 100.000% 100.000%, 100.000% 100.000%)',
				animate : 'polygon(.000% .000%, 100.000% .000%, 100.000% 100.000%, .000% 100.000%)',
				exit    : 'polygon(100.000% .000%, 100.000% .000%, 100.000% 100.000%, 100.000% 100.000%)',
			},
			left : {
				initial : 'polygon(.000% .000%, .000% .000%, .000% 100.000%, .000% 100.000%)',
				animate : 'polygon(.000% .000%, 100.000% .000%, 100.000% 100.000%, .000% 100.000%)',
				exit    : 'polygon(.000% .000%, .000% .000%, .000% 100.000%, .000% 100.000%)',
			},
		},
	},
	children : {
		type      : 'spring',
		stiffness : 200.000,
		damping   : 30.000,
		mass      : 2.500,
		delay     : .650,
	},
} as const

export const POSITION: Record<SheetSide, string> = {
	right  : 'inset-y-0 right-0 h-full w-3/4 sm:max-w-sm',
	left   : 'inset-y-0 left-0 h-full w-3/4 sm:max-w-sm',
	top    : 'inset-x-0 top-0 h-auto',
	bottom : 'inset-x-0 bottom-0 h-auto',
} as const

export function Sheet({ ...props }: Sheet) {
	return <SheetPrimitive.Root data-slot={'sheet'} {...props} />
}

export function SheetTrigger({ ...props }: SheetTrigger) {
	return <SheetPrimitive.Trigger data-slot={'sheet-trigger'} {...props} />
}

export function SheetClose({ ...props }: SheetClose) {
	return <SheetPrimitive.Close data-slot={'sheet-close'} {...props} />
}

export function SheetPortal({ ...props }: SheetPortal) {
	return <SheetPrimitive.Portal data-slot={'sheet-portal'} {...props} />
}

export function SheetOverlay({ className, ...props }: SheetOverlay) {
	return (
		<SheetPrimitive.Overlay data-slot={'sheet-overlay'} {...props} asChild>
			<motion.div animate={{ opacity : 1.000 }} className={classNames('fixed inset-0 z-50 bg-black/25', className)} exit={{ opacity : .000 }} initial={{ opacity : .000 }} transition={ANIMATION.overlay} />
		</SheetPrimitive.Overlay>
	)
}

export function SheetContent({ className, children, side = 'right', ...props }: SheetContent) {
	return (
		<SheetPortal>
			<SheetOverlay />
			
			<SheetPrimitive.Content className={classNames('fixed z-50 flex flex-col gap-4 bg-background shadow-xl', POSITION[side], className )} data-slot={'sheet-content'} {...props} asChild>
				<motion.div animate={{ clipPath : ANIMATION.content.variants[side].animate }} exit={{ clipPath : ANIMATION.content.variants[side].exit }} initial={{ clipPath : ANIMATION.content.variants[side].initial }} transition={ANIMATION.content.transition}>
					<motion.div animate={{ opacity : 1.000 }} exit={{ opacity : .000 }} initial={{ opacity : .000 }} transition={ANIMATION.children}>
						{children}
					</motion.div>

					<SheetPrimitive.Close className={'absolute top-5 right-4 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none'}>
						<X className={'size-4'} />
						<Span className={'sr-only'}>Close</Span>
					</SheetPrimitive.Close>
				</motion.div>
			</SheetPrimitive.Content>
		</SheetPortal>
	)
}

export function SheetHeader({ className, ...props }: SheetHeader) {
	return <Div className={classNames('flex flex-col gap-2 p-4', className)} data-slot={'sheet-header'} {...props} />
}

export function SheetTitle({ className, ...props }: SheetTitle) {
	return <SheetPrimitive.Title className={classNames('font-semibold text-foreground', className)} data-slot={'sheet-title'} {...props} />
}

export function SheetDescription({ className, ...props }: SheetDescription) {
	return <SheetPrimitive.Description className={classNames('text-sm text-foreground', className)} data-slot={'sheet-description'} {...props} />
}

export function SheetBody({ className, ...props }: SheetBody) {
	return <Div className={classNames('flex flex-col gap-2 p-4', className)} data-slot={'sheet-body'} {...props} />
}

export function SheetFooter({ className, ...props }: SheetFooter) {
	return <Div className={classNames('mt-auto flex flex-col gap-2 p-4', className)} data-slot={'sheet-footer'} {...props} />
}
