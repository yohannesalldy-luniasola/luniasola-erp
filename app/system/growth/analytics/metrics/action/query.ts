import 'server-only'

import type { SchemaSearchParam } from '@/app/system/growth/analytics/metrics/action/schema'

import { cache } from 'react'

import { server } from '@/library/supabase/server'

export type LeadMetric = {
	readonly id         : string
	readonly name       : string
	readonly gclid      : string | null
	readonly fbclid     : string | null
	readonly status     : string
	readonly created_at : string
}

export type DealMetric = {
	readonly id         : string
	readonly revenue    : number
	readonly created_at : string
}

export type CampaignMetric = {
	readonly campaign : string
	readonly cost     : number
	readonly date     : string
}

export type MetricsData = {
	readonly leads        : readonly LeadMetric[]
	readonly deals        : readonly DealMetric[]
	readonly campaigns    : readonly CampaignMetric[]
	readonly totalLeads   : number
	readonly totalDeals   : number
	readonly totalRevenue : number
	readonly totalCost    : number
	readonly cpl          : number
	readonly cac          : number
	readonly roas         : number
	readonly purchase     : number
}

export const getMetrics = cache(async (params: SchemaSearchParam): Promise<MetricsData> => {
	const supabase = await server()

	const { dateFrom, dateTo, campaign, channel } = params

	let leadsQuery = supabase.from('lead').select('*')

	if (dateFrom) {
		const dateFromIndonesia = dateFrom + 'T00:00:00+07:00'
		const dateFromUTC = new Date(dateFromIndonesia)
		const dateFromStart = dateFromUTC.toISOString()
		leadsQuery = leadsQuery.gte('created_at', dateFromStart)
	}

	if (dateTo) {
		const dateToNextDayIndonesia = dateTo + 'T00:00:00+07:00'
		const dateToNextDayUTC = new Date(dateToNextDayIndonesia)
		dateToNextDayUTC.setUTCDate(dateToNextDayUTC.getUTCDate() + 1)
		const dateToEnd = dateToNextDayUTC.toISOString()
		leadsQuery = leadsQuery.lt('created_at', dateToEnd)
	}

	if (campaign)
		leadsQuery = leadsQuery.or('gclid.ilike.%' + campaign + '%,fbclid.ilike.%' + campaign + '%')

	if (channel && channel !== 'all') {
		if (channel === 'google')
			leadsQuery = leadsQuery.not('gclid', 'is', null)
		else if (channel === 'facebook')
			leadsQuery = leadsQuery.not('fbclid', 'is', null)
	}

	const { data: leadsData, error: leadsError } = await leadsQuery

	if (leadsError)
		throw new Error('Failed to fetch leads: ' + leadsError.message)

	const leads = (leadsData ?? []) as readonly LeadMetric[]

	let deals: readonly DealMetric[] = []
	try {
		let dealsQuery = supabase.from('deal').select('*')

		if (dateFrom) {
			const dateFromIndonesia = dateFrom + 'T00:00:00+07:00'
			const dateFromUTC = new Date(dateFromIndonesia)
			const dateFromStart = dateFromUTC.toISOString()
			dealsQuery = dealsQuery.gte('created_at', dateFromStart)
		}

		if (dateTo) {
			const dateToNextDayIndonesia = dateTo + 'T00:00:00+07:00'
			const dateToNextDayUTC = new Date(dateToNextDayIndonesia)
			dateToNextDayUTC.setUTCDate(dateToNextDayUTC.getUTCDate() + 1)
			const dateToEnd = dateToNextDayUTC.toISOString()
			dealsQuery = dealsQuery.lt('created_at', dateToEnd)
		}

		const { data: dealsData } = await dealsQuery
		deals = (dealsData ?? []) as readonly DealMetric[]
	} catch {
		deals = []
	}

	const totalLeads = leads.length
	const totalDeals = deals.length
	const totalRevenue = deals.reduce((sum, deal) => sum + (deal.revenue || 0), 0)
	
	const campaigns = leads.map(lead => ({
		campaign : lead.gclid || lead.fbclid || 'Unknown',
		cost     : 0,
		date     : lead.created_at,
	}))

	const totalCost = campaigns.reduce((sum, c) => sum + c.cost, 0)

	const cpl = totalLeads > 0 && totalCost > 0 ? totalCost / totalLeads : 0
	const cac = totalDeals > 0 && totalCost > 0 ? totalCost / totalDeals : 0
	const roas = totalCost > 0 ? totalRevenue / totalCost : 0
	const purchase = totalDeals

	return {
		leads,
		deals,
		campaigns,
		totalLeads,
		totalDeals,
		totalRevenue,
		totalCost,
		cpl,
		cac,
		roas,
		purchase,
	}
})
