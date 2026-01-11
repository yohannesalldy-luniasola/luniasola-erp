import type { SchemaSearchParam } from '@/app/system/growth/analytics/metrics/action/schema'

import { getMetrics } from '@/app/system/growth/analytics/metrics/action/query'
import { Charts }     from '@/app/system/growth/analytics/metrics/component/dashboard/charts'
import { Filters }    from '@/app/system/growth/analytics/metrics/component/dashboard/filters'
import { KPICards }   from '@/app/system/growth/analytics/metrics/component/dashboard/kpi'
import { Table }      from '@/app/system/growth/analytics/metrics/component/dashboard/table'
import { Div }        from '@/component/canggu/block'

export async function Dashboard({ params }: { readonly params : SchemaSearchParam }) {
	const metrics = await getMetrics(params)

	return (
		<Div className={'flex flex-col gap-6 p-4 md:p-6'}>
			<Filters params={params} />

			<KPICards metrics={metrics} />

			{/* <Charts metrics={metrics} /> */}

			<Table leads={metrics.leads} />
		</Div>
	)
}
