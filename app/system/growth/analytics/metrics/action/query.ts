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
	readonly stage      : string | null
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

	// Fetch all deals with account and people for matching
	const { data: allDealsData, error: allDealsError } = await supabase
		.from('deal')
		.select('id, account, people, stage')

	if (allDealsError)
		throw new Error('Failed to fetch deals: ' + allDealsError.message)

	// Fetch all people for name matching
	const { data: peopleData, error: peopleError } = await supabase
		.from('people')
		.select('id, name')

	if (peopleError)
		throw new Error('Failed to fetch people: ' + peopleError.message)

	// Fetch account_people relationships
	const { data: accountPeopleData, error: accountPeopleError } = await supabase
		.from('account_people')
		.select('account, people')

	if (accountPeopleError)
		throw new Error('Failed to fetch account_people: ' + accountPeopleError.message)

	// Create mapping: people name -> people id
	const peopleNameToIdMap = new Map<string, string>()
	peopleData?.forEach((person: any) => {
		if (person.name)
			peopleNameToIdMap.set(person.name, person.id)
	})

	// Create mapping: account id -> array of people ids
	const accountToPeopleMap = new Map<string, string[]>()
	accountPeopleData?.forEach((ap: any) => {
		if (ap.account && ap.people) {
			const existing = accountToPeopleMap.get(ap.account) || []
			accountToPeopleMap.set(ap.account, [ ...existing, ap.people ])
		}
	})

	// Create mapping: people id -> deal stage (from deals with direct people match)
	const peopleIdToStageMap = new Map<string, string>()
	
	// Create mapping: account id -> deal stage (from deals with account match)
	const accountToStageMap = new Map<string, string>()

	allDealsData?.forEach((deal: any) => {
		if (deal.people && deal.stage) {
			// Direct people match - use latest deal if multiple
			const existingStage = peopleIdToStageMap.get(deal.people)
			if (!existingStage || (deal.stage && deal.stage !== existingStage))
				peopleIdToStageMap.set(deal.people, deal.stage)
		}
		if (deal.account && deal.stage) {
			// Account match - use latest deal if multiple
			const existingStage = accountToStageMap.get(deal.account)
			if (!existingStage || (deal.stage && deal.stage !== existingStage))
				accountToStageMap.set(deal.account, deal.stage)
		}
	})

	// Create reverse mapping: people id -> array of account ids (from account_people)
	const peopleIdToAccountsMap = new Map<string, string[]>()
	accountPeopleData?.forEach((ap: any) => {
		if (ap.account && ap.people) {
			const existing = peopleIdToAccountsMap.get(ap.people) || []
			peopleIdToAccountsMap.set(ap.people, [ ...existing, ap.account ])
		}
	})

	// Create set of filtered lead names for deal filtering
	// Note: leadsData is already filtered by date and channel, so this ensures
	// that only deals associated with channel-filtered leads are included
	const filteredLeadNames = new Set<string>()
	leadsData?.forEach((lead: any) => {
		if (lead.name)
			filteredLeadNames.add(lead.name)
	})

	// Create set of people IDs associated with filtered leads
	// This ensures channel filter is applied to won deals through people matching
	const filteredPeopleIds = new Set<string>()
	filteredLeadNames.forEach((leadName) => {
		const peopleId = peopleNameToIdMap.get(leadName)
		if (peopleId)
			filteredPeopleIds.add(peopleId)
	})

	// Create set of account IDs associated with filtered leads (through account_people)
	// This ensures channel filter is applied to won deals through account matching
	const filteredAccountIds = new Set<string>()
	filteredPeopleIds.forEach((peopleId) => {
		const accountIds = peopleIdToAccountsMap.get(peopleId) || []
		accountIds.forEach((accountId) => filteredAccountIds.add(accountId))
	})

	// Map leads to stages
	const leads = (leadsData ?? []).map((lead: any) => {
		const leadName = lead.name
		const peopleId = peopleNameToIdMap.get(leadName)
		
		let stage: string | null = null
		
		if (peopleId) {
			// Try direct people match first (deal.people = people.id)
			stage = peopleIdToStageMap.get(peopleId) || null
			
			// If no direct match, try through account (deal.account -> account_people -> people.id)
			if (!stage) {
				const accountIds = peopleIdToAccountsMap.get(peopleId) || []
				for (const accountId of accountIds) {
					const accountStage = accountToStageMap.get(accountId)
					if (accountStage) {
						stage = accountStage
						break
					}
				}
			}
		}
		
		return {
			...lead,
			stage: stage || null,
		}
	}) as readonly LeadMetric[]

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
		
		// Filter deals to only include those associated with filtered leads
		const filteredDeals = (dealsData ?? []).filter((deal: any) => {
			// Direct people match
			if (deal.people && filteredPeopleIds.has(deal.people))
				return true
			
			// Indirect account match
			if (deal.account && filteredAccountIds.has(deal.account))
				return true
			
			return false
		})
		
		deals = filteredDeals as readonly DealMetric[]
	} catch {
		deals = []
	}

	// Fetch won deals for CAC calculation (with account, people, and source for filtering)
	let wonDealsWithRelationsQuery = supabase.from('deal').select('id, account, people, amount, date_creation, stage, source').eq('stage', 'Won').not('stage', 'is', null)

	if (dateFrom) {
		const dateFromIndonesia = dateFrom + 'T00:00:00+07:00'
		const dateFromUTC = new Date(dateFromIndonesia)
		const dateFromStart = dateFromUTC.toISOString()
		wonDealsWithRelationsQuery = wonDealsWithRelationsQuery.gte('date_creation', dateFromStart)
	}

	if (dateTo) {
		const dateToNextDayIndonesia = dateTo + 'T00:00:00+07:00'
		const dateToNextDayUTC = new Date(dateToNextDayIndonesia)
		dateToNextDayUTC.setUTCDate(dateToNextDayUTC.getUTCDate() + 1)
		const dateToEnd = dateToNextDayUTC.toISOString()
		wonDealsWithRelationsQuery = wonDealsWithRelationsQuery.lt('date_creation', dateToEnd)
	}

	const { data: wonDealsWithRelationsData, error: wonDealsWithRelationsError } = await wonDealsWithRelationsQuery

	if (wonDealsWithRelationsError)
		throw new Error('Failed to fetch won deals: ' + wonDealsWithRelationsError.message)

	// Filter won deals to only include those matching the channel filter
	// Channel filter is applied by checking deal.source field
	const filteredWonDealsData = (wonDealsWithRelationsData ?? []).filter((deal: any) => {
		// Exclude deals without stage status
		if (!deal.stage || deal.stage === null || deal.stage === undefined)
			return false
		
		// Apply channel filter based on deal source
		if (channel && channel !== 'all') {
			if (channel === 'google') {
				// Only include Google Ads deals
				if (deal.source !== 'Google Ads')
					return false
			} else if (channel === 'facebook') {
				// Only include Meta Ads deals
				if (deal.source !== 'Meta Ads')
					return false
			}
		}
		
		// Only include deals associated with leads that match the date filter
		// Direct people match: deal.people must be in filteredPeopleIds (from date-filtered leads)
		if (deal.people && filteredPeopleIds.has(deal.people))
			return true
		
		// Indirect account match: deal.account must be in filteredAccountIds (from date-filtered leads)
		if (deal.account && filteredAccountIds.has(deal.account))
			return true
		
		// Exclude deals not associated with any filtered leads
		return false
	})

	const wonDealsCount = filteredWonDealsData.length

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
	const totalRevenue = filteredWonDealsData.reduce((sum: number, deal: any) => sum + (Number(deal.amount) || 0), 0)
	
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
