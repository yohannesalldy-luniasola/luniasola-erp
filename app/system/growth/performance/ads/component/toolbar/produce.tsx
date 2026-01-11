'use client'

import type { ColumnTable } from '@/app/system/growth/performance/ads/action/schema'

import { useSearchParams } from 'next/navigation'

import { useCallback } from 'react'

import { ToolbarProduce as ToolbarProduceRoot }                                       from '@/app/system/component/toolbar/produce'
import { LABEL, TABLE_COLUMN_INITIAL, TABLE_COLUMN_LABELS, TABLE_COLUMN_LOCKED }      from '@/app/system/growth/performance/ads/action/schema'
import { useTableColumnVisibility }                                                   from '@/component/hook/table'
import { produceExcel, produceCSV, producePDF, produceValidation, produceExtraction } from '@/component/utility/produce'

export function ToolbarProduce({ data }: { readonly data : readonly ColumnTable[] }) {
	const searchParams   = useSearchParams()
	const [ visibility ] = useTableColumnVisibility(LABEL, TABLE_COLUMN_INITIAL, TABLE_COLUMN_LOCKED)

	const performProduce = useCallback((type: 'excel' | 'csv' | 'pdf') => {
		produceValidation(data)

		const filters = produceExtraction(searchParams, [ 'channel' ])
		const dataMap = data.map((record) => {
			const account = record.adsPerformanceAccount?.map((association) => association.account?.name).filter((name): name is string => Boolean(name)).join(', ') ?? ''

			return { ...record, account : account }
		})

		switch (type) {
			case 'excel':
				produceExcel({ data : dataMap, visibility, label : TABLE_COLUMN_LABELS, filename : LABEL })
				break

			case 'csv':
				produceCSV({ data : dataMap, visibility, label : TABLE_COLUMN_LABELS, filename : LABEL })
				break

			case 'pdf':
				producePDF({ data : dataMap, visibility, label : TABLE_COLUMN_LABELS, filters, filename : LABEL, title : LABEL })
				break
		}
	}, [ data, searchParams, visibility ])

	return <ToolbarProduceRoot disabled={data.length === 0} output={[ 'csv', 'excel', 'pdf' ]} onProduce={performProduce} />
}

export { ToolbarProduceFallback } from '@/app/system/component/toolbar/produce'
