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
			dealsQuery = dealsQuery.gte('date_creation', dateFromStart)
		}

		if (dateTo) {
			const dateToNextDayIndonesia = dateTo + 'T00:00:00+07:00'
			const dateToNextDayUTC = new Date(dateToNextDayIndonesia)
			dateToNextDayUTC.setUTCDate(dateToNextDayUTC.getUTCDate() + 1)
			const dateToEnd = dateToNextDayUTC.toISOString()
			dealsQuery = dealsQuery.lt('date_creation', dateToEnd)
		}

		const { data: dealsData } = await dealsQuery
		deals = (dealsData ?? []) as readonly DealMetric[]
	} catch {
		deals = []
	}

	// Fetch won deals for CAC calculation
	let wonDealsQuery = supabase.from('deal').select('amount, date_creation').eq('stage', 'Won')

	if (dateFrom) {
		const dateFromIndonesia = dateFrom + 'T00:00:00+07:00'
		const dateFromUTC = new Date(dateFromIndonesia)
		const dateFromStart = dateFromUTC.toISOString()
		wonDealsQuery = wonDealsQuery.gte('date_creation', dateFromStart)
	}

	if (dateTo) {
		const dateToNextDayIndonesia = dateTo + 'T00:00:00+07:00'
		const dateToNextDayUTC = new Date(dateToNextDayIndonesia)
		dateToNextDayUTC.setUTCDate(dateToNextDayUTC.getUTCDate() + 1)
		const dateToEnd = dateToNextDayUTC.toISOString()
		wonDealsQuery = wonDealsQuery.lt('date_creation', dateToEnd)
	}

	const { data: wonDealsData, error: wonDealsError } = await wonDealsQuery

	if (wonDealsError)
		throw new Error('Failed to fetch won deals: ' + wonDealsError.message)

	const wonDealsCount = (wonDealsData ?? []).length

	// Fetch total cost from ads_performance table
	let adsQuery = supabase.from('ads_performance').select('cost, date_creation, date')

	if (dateFrom) {
		const dateFromIndonesia = dateFrom + 'T00:00:00+07:00'
		const dateFromUTC = new Date(dateFromIndonesia)
		const dateFromStart = dateFromUTC.toISOString()
		adsQuery = adsQuery.gte('date_creation', dateFromStart)
	}

	if (dateTo) {
		const dateToNextDayIndonesia = dateTo + 'T00:00:00+07:00'
		const dateToNextDayUTC = new Date(dateToNextDayIndonesia)
		dateToNextDayUTC.setUTCDate(dateToNextDayUTC.getUTCDate() + 1)
		const dateToEnd = dateToNextDayUTC.toISOString()
		adsQuery = adsQuery.lt('date_creation', dateToEnd)
	}

	if (channel && channel !== 'all') {
		adsQuery = adsQuery.eq('channel', channel)
	}

	const { data: adsData, error: adsError } = await adsQuery

	if (adsError)
		throw new Error('Failed to fetch ads performance: ' + adsError.message)

	const totalCost = (adsData ?? []).reduce((sum: number, ad: any) => sum + (Number(ad.cost) || 0), 0)

	// Count leads with 'passed' status (already filtered by date above)
	const passedLeadsCount = leads.filter(lead => lead.status === 'passed').length

	const totalLeads = leads.length
	const totalDeals = deals.length
	
	// Calculate total revenue from won deals (sum of amount from deals with stage 'Won')
	const totalRevenue = (wonDealsData ?? []).reduce((sum: number, deal: any) => sum + (Number(deal.amount) || 0), 0)
	
	const campaigns = leads.map(lead => ({
		campaign : lead.gclid || lead.fbclid || 'Unknown',
		cost     : 0,
		date     : lead.created_at,
	}))

	const cpl = passedLeadsCount > 0 && totalCost > 0 ? totalCost / passedLeadsCount : 0
	const cac = wonDealsCount > 0 && totalCost > 0 ? totalCost / wonDealsCount : 0
	const roas = totalCost > 0 ? totalRevenue / totalCost : 0
	const purchase = wonDealsCount

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
