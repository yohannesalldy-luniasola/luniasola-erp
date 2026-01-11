'use client'

import * as SeparatorPrimitive from '@radix-ui/react-separator'

import { classNames } from '@/component/utility/style'

export type Separator = ReadonlyComponentProps<typeof SeparatorPrimitive.Root>

export function Separator({ className, orientation = 'horizontal', decorative = true, ...props }: Separator) {
	return <SeparatorPrimitive.Root className={classNames('shrink-0 bg-neutral-300 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px dark:bg-zinc-800', className )} data-slot={'separator'} decorative={decorative} orientation={orientation} {...props} />
}
