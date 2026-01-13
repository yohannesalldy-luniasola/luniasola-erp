import type { SearchParams } from '@/type/next'
import type { ReactNode }    from 'react'

import { Suspense } from 'react'

import { FormProvider }                                                    from '@/app/system/component/form'
import { listAccount, listAvailablePeople, listByStage }                  from '@/app/system/growth/datasource/deal/action/query'
import { ICON, LABEL, SCHEMA_SEARCH_PARAMS, SCHEMA_SEARCH_PARAMS_INITIAL } from '@/app/system/growth/datasource/deal/action/schema'
import { FormCreateServer, FormCreateServerFallback }                      from '@/app/system/growth/datasource/deal/component/form/server'
import { HistoryButton }                                                   from '@/app/system/growth/datasource/deal/component/history'
import { KanbanClientWrapper }                                             from '@/app/system/growth/datasource/deal/component/kanban/client'
import { Toolbar, ToolbarFallback }                                        from '@/app/system/growth/datasource/deal/component/toolbar'
import { Section, Div }                                                    from '@/component/canggu/block'
import { Separator }                                                       from '@/component/canggu/separator'
import { Paragraph }                                                       from '@/component/canggu/typography'
import { parse }                                                           from '@/component/utility/parameter'

type Page 	 = { readonly searchParams : SearchParams }
type Context = { readonly children : ReactNode }

export function Context({ children }: Context) {
	return (
		<FormProvider>
			{children}
		</FormProvider>
	)
}

export async function Header({ searchParams }: Page) {
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
					<HistoryButton />
					<Suspense fallback={<FormCreateServerFallback />}>
						<FormCreateServer />
					</Suspense>
				</Div>
			</Div>
		</Section>
	)
}

export async function Body({ searchParams }: Page) {
	const parameter = await parse(searchParams, SCHEMA_SEARCH_PARAMS, SCHEMA_SEARCH_PARAMS_INITIAL)
	const resolvedSearchParams = await searchParams
	const filters = {
		stage   : parameter.stage,
		source  : resolvedSearchParams.source as string | undefined,
		account : resolvedSearchParams.account as string | undefined,
	}
	
	const [ data, accountResult, peopleResult ] = await Promise.all([
		listByStage(filters),
		listAccount(),
		listAvailablePeople(),
	])

	return (
		<Section className={'flex h-full min-h-0 flex-1 flex-col overflow-hidden'}>
			<Div className={'flex min-h-0 flex-1 flex-col'}>
				<KanbanClientWrapper account={accountResult.data} data={data} people={peopleResult.data} />
			</Div>
		</Section>
	)
}

export function BodyFallback() {
	return (
		<Div className={'relative flex size-full min-h-0 flex-1 flex-col overflow-hidden'}>
			<Div className={'flex min-h-0 flex-1 flex-col items-center justify-center'}>
				<Paragraph className={'text-sm text-neutral-500'}>Loading...</Paragraph>
			</Div>
		</Div>
	)
}
