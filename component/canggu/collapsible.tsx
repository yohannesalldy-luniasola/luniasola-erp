'use client'

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'

export type Collapsible        = ReadonlyComponentProps<typeof CollapsiblePrimitive.Root>
export type CollapsibleTrigger = ReadonlyComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>
export type CollapsibleContent = ReadonlyComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>

export function Collapsible({ ...props }: Collapsible) {
	return <CollapsiblePrimitive.Root data-slot={'collapsible'} {...props} />
}

export function CollapsibleTrigger({ ...props }: CollapsibleTrigger) {
	return <CollapsiblePrimitive.CollapsibleTrigger data-slot={'collapsible-trigger'} {...props} />
}

export function CollapsibleContent({ ...props }: CollapsibleContent) {
	return <CollapsiblePrimitive.CollapsibleContent data-slot={'collapsible-content'} {...props} />
}
