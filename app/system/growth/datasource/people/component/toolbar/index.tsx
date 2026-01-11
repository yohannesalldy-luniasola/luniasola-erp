import type { SearchParams } from '@/type/next'

import { ToolbarLimit, ToolbarLimitFallback }                               from '@/app/system/component/toolbar/limit'
import { list }                                                             from '@/app/system/growth/datasource/people/action/query'
import { SCHEMA_SEARCH_PARAMS_INITIAL, SCHEMA_LIMIT, SCHEMA_SEARCH_PARAMS } from '@/app/system/growth/datasource/people/action/schema'
import { ToolbarDisplay, ToolbarDisplayFallback }                           from '@/app/system/growth/datasource/people/component/toolbar/display'
import { ToolbarFilter, ToolbarFilterFallback }                             from '@/app/system/growth/datasource/people/component/toolbar/filter'
import { ToolbarProduce, ToolbarProduceFallback }                           from '@/app/system/growth/datasource/people/component/toolbar/produce'
import { Section }                                                          from '@/component/canggu/block'
import { parse }                                                            from '@/component/utility/parameter'

export async function Toolbar({ searchParams }: { readonly searchParams : SearchParams }) {
	const parameters = await parse(searchParams, SCHEMA_SEARCH_PARAMS, SCHEMA_SEARCH_PARAMS_INITIAL)
	const { data } 	 = await list(parameters)

	return (
		<Section aria-label={'Toolbar'} className={'flex flex-row gap-2 md:gap-0.5'} role={'toolbar'}>
			<ToolbarLimit limitDefault={SCHEMA_SEARCH_PARAMS_INITIAL.limit} options={SCHEMA_LIMIT} />
			<ToolbarFilter />
			<ToolbarDisplay disabled={data.length === 0} />
			<ToolbarProduce data={data} />
		</Section>
	)
}

export function ToolbarFallback() {
	return (
		<Section aria-label={'Toolbar Fallback'} className={'flex flex-row gap-0.5'} role={'toolbar'}>
			<ToolbarLimitFallback />
			<ToolbarFilterFallback className={'w-28'} />
			<ToolbarDisplayFallback className={'hidden md:block'} />
			<ToolbarProduceFallback className={'hidden md:block'} />
		</Section>
	)
}
