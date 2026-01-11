'use client'

import type { ComponentProps, CSSProperties } from 'react'

import { createContext, use, useState, useCallback, useMemo } from 'react'

import { Slot }                              from '@radix-ui/react-slot'
import { type VariantProps }                 from 'class-variance-authority'
import { PanelLeft, PanelLeftOpen, Command } from 'lucide-react'

import { Main, Div, Span, A, UnorderedList }                              from '@/component/canggu/block'
import { Variant }                                                        from '@/component/canggu/button'
import { Button }                                                         from '@/component/canggu/button'
import { Keyboard, KeyboardGroup }                                        from '@/component/canggu/keyboard'
import { Separator }                                                      from '@/component/canggu/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/component/canggu/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }       from '@/component/canggu/tooltip'
import { ExtraSmall }                                                     from '@/component/canggu/typography'
import { useKeyboard }                                                    from '@/component/hook/keyboard'
import { useMobile }                                                      from '@/component/hook/mobile'
import { classNames }                                                     from '@/component/utility/style'

export type SidebarState              = 'expanded'  | 'collapsed'
export type SidebarSide               = 'left' 	    | 'right'
export type SidebarCollapsible        = 'offcanvas' | 'icon'  | 'none'
export type SidebarMenuSubButtonSize  = 'sm' 		| 'md'    | 'lg'
export type SidebarMenuButtonVariants = VariantProps<typeof Variant>
export type SidebarSeparator     	  = ReadonlyComponentProps<typeof Separator>
export type SidebarTrigger       	  = ReadonlyComponentProps<typeof Button>
export type SidebarTooltipContent	  = ReadonlyComponentProps<typeof TooltipContent>
export type SidebarInset         	  = ReadonlyComponentProps<'main'>
export type SidebarHeader        	  = ReadonlyComponentProps<'div'>
export type SidebarContent       	  = ReadonlyComponentProps<'div'>
export type SidebarGroup         	  = ReadonlyComponentProps<'div'>
export type SidebarGroupContent  	  = ReadonlyComponentProps<'div'>
export type SidebarMenuBadge     	  = ReadonlyComponentProps<'div'>
export type SidebarBrand         	  = ReadonlyComponentProps<'div'>
export type SidebarFooter        	  = ReadonlyComponentProps<'div'>
export type SidebarRail          	  = ReadonlyComponentProps<'a'>
export type SidebarMenu          	  = ReadonlyComponentProps<'ul'>
export type SidebarMenuSub       	  = ReadonlyComponentProps<'ul'>
export type SidebarMenuItem      	  = ReadonlyComponentProps<'li'> 			 	 	 	 	 	 	 	 		 	 & { readonly asChild? : boolean }
export type SidebarMenuSubItem   	  = ReadonlyComponentProps<'li'> 			 	 	 	 	 	 	 	 		 	 & { readonly asChild? : boolean }
export type SidebarGroupLabel    	  = ReadonlyComponentProps<'div'>    		 	 	 	 	 	 	 	 	 		 & { readonly asChild? : boolean }
export type SidebarGroupAction   	  = ReadonlyComponentProps<'button'> 		 		 	 	 	 	 	 	 	 	 & { readonly asChild? : boolean }
export type SidebarMobile        	  = ReadonlyComponentProps<typeof SheetContent> 			 	 	 		 		 & { readonly side? : SidebarSide }
export type SidebarMenuAction    	  = ReadonlyComponentProps<'button'> 		 		 	 	 	 	 	 	 	 	 & { readonly asChild? : boolean, readonly showOnHover? : boolean }
export type SidebarDesktop        	  = Readonly<Omit<ComponentProps<'div'>,    'side' | 'collapsible'> 				 & { readonly side? : SidebarSide, readonly collapsible? : SidebarCollapsible }>
export type SidebarProvider      	  = Readonly<Omit<ComponentProps<'div'>,    'defaultOpen' | 'open' | 'onOpenChange'> & { defaultOpen? : boolean, open? : boolean, onOpenChange? : (open: boolean) => void }>
export type Sidebar              	  = Readonly<Omit<ComponentProps<'div'>,    'side' | 'collapsible'> 				 & { readonly side? : SidebarSide, readonly collapsible? : SidebarCollapsible }>
export type SidebarMenuButton    	  = Readonly<Omit<ComponentProps<'button'>, 'size'> & SidebarMenuButtonVariants 	 & { readonly asChild? : boolean, readonly isActive? : boolean, readonly tooltip? : string | SidebarTooltipContent}>
export type SidebarMenuSubButton 	  = Readonly<Omit<ComponentProps<'a'>, 	    'size'> 								 & { readonly asChild? : boolean, readonly size? : SidebarMenuSubButtonSize, readonly isActive? : boolean }>
export type SidebarCSSProperties 	  = CSSProperties 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 	 & { '--sidebar-width'? : string, '--sidebar-width-icon'? : string }
export type SidebarContextValue       = {
	readonly state         : SidebarState,
	readonly open          : boolean,
	readonly openMobile    : boolean,
	readonly mobile        : boolean,
	readonly setOpen       : (open: boolean | ((previous: boolean) => boolean)) => void,
	readonly setOpenMobile : (open: boolean | ((previous: boolean) => boolean)) => void,
	readonly toggle        : () => void 
}

export const SIDEBAR_COOKIE_NAME      : string 			     = 'sidebar'  								    as const
export const SIDEBAR_COOKIE_MAX_AGE   : number 			     = 604800      								    as const
export const SIDEBAR_WIDTH            : string 			     = '16.000rem' 								    as const
export const SIDEBAR_WIDTH_MOBILE     : string 			     = '18.000rem' 								    as const
export const SIDEBAR_WIDTH_MOBILE_CSS : SidebarCSSProperties = { '--sidebar-width' : SIDEBAR_WIDTH_MOBILE } as const
export const SIDEBAR_WIDTH_ICON       : string 		         = '3.500rem'  							        as const

export const SidebarContext = createContext<SidebarContextValue | null>(null)

export function useSidebar(): SidebarContextValue {
	const context = use(SidebarContext)

	if (!context)
		throw new Error('useSidebar must be invoked within a SidebarProvider context')

	return context
}

export function SidebarProvider({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }: SidebarProvider) {
	const [ openMobile, setOpenMobile ] = useState<boolean>(false)
	const [ _open, _setOpen ]           = useState<boolean>(defaultOpen)
	const mobile 		 	 	 	 	= useMobile()

	const open: boolean = openProp ?? _open

	const setOpen = useCallback((value: boolean | ((value: boolean) => boolean)): void => {
		const openState: boolean = typeof value === 'function' ? value(open) : value
        
		if (setOpenProp)
			setOpenProp(openState)
		else
			_setOpen(openState)

		document.cookie = SIDEBAR_COOKIE_NAME + '=' + String(openState) + '; path=/; max-age=' + String(SIDEBAR_COOKIE_MAX_AGE)
	}, [ setOpenProp, open ])

	const toggle = useCallback((): void => {
		mobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
	}, [ mobile, setOpen, setOpenMobile ])

	useKeyboard({ key : '/', modifier : 'meta', onAction : toggle })
	useKeyboard({ key : '/', modifier : 'ctrl', onAction : toggle })

	const state : SidebarState = open ? 'expanded' : 'collapsed'

	const css     = useMemo<SidebarCSSProperties>(() => ({ '--sidebar-width' : SIDEBAR_WIDTH, '--sidebar-width-icon' : SIDEBAR_WIDTH_ICON, ...style }), [ style ])
	const context = useMemo<SidebarContextValue>((): SidebarContextValue => ({ state, open, setOpen, mobile, openMobile, setOpenMobile, toggle }), [ state, open, setOpen, mobile, openMobile, setOpenMobile, toggle ] )

	return (
		<SidebarContext value={context}>
			<TooltipProvider delayDuration={.000}>
				<Div className={classNames('group/sidebar-wrapper flex min-h-svh w-full gap-0.75', className )} data-slot={'sidebar-wrapper'} style={css} {...props}>
					{children}
				</Div>
			</TooltipProvider>
		</SidebarContext>
	)
}

export function SidebarMobile({ side, children, ...props }: SidebarMobile) {
	const sidebar = useSidebar()

	return (
		<Sheet open={sidebar.openMobile} onOpenChange={sidebar.setOpenMobile} {...props}>
			<SheetContent className={'w-(--sidebar-width) p-0 text-foreground [&>button]:hidden'} data-mobile={'true'} data-sidebar={'sidebar'} data-slot={'sidebar'} side={side} style={SIDEBAR_WIDTH_MOBILE_CSS}>
				<SheetHeader className={'sr-only'}>
					<SheetTitle>Sidebar</SheetTitle>
					<SheetDescription>Displays the mobile sidebar.</SheetDescription>
				</SheetHeader>

				<Div className={'flex size-full flex-col'}>{children}</Div>
			</SheetContent>
		</Sheet>
	)
}

export function SidebarDesktop({ side, collapsible, className, children, ...props }: SidebarDesktop) {
	const sidebar = useSidebar()
	
	return (
		<Div className={'group peer hidden text-foreground md:block'} data-collapsible={sidebar.state === 'collapsed' ? collapsible : ''} data-side={side} data-slot={'sidebar'} data-state={sidebar.state}>
			<Div className={classNames('relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+.105rem)]')} data-slot={'sidebar-gap'} />
			
			<Div className={classNames('fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex', side === 'left' ? 'left-0 group-data-[side=left]:border-r-0 group-data-[side=left]:border-transparent group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]' : 'right-0 z-20 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] group-data-[side=right]:border-l-0 group-data-[side=right]:border-transparent group-data-[collapsible=icon]:w-(--sidebar-width-icon)', className)} data-slot={'sidebar-container'} {...props}>
				<Div className={classNames('flex size-full flex-col bg-neutral-100')} data-sidebar={'sidebar'} data-slot={'sidebar-inner'}>
					{children}
				</Div>
			</Div>
		</Div>
	)
}

export function Sidebar({ side = 'left', collapsible = 'offcanvas', className, children, ...props }: Sidebar) {
	const sidebar = useSidebar()

	if (collapsible === 'none')
		return (
			<Div className={classNames('flex h-full w-(--sidebar-width) flex-col bg-background text-foreground', className )} data-slot={'sidebar'} {...props}>
				{children}
			</Div>
		)

	if (sidebar.mobile)
		return <SidebarMobile side={side} {...props}>{children}</SidebarMobile>

	return <SidebarDesktop className={className} collapsible={collapsible} side={side} {...props}>{children}</SidebarDesktop>
}

export function SidebarTrigger({ className, onClick, ...props }: SidebarTrigger) {
	const sidebar = useSidebar()

	return (
		<Tooltip delayDuration={500.000}>
			<TooltipTrigger asChild>
				<Button appearance={'ghost'} className={className} data-sidebar={'trigger'} data-slot={'sidebar-trigger'} icon={true} shape={'circle'} size={'sm'} onClick={(event): void => { onClick?.(event), sidebar.toggle() }} {...props}>
					{sidebar.state === 'collapsed' ? <PanelLeftOpen /> : <PanelLeft />}
					<Span className={'sr-only'}>Toggle Sidebar</Span>
				</Button>
			</TooltipTrigger>

			<TooltipContent align={'center'} className={'flex items-center gap-1.5'} side={'right'}>
				<Span>Toggle Sidebar</Span>

				<KeyboardGroup>
					<Keyboard><Command /></Keyboard>
					<ExtraSmall className={'text-white'}>+</ExtraSmall>
					<Keyboard>/</Keyboard>
				</KeyboardGroup>
			</TooltipContent>
		</Tooltip>
	)
}

export function SidebarRail({ className, ...props }: SidebarRail) {
	const sidebar = useSidebar()

	return <A aria-label={'Toggle Sidebar'} className={classNames('absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 inset-ring-0 transition-all ease-linear group-data-[collapsible=offcanvas]:translate-x-0 group-data-[side=left]:-right-4.25 group-data-[side=right]:-left-0.75 after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:bg-transparent after:inset-ring-transparent group-data-[collapsible=offcanvas]:after:left-full hover:after:bg-linear-to-b hover:after:from-transparent hover:after:to-neutral-300/75 hover:after:transition-colors hover:after:duration-400 in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize sm:flex dark:after:bg-black dark:hover:after:from-transparent dark:hover:after:to-zinc-800 [[data-side=left][data-collapsible=icon]_&]:left-14.25! [[data-side=left][data-collapsible=offcanvas]_&]:-right-1 [[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-collapsible=icon]_&]:-left-1.25 [[data-side=right][data-collapsible=offcanvas]_&]:-left-2 [[data-side=right][data-state=collapsed]_&]:cursor-w-resize', className )} data-sidebar={'rail'} data-slot={'sidebar-rail'} tabIndex={-1} title={'Toggle Sidebar'} type={'button'} onClick={sidebar.toggle} {...props} />
}

export function SidebarInset({ className, ...props }: SidebarInset) {
	return <Main className={classNames('peer relative z-10 flex w-full flex-1 flex-col border-x border-transparent bg-background shadow-md shadow-black/5 md:top-1.5 md:rounded-tl-3xl dark:border-x dark:border-zinc-800/30', className )} data-slot={'sidebar-inset'} {...props} />
}

export function SidebarHeader({ className, ...props }: SidebarHeader) {
	return <Div className={classNames('flex w-full flex-col items-start justify-center gap-2 px-2', className)} data-sidebar={'header'} data-slot={'sidebar-header'} {...props} />
}

export function SidebarFooter({ className, ...props }: SidebarFooter) {
	return <Div className={classNames('flex flex-col gap-2 p-2', className)} data-sidebar={'footer'} data-slot={'sidebar-footer'} {...props} />
}

export function SidebarSeparator({ className, ...props }: SidebarSeparator) {
	return <Separator className={classNames('w-auto', className)} data-sidebar={'separator'} data-slot={'sidebar-separator'} {...props} />
}

export function SidebarContent({ className, ...props }: SidebarContent) {
	return <Div className={classNames('flex min-h-0 flex-1 flex-col overflow-auto px-1 group-data-[collapsible=icon]:overflow-hidden', className )} data-sidebar={'content'} data-slot={'sidebar-content'} {...props} />
}

export function SidebarGroup({ className, ...props }: SidebarGroup) {
	return <Div className={classNames('relative flex w-full min-w-0 flex-col items-start p-2', className)} data-sidebar={'group'} data-slot={'sidebar-group'} {...props} />
}

export function SidebarGroupLabel({ className, asChild = false, ...props }: SidebarGroupLabel) {
	const Component = asChild ? Slot : 'div'

	return <Component className={classNames('flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-semibold text-foreground/65 ring-neutral-200/50 outline-hidden transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:hidden focus-visible:ring-2 dark:text-foreground/65 [&>svg]:size-4 [&>svg]:shrink-0', className )} data-sidebar={'group-label'} data-slot={'sidebar-group-label'} {...props} />
}

export function SidebarBrand({ className, ...props }: SidebarBrand) {
	return <Div className={classNames('relative flex flex-row items-start justify-center p-2 pt-5 group-data-[collapsible=icon]:px-0.5', className)} {...props} />
}

export function SidebarGroupAction({ className, asChild = false, ...props }: SidebarGroupAction) {
	const Component = asChild ? Slot : 'button'

	return <Component className={classNames('absolute top-4 right-4 flex aspect-square w-4 scale-95 cursor-pointer items-center justify-center rounded-full p-0 text-foreground ring-neutral-200/50 outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 hover:bg-neutral-100 hover:text-foreground focus-visible:ring-3 focus-visible:ring-neutral-200/50 active:scale-80 md:after:hidden dark:hover:bg-zinc-800/50 dark:focus-visible:ring-zinc-800 dark:active:bg-zinc-800/50 [&>svg]:size-4 [&>svg]:shrink-0', className)} data-sidebar={'group-action'} data-slot={'sidebar-group-action'} type={asChild ? undefined : 'button'} {...props} />
}

export function SidebarGroupContent({ className, ...props }: SidebarGroupContent) {
	return <Div className={classNames('w-full text-sm', className)} data-sidebar={'group-content'} data-slot={'sidebar-group-content'} {...props} />
}

export function SidebarMenu({ className, ...props }: SidebarMenu) {
	return <UnorderedList className={classNames('flex w-full min-w-0 flex-col', className)} data-sidebar={'menu'} data-slot={'sidebar-menu'} {...props} />
}

export function SidebarMenuItem({ asChild = false, className, ...props }: SidebarMenuItem) {
	const Component = asChild ? Slot : 'li'

	return <Component className={classNames('group/menu-item relative', className)} data-sidebar={'menu-item'} data-slot={'sidebar-menu-item'} {...props} />
}

export function SidebarMenuButton({ asChild = false, isActive = false, appearance = 'ghost', size = 'md', tooltip, className, ...props }: SidebarMenuButton) {
	const Component = asChild ? Slot : 'button'

	const sidebar = useSidebar()
	const Button  = <Component className={classNames(Variant({ appearance, size }), 'z-20 w-full cursor-pointer justify-start gap-2.5 rounded-lg p-2 text-sm font-normal group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-transparent hover:text-foreground active:bg-transparent data-[active=true]:bg-transparent data-[active=true]:font-semibold data-[active=true]:text-foreground data-[active=true]:shadow-md data-[active=true]:ring-0 data-[active=true]:shadow-black/10 data-[active=true]:ring-white/55 data-[active=true]:ring-offset-1 dark:text-foreground/85 dark:hover:bg-transparent dark:active:bg-transparent dark:data-[active=true]:bg-zinc-400/10 dark:data-[active=true]:shadow-black/55 dark:data-[active=true]:ring-zinc-800/30 dark:data-[active=true]:ring-offset-zinc-800/85 group-data-[collapsible=icon]:[&>_span]:hidden!', className)} data-active={isActive} data-sidebar={'menu-button'} data-size={size} data-slot={'sidebar-menu-button'} type={asChild ? undefined : 'button'} {...props} />

	if (!tooltip)
		return Button

	return (
		<Tooltip>
			<TooltipTrigger asChild>{Button}</TooltipTrigger>
			<TooltipContent align={'center'} hidden={sidebar.state !== 'collapsed' || sidebar.mobile} side={'right'} {...typeof tooltip === 'string' ? { children : tooltip } : tooltip} />
		</Tooltip>
	)
}

export function SidebarMenuAction({ className, asChild = false, showOnHover = false, ...props }: SidebarMenuAction) {
	const Component = asChild ? Slot : 'button'

	return <Component className={classNames('absolute top-1.5 right-1.5 flex aspect-square w-5 cursor-pointer items-center justify-center rounded-full p-0 text-foreground ring-neutral-200/50 outline-hidden transition-transform group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 after:absolute after:-inset-2 hover:bg-white hover:text-foreground hover:shadow-md focus-visible:ring-3 focus-visible:ring-neutral-200/50 active:scale-80 md:after:hidden dark:hover:bg-zinc-800/50 dark:focus-visible:ring-zinc-800 dark:active:bg-zinc-800/50 [&>svg]:size-4 [&>svg]:shrink-0', showOnHover && 'peer-data-[active=true]/menu-button:text-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0', className)} data-sidebar={'menu-action'} data-slot={'sidebar-menu-action'} type={asChild ? undefined : 'button'} {...props} />
}

export function SidebarMenuBadge({ className, ...props }: SidebarMenuBadge) {
	return <Div className={classNames('pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-transparent px-1 text-2xs font-semibold text-foreground select-none group-data-[collapsible=icon]:hidden peer-hover/menu-button:text-foreground peer-data-[active=true]/menu-button:text-foreground peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1', className )} data-sidebar={'menu-badge'} data-slot={'sidebar-menu-badge'} {...props} />
}

export function SidebarMenuSub({ className, ...props }: SidebarMenuSub) {
	return <UnorderedList className={classNames('z-10 mx-3.5 my-[.050rem] flex w-[97.500%] min-w-0 translate-x-px flex-col gap-0.5 border-l border-neutral-300 px-2.5 py-[.250rem] group-data-[collapsible=icon]:hidden dark:border-zinc-800/75', className )} data-sidebar={'menu-sub'} data-slot={'sidebar-menu-sub'} {...props} />
}

export function SidebarMenuSubItem({ asChild = false, className, ...props }: SidebarMenuSubItem) {
	const Component = asChild ? Slot : 'li'

	return <Component className={classNames('group/menu-sub-item relative w-full', className)} data-sidebar={'menu-sub-item'} data-slot={'sidebar-menu-sub-item'} {...props} />
}

export function SidebarMenuSubButton({ asChild = false, size = 'md', isActive = false, className, ...props }: SidebarMenuSubButton) {
	const Component = asChild ? Slot : 'a'

	return <Component className={classNames(Variant({ appearance : 'ghost', size }), 'w-full justify-start! gap-2.5 px-2 font-normal group-data-[collapsible=icon]:hidden before:absolute before:-inset-2 before:top-1/2 before:-left-2.5 before:h-[.070rem] before:w-2.25 before:bg-neutral-300 before:content-[\'\'] hover:bg-transparent active:bg-transparent data-[active=true]:bg-transparent data-[active=true]:font-semibold data-[active=true]:text-foreground data-[active=true]:shadow-md data-[active=true]:ring-0 data-[active=true]:shadow-black/10 data-[active=true]:ring-white/55 data-[active=true]:ring-offset-1 dark:text-foreground/65 dark:before:bg-zinc-800/75 dark:hover:bg-transparent dark:focus:bg-transparent dark:focus-visible:bg-transparent dark:active:bg-transparent dark:data-[active=true]:bg-zinc-400/10 dark:data-[active=true]:shadow-black/55 dark:data-[active=true]:ring-zinc-800/30 dark:data-[active=true]:ring-offset-zinc-800/85', className )} data-active={isActive} data-sidebar={'menu-sub-button'} data-size={size} data-slot={'sidebar-menu-sub-button'} {...props} />
}
