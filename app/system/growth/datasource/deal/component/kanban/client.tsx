'use client'

import type { DealByStage } from '@/app/system/growth/datasource/deal/action/schema'

import dynamic from 'next/dynamic'

const KanbanClient = dynamic(() => import('@/app/system/growth/datasource/deal/component/kanban').then(mod => ({ default : mod.Kanban })), {
	ssr : false,
})

type KanbanClientProps = {
	readonly data    : readonly DealByStage[]
	readonly account : readonly { id : string, name : string, status : string | null }[]
	readonly people  : readonly { id : string, name : string }[]
}

export function KanbanClientWrapper({ data, account, people }: KanbanClientProps) {
	return <KanbanClient account={account} data={data} people={people} />
}
