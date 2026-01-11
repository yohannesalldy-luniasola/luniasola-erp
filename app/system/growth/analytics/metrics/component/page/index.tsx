import type { SearchParams } from '@/type/next'
import type { ReactNode }    from 'react'

import { Suspense } from 'react'

import { ICON, LABEL, SCHEMA_SEARCH_PARAMS_INITIAL, SCHEMA_SEARCH_PARAMS } from '@/app/system/growth/analytics/metrics/action/schema'
import { Dashboard }                                                       from '@/app/system/growth/analytics/metrics/component/dashboard'
import { Section, Div }                                                    from '@/component/canggu/block'
import { Separator }                                                       from '@/component/canggu/separator'
import { Paragraph }                                                       from '@/component/canggu/typography'
import { parse }                                                           from '@/component/utility/parameter'

type Page 	 = { readonly searchParams : SearchParams }
type Context = { readonly children : ReactNode }

export function Context({ children }: Context) {
	return <>{children}</>
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
				</Div>
			</Div>
		</Section>
	)
}

export async function Body({ searchParams }: Page) {
	const parameter = await parse(searchParams, SCHEMA_SEARCH_PARAMS, SCHEMA_SEARCH_PARAMS_INITIAL)

	return (
		<Section className={'flex h-full min-h-0 flex-1 flex-col overflow-hidden'}>
			<Div className={'flex min-h-0 flex-1 flex-col overflow-auto'}>
				<Suspense fallback={<DashboardFallback />}>
					<Dashboard params={parameter} />
				</Suspense>
			</Div>
		</Section>
	)
}

export function BodyFallback() {
	return (
		<Div className={'relative flex size-full min-h-0 flex-1 flex-col overflow-hidden'}>
			<Div className={'flex min-h-0 flex-1 flex-col'}>
				<DashboardFallback />
			</Div>
		</Div>
	)
}

function DashboardFallback() {
	return (
		<Div className={'flex flex-col gap-4 p-4'}>
			<Div className={'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'}>
				{[ 1, 2, 3, 4 ].map((i) => (
					<Div className={'h-24 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800'} key={i} />
				))}
			</Div>
			<Div className={'h-96 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800'} />
		</Div>
	)
}
