'use client'

import Link            from 'next/link'
import { usePathname } from 'next/navigation'

import { useState, useMemo } from 'react'

import { DatabaseZap, Flag, Activity, Info, UserRound, ChevronRight, ChevronsUpDown, Lock, Radio, BadgeDollarSign, BarChart3, ChartArea } from 'lucide-react'
import { motion, AnimatePresence }                                                                                                        from 'motion/react'
import useSWR                                                                                                                             from 'swr'

import { Span, SVG, G, Path }                                                                                                                                                                                                                                                                                         from '@/component/canggu/block'
import { Collapsible, CollapsibleContent, CollapsibleTrigger }                                                                                                                                                                                                                                                        from '@/component/canggu/collapsible'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCard, DropdownMenuLabel, DropdownMenuGroup, DropdownMenuItem }                                                                                                                                                                           from '@/component/canggu/dropdown'
import { Sidebar as SidebarRoot, SidebarContent, SidebarBrand, SidebarHeader, SidebarGroup, SidebarGroupAction, SidebarMenuBadge, SidebarGroupLabel, SidebarMenuAction, SidebarRail, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/component/canggu/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger }                                                                                                                                                                                                                                                                    from '@/component/canggu/tooltip'
import { useMobile }                                                                                                                                                                                                                                                                                                  from '@/component/hook/mobile'
import { classNames }                                                                                                                                                                                                                                                                                                 from '@/component/utility/style'

type Department = {
	readonly id    : string
	readonly label : string
	readonly icon  : React.ReactNode
}

type MenuItemBase = {
	readonly type     : 'item'
	readonly path     : string
	readonly label    : string
	readonly icon     : React.ComponentType<{ className? : string }>
	readonly badge?   : Badge
	readonly actions? : readonly MenuAction[]
}

type MenuAction = {
	readonly icon    : React.ComponentType<{ className? : string, strokeWidth? : number }>
	readonly label   : string
	readonly onClick : () => void | Promise<void>
}

type MenuSubItem = {
	readonly icon?    : React.ComponentType<{ className? : string, strokeWidth? : number }>
	readonly path     : string
	readonly label    : string
	readonly badge?   : Badge
	readonly actions? : readonly MenuAction[]
}

type MenuItemCollapsible = {
	readonly type     : 'collapsible'
	readonly id       : string
	readonly label    : string
	readonly icon     : React.ComponentType<{ className? : string }>
	readonly children : readonly MenuSubItem[]
}

type Badge = {
	readonly type      : 'static' | 'dynamic'
	readonly value?    : number
	readonly endpoint? : string
	readonly interval? : number
}

type MenuCategory = {
	readonly id    : string
	readonly label : string
	readonly items : readonly MenuItem[]
}

type DepartmentMenu = {
	readonly department : string
	readonly categories : readonly MenuCategory[]
}

type MenuItem 		  = MenuItemBase | MenuItemCollapsible
type CollapsibleState = Record<string, boolean>

const DEPARTMENT: readonly Department[] = [
	{
		id    : 'growth',
		label : 'Growth',
		icon  : (
			<SVG className={'size-5'} height={32.000} viewBox={'0 0 512 512'} width={32.000}>
				<Path className={'fill-primary-500'} d={'M414.928 227.143V227.5L383.931 341.885L256 500L130.48 345.817L97.0713 227.143L256 0L414.928 227.143Z'} />
				<Path className={'fill-primary-200'} d={'M97.0714 227.143L89.5123 324.627L6 357.143V142.857L23.6629 125L47.7846 142.857L97.0714 227.143Z'} />
				<Path className={'fill-primary-300'} d={'M506.001 71.4286V357.143L413.902 312.593L414.929 227.5V227.143L506.001 71.4286Z'} />
				<Path className={'fill-primary-300'} d={'M256 500L6 357.143L97.0714 227.143L256 500Z'} />
				<Path className={'fill-primary-400'} d={'M506 357.143L256 500L414.929 227.5L506 357.143Z'} />
				<Path className={'fill-primary-200'} d={'M47.7846 142.857H6V71.4286L47.7846 142.857Z'} />
			</SVG>
		),
	},
	{
		id    : 'people',
		label : 'People',
		icon  : (
			<SVG className={'size-5'} enableBackground={'new 0 0 512 512'} height={32.000} viewBox={'0 0 512 512'} width={32.000}>
				<G>
					<Path className={'fill-primary-500'} d={'m512 256h-56.32l-199.68-32-199.68 32h-56.32c0-70.721 28.801-134.721 74.881-181.121 46.398-46.08 110.398-74.879 181.119-74.879s134.721 28.799 181.119 74.879c46.08 46.4 74.881 110.4 74.881 181.121z'} />
					<Path className={'fill-primary-200'} d={'m512 416h-160l-96-32-96 32h-160c0-60.48 21.119-116.16 56.32-160l199.68-32 199.68 32c35.201 43.84 56.32 99.52 56.32 160z'} />
					<Path className={'fill-primary-100/75'} d={'m352 416c0 53.119-42.881 96-96 96s-96-42.881-96-96l96-32z'} />

					<G className={'fill-primary-300'}>
						<Path d={'m352 416h-192c0-53.121 42.881-96 96-96s96 42.879 96 96z'} />
						<Path d={'m455.68 256h-399.36c5.76-7.361 11.84-14.4 18.561-21.121 46.398-46.08 110.398-74.879 181.119-74.879s134.721 28.799 181.119 74.879c6.721 6.721 12.801 13.76 18.561 21.121z'} />
					</G>
				</G>
			</SVG>
		),
	},
	{
		id    : 'fat',
		label : 'FAT',
		icon  : (
			<SVG className={'size-5'} enableBackground={'new 0 0 512 512'} height={32.000} viewBox={'0 0 512 512'} width={32.000}>
				<G>
					<Path className={'fill-primary-500'} d={'m192 192h320v320h-320z'} />
					<Path className={'fill-primary-400'} d={'m96 96h320v320h-320z'} />
					<Path className={'fill-primary-200'} d={'m0 0h320v320h-320z'} />
				</G>
			</SVG>
		),
	},
] as const

const MENU: readonly DepartmentMenu[] = [
	{
		department : 'growth',
		categories : [
			{
				label : 'Analytics',
				id    : 'analytics',
				items : [
					{
						type     : 'collapsible',
						id       : 'metrics',
						label    : 'Metrics',
						icon     : BarChart3,
						children : [
							{
								icon  : ChartArea,
								path  : '/system/growth/analytics/metrics',
								label : 'Dashboard',
							},
						],
					},
				],
			},
			{
				label : 'CRM',
				id    : 'crm',
				items : [
					{
						type     : 'collapsible',
						id       : 'datasource',
						label    : 'Data Source',
						icon     : DatabaseZap,
						children : [
							{
								icon  : Flag,
								path  : '/system/growth/datasource/account',
								label : 'Account',
							},
							{
								icon  : UserRound,
								path  : '/system/growth/datasource/people',
								label : 'People',
							},
							{
								icon  : BadgeDollarSign,
								path  : '/system/growth/datasource/lead',
								label : 'Lead',
							},
						],
					},
				],
			},
			{
				label : 'Marketing',
				id    : 'marketing',
				items : [
					{
						type     : 'collapsible',
						id       : 'performance',
						label    : 'Performance',
						icon     : Activity,
						children : [
							{
								icon  : Radio,
								path  : '/system/growth/performance/ads',
								label : 'Ads',
							},
						],
					},
				],
			},
			
		],
	},
] as const

function collapsibleIdentities(department?: string): string[] {
	const identities: string[] = []
	
	for (const menu of MENU) {
		if (department && menu.department !== department)
			continue
			
		for (const category of menu.categories)
			for (const item of category.items)
				if (item.type === 'collapsible')
					identities.push(item.id)
	}
	
	return identities
}

function collapsibleState(pathname: string, department?: string): Set<string> {
	const active = new Set<string>()
	
	for (const menu of MENU) {
		if (department && menu.department !== department)
			continue
			
		for (const category of menu.categories)
			for (const item of category.items)
				if (item.type === 'collapsible')
					if (item.children.some(child => pathname === child.path))
						active.add(item.id)
	}
	
	return active
}

function departmentPath(pathname: string): string | null {
	for (const menu of MENU)
		for (const category of menu.categories)
			for (const item of category.items) {
				if (item.type === 'item' && pathname === item.path)
					return menu.department
				
				if (item.type === 'collapsible')
					if (item.children.some(child => pathname === child.path))
						return menu.department
			}
	
	return null
}

function departmentMenu(departmentId: string): boolean {
	return MENU.some(menu => menu.department === departmentId)
}

function badgeFetch(url: string) { 
	return fetch(url).then((response) => response.json())
}

function useBadge(config?: Badge): number | null {
	const shouldFetch = config?.type === 'dynamic' && config?.endpoint
    
	const { data } = useSWR(shouldFetch ? config.endpoint : null, badgeFetch, {
		refreshInterval       : config?.interval ?? 10000,
		revalidateOnFocus     : true, 
		revalidateOnReconnect : true, 
		dedupingInterval      : 2000,
	})

	if (config?.type === 'static') 
		return config.value ?? null

	if (data) {
		if (typeof data === 'number') return data

		return data.value ?? data[0]?.total ?? null
	}

	return null
}

function BadgeRenderer({ config }: { config? : Badge }) {
	const value = useBadge(config)
	
	if (value === null)
		return null
	
	return <SidebarMenuBadge>{value}</SidebarMenuBadge>
}

function Action({ actions, className }: { actions? : readonly MenuAction[], className? : string }) {
	if (!actions || actions.length === 0)
		return null
	
	return (
		<>
			{
				actions.map((action, index) => {
					const Icon = action.icon
				
					return (
						<SidebarMenuAction className={className} key={index} onClick={action.onClick}>
							<Icon strokeWidth={1.750} />
							<Span className={'sr-only'}>{action.label}</Span>
						</SidebarMenuAction>
					)
				})
			}
		</>
	)
}

export function Sidebar() {
	const pathname 			   							= usePathname()
	const departmentDesignator 							= useMemo(() => departmentPath(pathname), [ pathname ])
	const [ departmentSelected, setDepartmentSelected ] = useState<string | null>(null)
	const [ collapsibleManual, setCollapsibleManual ]   = useState<CollapsibleState>({})

	const departmentActive  = departmentSelected || departmentDesignator || DEPARTMENT[0]?.id || null
	const collapsibleActive = useMemo(() => collapsibleState(pathname, departmentActive || undefined), [ pathname, departmentActive ])
	const collapsibleOpen   = useMemo(() => {
		const result: CollapsibleState = {}

		for (const id of collapsibleIdentities(departmentActive || undefined))
			result[id] = collapsibleActive.has(id) || (collapsibleManual[id] ?? true)

		return result
	}, [ collapsibleActive, collapsibleManual, departmentActive ])
	
	function performCollapsibleChange(id: string, open: boolean): void {
		if (!collapsibleActive.has(id))
			setCollapsibleManual(previous => ({ ...previous, [id] : open }))
	}
	
	function performDepartmentChange(id: string): void {
		setDepartmentSelected(id)
		setCollapsibleManual({})
	}
	
	function open(id: string): boolean {
		return collapsibleOpen[id] || false
	}
	
	function active(id: string): boolean {
		return collapsibleActive.has(id)
	}

	const department = useMemo(() => DEPARTMENT.find(department => department.id === departmentActive), [ departmentActive ])
	const menu       = useMemo(() => MENU.find(menu => menu.department === departmentActive), [ departmentActive ])

	return (
		<SidebarRoot collapsible={'icon'} side={'left'}>
			<SidebarHeader className={'md:bg-neutral-100 md:dark:bg-black'}>
				<SidebarGroup>
					<SidebarBrand>
						<SVG className={'relative -top-[.045rem] group-data-[collapsible=icon]:left-1 group-data-[collapsible=icon]:size-4.5'} height={20.000} viewBox={'0 0 205 190'}>
							<Path className={'fill-primary'} clipRule={'evenodd'} d={'M191.696 0L58.4216 132.616L0.749512 190V108.831L110.12 0H191.696Z'} />
							<Path className={'fill-primary'} clipRule={'evenodd'} d={'M204.25 161.123V190H118.448L59.2964 132.25H164.108L204.25 161.123Z'} />
						</SVG>
					</SidebarBrand>
				</SidebarGroup>
			</SidebarHeader>

			<SidebarContent className={'overflow-x-hidden md:bg-neutral-100 md:dark:bg-black'}>
				<SidebarGroup>
					<SidebarGroupLabel>Department</SidebarGroupLabel>

					{
						!useMobile() && (
							<Tooltip>
								<TooltipTrigger asChild>
									<SidebarGroupAction>
										<Info strokeWidth={1.750} />
										<Span className={'sr-only'}>Information</Span>
									</SidebarGroupAction>
								</TooltipTrigger>

								<TooltipContent>Switch Department Workspace</TooltipContent>
							</Tooltip>
						)
					}

					<SidebarGroupContent>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton isActive={true} size={'xl'} tooltip={department?.label || 'Department'}>
									{department?.icon}
									<Span className={'group-data-[collapsible=icon]:hidden'}>{department?.label}</Span>
									<ChevronsUpDown className={'ml-auto group-data-[collapsible=icon]:hidden'} />
								</SidebarMenuButton>
							</DropdownMenuTrigger>

							<DropdownMenuContent align={'start'} className={'w-52'} role={'menu'} side={'bottom'}>
								<DropdownMenuCard>
									<DropdownMenuLabel>Department Workspace</DropdownMenuLabel>
									<DropdownMenuGroup>
										{
											DEPARTMENT.map((department, index) => {
												const exist  = departmentMenu(department.id)
												const active = departmentActive === department.id
												
												return (
													<motion.div animate={{ opacity : 1.000, x : .000 }} initial={{ opacity : .000, x : -10.000 }} key={department.id} transition={{ delay : index * .150, duration : .450, ease : [ .225, 1.000, .325, 1.000 ] }}>
														<DropdownMenuItem className={'cursor-pointer gap-3 transition-all duration-200 hover:scale-[1.02]'} disabled={!exist} onClick={() => exist && performDepartmentChange(department.id)}>
															<motion.div transition={{ duration : .250 }} whileHover={{ scale : 1.100, rotate : 5.000 }}>
																{department.icon}
															</motion.div>

															<Span className={classNames('flex items-center justify-center gap-1.5 align-baseline', active && 'font-semibold')}>
																{department.label}
																{!exist && <Lock className={'size-3'} strokeWidth={2.000} />}
															</Span>
														</DropdownMenuItem>
													</motion.div>
												)
											})
										}
									</DropdownMenuGroup>
								</DropdownMenuCard>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			
				<AnimatePresence initial={false} mode={'wait'}>
					<motion.div animate={{ opacity : 1.000, x : .000 }} className={'overflow-hidden'} exit={{ opacity : .000, x : 20.000 }} initial={{ opacity : .000, x : -20.000 }} key={departmentActive || 'default'} transition={{ duration : .500, ease : [ .230, 1.000, .320, 1.000 ], opacity : { duration : .300 } }}>
						{
							menu?.categories.map((category, categoryIndex) => (
								<SidebarGroup key={departmentActive + '-' + category.label}>
									<motion.div animate={{ opacity : 1.000, y : .000 }} initial={{ opacity : .000, y : -10.000 }} transition={{ delay : .100 + (categoryIndex * .050), duration : .300, ease : [ .230, 1.000, .320, 1.000 ] }}>
										<SidebarGroupLabel>{category.label}</SidebarGroupLabel>
									</motion.div>

									<SidebarGroupContent>
										<SidebarMenu>
											{
												category.items.map((item, itemIndex) => {
													const delay = .150 + (categoryIndex * .050) + (itemIndex * .040)

													if (item.type === 'item')
														return (
															<SidebarMenuItem key={item.label} asChild>
																<motion.li animate={{ opacity : 1.000, x : .000, scale : 1.000 }} initial={{ opacity : .000, x : -15.000, scale : .950 }} transition={{ delay : delay, duration : .350, ease : [ .230, 1.000, .320, 1.000 ] }}>
																	<SidebarMenuButton isActive={pathname === item.path} tooltip={item.label} asChild>
																		<Link href={item.path}>
																			{item.icon && <item.icon />}
																			<Span className={'group-data-[collapsible=icon]:hidden'}>{item.label}</Span>
																			<BadgeRenderer config={item.badge} />
																		</Link>
																	</SidebarMenuButton>

																	<Action actions={item.actions} />
																</motion.li>
															</SidebarMenuItem>
														)
											
													return (
														<SidebarMenuItem key={item.id} asChild>
															<motion.li animate={{ opacity : 1.000, x : .000, scale : 1.000 }} className={'block'} initial={{ opacity : .000, x : -15.000, scale : .950 }} key={item.id} transition={{ delay : delay, duration : .350, ease : [ .230, 1.000, .320, 1.000 ] }}>
																<Collapsible className={'group/collapsible max-w-full group-data-[collapsible=icon]:hidden'} open={open(item.id)} onOpenChange={(open) => performCollapsibleChange(item.id, open)}>
																	<CollapsibleTrigger asChild>
																		<SidebarMenuButton className={'data-[active=true]:bg-transparent'} isActive={active(item.id)} tooltip={item.label}>
																			{item.icon && <item.icon />}
																			<Span>{item.label}</Span>
																			<ChevronRight className={'ml-auto transition-transform duration-200 group-data-[collapsible=icon]:hidden group-data-[state=open]/collapsible:rotate-90'} />
																		</SidebarMenuButton>
																	</CollapsibleTrigger>

																	<CollapsibleContent>
																		<SidebarMenuSub>
																			{
																				item.children.map((child, childIndex) => (
																					<SidebarMenuSubItem key={child.path} asChild> 
																						<motion.li animate={{ opacity : 1.000, x : .000 }} initial={{ opacity : .000, x : -10.000 }} transition={{ delay : delay + .100 + (childIndex * .100), duration : .350, ease : [ .230, 1.000, .320, 1.000 ] }}>
																							<SidebarMenuSubButton isActive={pathname === child.path} asChild>
																								<Link href={child.path}>
																									{child.icon && <child.icon />}
																									<Span>{child.label}</Span>
																									<BadgeRenderer config={child.badge} />
																								</Link>
																							</SidebarMenuSubButton>

																							<Action actions={child.actions} className={'top-[.475rem] right-[.325rem]'} />
																						</motion.li>
																					</SidebarMenuSubItem>
																				))
																			}
																		</SidebarMenuSub>
																	</CollapsibleContent>
																</Collapsible>
															</motion.li>
														</SidebarMenuItem>
													)
												})
											}
										</SidebarMenu>
									</SidebarGroupContent>
								</SidebarGroup>
							))
						}
					</motion.div>
				</AnimatePresence>
			</SidebarContent>

			<SidebarRail />
		</SidebarRoot>
	)
}
