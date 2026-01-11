import type { SearchParams } from '@/type/next'
import type { ReactNode }    from 'react'

import { Suspense } from 'react'

import { FormProvider }                                                    from '@/app/system/component/form'
import { Pagination }                                                      from '@/app/system/component/pagination'
import { ToolbarFilterProvider }                                           from '@/app/system/component/toolbar/filter'
import { list }                                                            from '@/app/system/growth/datasource/account/action/query'
import { ICON, LABEL, SCHEMA_SEARCH_PARAMS_INITIAL, SCHEMA_SEARCH_PARAMS } from '@/app/system/growth/datasource/account/action/schema'	
import { FormCreate }                                                      from '@/app/system/growth/datasource/account/component/form'
import { Table, TableSkeleton }                                            from '@/app/system/growth/datasource/account/component/table'
import { Toolbar, ToolbarFallback }                                        from '@/app/system/growth/datasource/account/component/toolbar'
import { Section, Div }                                                    from '@/component/canggu/block'
import { Separator }                                                       from '@/component/canggu/separator'    
import { Paragraph }                                                       from '@/component/canggu/typography'
import { parse }                                                           from '@/component/utility/parameter'

type Page 	 = { readonly searchParams : SearchParams }
type Context = { readonly children : ReactNode }

export function Context({ children }: Context) {
	return (
		<FormProvider>
			<ToolbarFilterProvider>
				{children}
			</ToolbarFilterProvider>
		</FormProvider>
	)
}

export function Header({ searchParams }: Page) {
	return (
		<Section className={'shrink-0 border-b border-neutral-100 bg-white px-3 py-1.75 md:px-4 dark:border-zinc-800/50 dark:bg-zinc-950'}>
			<Div className={'flex flex-row items-center justify-between gap-2'}>
				<Div className={'flex flex-row items-center gap-2.5'}>
					<Paragraph className={'flex flex-row items-center gap-2.5 text-sm font-semibold'}>
						<ICON className={'size-4 text-primary'} strokeWidth={2.500} /> {LABEL}
					</Paragraph>

					<Separator className={'-mr-0.5 data-[orientation=vertical]:h-4'} orientation={'vertical'} />
                    
					<Suspense fallback={<ToolbarFallback />}>
						<Toolbar searchParams={searchParams} />
					</Suspense>
				</Div>

				<Div className={'flex flex-row items-center gap-2'}>
					<FormCreate />
				</Div>
			</Div>
		</Section>
	)
}

export async function Body({ searchParams }: Page) {
	const parameter 		 = await parse(searchParams, SCHEMA_SEARCH_PARAMS, SCHEMA_SEARCH_PARAMS_INITIAL)
	const { data, metadata } = await list(parameter)

	return (
		<Section className={'flex h-full min-h-0 flex-1 flex-col overflow-hidden'}>
			<Div className={'flex min-h-0 flex-1 flex-col'}>
				<Table data={data} />
			</Div>

			{
				metadata.page.total > 1 && (
					<Div className={'shrink-0 border-t border-neutral-100 bg-white p-2 md:py-4 md:pb-5 dark:border-zinc-800/50 dark:bg-zinc-950'}>
						<Pagination current={metadata.page.current} total={metadata.page.total} />
					</Div>
				)
			}
		</Section>
	)
}

export function BodyFallback() {
	return (
		<Div className={'relative flex size-full min-h-0 flex-1 flex-col overflow-hidden'}>
			<Div className={'flex min-h-0 flex-1 flex-col'}>
				<TableSkeleton />
			</Div>
		</Div>
	)
}
