import 'server-only'

import type { ColumnTable } from '@/app/system/growth/datasource/deal/action/schema'

import { cache } from 'react'

import { TABLE, STAGE_VALUES } from '@/app/system/growth/datasource/deal/action/schema'
import { server }             from '@/library/supabase/server'

export type DealByStage = {
	readonly stage : typeof STAGE_VALUES[number]
	readonly deals : readonly (ColumnTable & { account : { id : string, name : string } | null })[]
	readonly total  : number
}

const DISPLAY_STAGES = [ 'Discovery', 'Proposal', 'Negotiation', 'Administration', 'Won' ] as const

export const listByStage = cache(async (filters?: { stage? : string, source? : string, account? : string }): Promise<readonly DealByStage[]> => {
	const supabase = await server()

	let query = supabase
		.from(TABLE)
		.select('*, account(id, name)')
		.order('date_creation', { ascending : false })

	if (filters?.stage)
		query = query.eq('stage', filters.stage)

	if (filters?.source)
		query = query.eq('source', filters.source)

	if (filters?.account)
		query = query.eq('account', filters.account)

	const { data, error } = await query

	if (error)
		throw new Error('Failed to fetch deals: ' + error.message)

	const deals = (data ?? []).map((deal: any) => ({
		...deal,
		account : Array.isArray(deal.account) ? deal.account[0] || null : deal.account || null,
	})) as readonly (ColumnTable & { account : { id : string, name : string } | null })[]

	const dealsByStage = DISPLAY_STAGES.map(stage => {
		const stageDeals = deals.filter(deal => deal.stage === stage)
		const total = stageDeals.reduce((sum, deal) => sum + (Number(deal.amount) || 0), 0)

		return {
			stage,
			deals : stageDeals,
			total,
		}
	})

	return dealsByStage
})

export const listAccount = cache(async (): Promise<{ data : readonly { id : string, name : string }[] }> => {
	const supabase = await server()
	
	const { data, error } = await supabase.from('account').select('id, name').order('name', { ascending : true })

	if (error)
		return { data : [] }

	return { data : (data ?? []) as readonly { id : string, name : string }[] }
})
