'use client'

import type { DealByStage } from '@/app/system/growth/datasource/deal/action/query'

import dynamic from 'next/dynamic'

const KanbanClient = dynamic(() => import('@/app/system/growth/datasource/deal/component/kanban').then(mod => ({ default : mod.Kanban })), {
	ssr : false,
})

type KanbanClientProps = {
	readonly data : readonly DealByStage[]
}

export function KanbanClientWrapper({ data }: KanbanClientProps) {
	return <KanbanClient data={data} />
}
