import type { SearchParams } from '@/type/next'

import { Suspense } from 'react'

import { listAccount }                                                      from '@/app/system/growth/datasource/deal/action/query'
import { ToolbarFilter }                                                    from '@/app/system/growth/datasource/deal/component/toolbar/filter'
import { SCHEMA_SEARCH_PARAMS, SCHEMA_SEARCH_PARAMS_INITIAL }              from '@/app/system/growth/datasource/deal/action/schema'
import { parse }                                                             from '@/component/utility/parameter'
import { Skeleton }                                                          from '@/component/canggu/skeleton'

export async function Toolbar({ searchParams }: { readonly searchParams : SearchParams }) {
	const parameter = await parse(searchParams, SCHEMA_SEARCH_PARAMS, SCHEMA_SEARCH_PARAMS_INITIAL)
	const { data: account } = await listAccount()

	return (
		<Suspense fallback={<ToolbarFallback />}>
			<ToolbarFilter account={account} params={parameter} />
		</Suspense>
	)
}

export function ToolbarFallback() {
	return <Skeleton className={'h-32 w-full'} />
}

