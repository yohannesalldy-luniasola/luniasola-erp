import * as NavigationPrimitive from '@radix-ui/react-navigation-menu'
import { ChevronDown }          from 'lucide-react'

import { Div }        from '@/component/canggu/block'
import { classNames } from '@/component/utility/style'

export type Navigation		   = ReadonlyComponentProps<typeof NavigationPrimitive.Root> & { readonly viewport? : boolean }
export type NavigationList     = ReadonlyComponentProps<typeof NavigationPrimitive.List>
export type NavigationItem     = ReadonlyComponentProps<typeof NavigationPrimitive.Item>
export type NavigationTrigger  = ReadonlyComponentProps<typeof NavigationPrimitive.Trigger>
export type NavigationContent  = ReadonlyComponentProps<typeof NavigationPrimitive.Content>
export type NavigationCard     = ReadonlyComponentProps<'div'>
export type NavigationViewport = ReadonlyComponentProps<typeof NavigationPrimitive.Viewport>
export type NavigationLink	   = ReadonlyComponentProps<typeof NavigationPrimitive.Link>

export function Navigation({ className, children, viewport = true, ...props }: Navigation) {
	return (
		<NavigationPrimitive.Root className={classNames('group/navigation relative z-50 flex w-full flex-1 p-4', className )} data-slot={'navigation'} data-viewport={viewport} {...props}>
			{children}
			{viewport && <NavigationViewport />}
		</NavigationPrimitive.Root>
	)
}

export function NavigationList({ className, ...props }: NavigationList) {
	return <NavigationPrimitive.List className={classNames('group flex list-none items-center gap-2.5', className)} data-slot={'navigation-list'} {...props} />
}

export function NavigationItem({ className, ...props }: NavigationItem) {
	return <NavigationPrimitive.Item className={classNames('relative', className)} data-slot={'navigation-item'} {...props} />
}

export function NavigationTrigger({ className, children, ...props }: NavigationTrigger) {
	return (
		<NavigationPrimitive.Trigger className={classNames('group inline-flex h-9 w-max items-center justify-center rounded-md p-2 text-sm font-semibold text-foreground transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-transparent data-[state=open]:opacity-50 data-[state=open]:hover:bg-transparent dark:focus-visible:ring-2 dark:focus-visible:ring-zinc-800/80', className )} data-slot={'navigation-trigger'} {...props}>
			{children}{' '}
			<ChevronDown aria-hidden={'true'} className={'relative top-px -mr-1 ml-1 size-3.5 transition duration-300 group-data-[state=open]:rotate-180'} strokeWidth={2.5} />
		</NavigationPrimitive.Trigger>
	)
}

export function NavigationContent({ className, ...props }: NavigationContent) {
	return <NavigationPrimitive.Content className={classNames('top-0 left-0 w-full border border-neutral-100/25 bg-transparent! p-1.5 px-2 py-2.5 backdrop-blur-xs group-data-[viewport=false]/navigation:top-full group-data-[viewport=false]/navigation:mt-1.5 group-data-[viewport=false]/navigation:overflow-hidden group-data-[viewport=false]/navigation:rounded-lg group-data-[viewport=false]/navigation:border group-data-[viewport=false]/navigation:bg-background group-data-[viewport=false]/navigation:text-foreground group-data-[viewport=false]/navigation:shadow-xl group-data-[viewport=false]/navigation:duration-200 data-[motion=from-end]:slide-in-from-right-12 data-[motion=from-start]:slide-in-from-left-12 data-[motion=to-end]:slide-out-to-right-12 data-[motion=to-start]:slide-out-to-left-12 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out **:data-[slot=navigation-link]:focus:outline-none group-data-[viewport=false]/navigation:data-[state=closed]:animate-out group-data-[viewport=false]/navigation:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation:data-[state=open]:animate-in group-data-[viewport=false]/navigation:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation:data-[state=open]:zoom-in-95 md:absolute md:w-auto dark:border dark:border-zinc-700/10 dark:group-data-[viewport=false]/navigation:bg-zinc-900/55', className )} data-slot={'navigation-content'} {...props} />
}

export function NavigationCard({ className, ...props }: NavigationCard) {
	return <Div className={classNames('flex flex-col gap-2 rounded-md bg-background px-2.5 py-4 shadow-xl shadow-neutral-200/30 dark:bg-zinc-900/75 dark:shadow-zinc-800/5', className)} data-slot={'navigation-card'} {...props} />
}

export function NavigationViewport({ className, ...props }: NavigationViewport) {
	return (
		<Div className={classNames('absolute top-full left-0 isolate z-50 flex w-full justify-center px-2', className)}>
			<NavigationPrimitive.Viewport className={classNames('relative h-(--radix-navigation-viewport-height) w-full origin-top overflow-hidden rounded-xl border border-neutral-100/75 bg-background text-foreground shadow-xl duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-5 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-5 md:w-(--radix-navigation-viewport-width) dark:border-zinc-700/50 dark:bg-zinc-900', className )} data-slot={'navigation-viewport'} {...props} />
		</Div>
	)
}

export function NavigationLink({ className, ...props }: NavigationLink) {
	return <NavigationPrimitive.Link className={classNames('flex flex-col gap-1 rounded-md p-2 text-sm font-semibold text-foreground transition-all outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 data-[active=true]:bg-transparent data-[active=true]:text-foreground data-[active=true]:hover:bg-neutral-100 data-[active=true]:focus:bg-neutral-100 dark:focus:bg-transparent dark:group-data-[viewport=true]/navigation:focus:bg-zinc-800/50 dark:focus-visible:ring-2 dark:focus-visible:ring-zinc-800/80', className )} data-slot={'navigation-link'} {...props} />
}
