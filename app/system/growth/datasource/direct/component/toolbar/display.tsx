'use client'

import type { Column } from '@/app/system/growth/datasource/direct/action/schema'

import { ToolbarDisplay as ToolbarDisplayRoot }                                                from '@/app/system/component/toolbar/display'
import { LABEL, TABLE_COLUMN, TABLE_COLUMN_INITIAL, TABLE_COLUMN_LABELS, TABLE_COLUMN_LOCKED } from '@/app/system/growth/datasource/direct/action/schema'
import { useTableColumnVisibility }                                                            from '@/component/hook/table'

export function ToolbarDisplay({ disabled }: { readonly disabled : boolean }) {
	const [ visibility, setVisibility ] = useTableColumnVisibility(LABEL, TABLE_COLUMN_INITIAL, TABLE_COLUMN_LOCKED)
	
	return <ToolbarDisplayRoot<Column> columns={TABLE_COLUMN} disabled={disabled} labels={TABLE_COLUMN_LABELS} locked={TABLE_COLUMN_LOCKED} setVisibility={setVisibility} visibility={visibility} />
}

export { ToolbarDisplayFallback } from '@/app/system/component/toolbar/display'
