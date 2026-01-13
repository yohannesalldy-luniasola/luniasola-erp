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

export const listAccount = cache(async (): Promise<{ data : readonly { id : string, name : string, status : string | null }[] }> => {
	const supabase = await server()
	
	// Get all accounts
	const { data: accounts, error: accountsError } = await supabase
		.from('account')
		.select('id, name')
		.order('name', { ascending : true })

	if (accountsError)
		return { data : [] }

	if (!accounts || accounts.length === 0)
		return { data : [] }

	// Get all leads with their status
	const { data: leads, error: leadsError } = await supabase
		.from('lead')
		.select('name, status')

	if (leadsError)
		return { data : accounts.map(acc => ({ ...acc, status : null })) }

	// Get all people associated with accounts through account_people junction table
	const { data: accountPeople, error: accountPeopleError } = await supabase
		.from('account_people')
		.select('account, people(id, name)')

	if (accountPeopleError)
		return { data : accounts.map(acc => ({ ...acc, status : null })) }

	// Create a map: account_id -> array of people names
	const accountToPeopleMap = new Map<string, string[]>()
	
	accountPeople?.forEach((ap: any) => {
		const accountId = ap.account
		const peopleName = ap.people?.name
		
		if (accountId && peopleName) {
			const existing = accountToPeopleMap.get(accountId) || []
			accountToPeopleMap.set(accountId, [ ...existing, peopleName ])
		}
	})

	// For each account, find the lead status by matching people names with lead names
	const accountsWithStatus = accounts.map((account: any) => {
		const peopleNames = accountToPeopleMap.get(account.id) || []
		
		// Find leads where the lead name matches any of the people names associated with this account
		const relatedLeads = leads?.filter(lead => peopleNames.includes(lead.name)) || []
		
		// If any related lead has status 'passed', use 'passed', otherwise use the first lead's status or null
		const hasPassed = relatedLeads.some(lead => lead.status === 'passed')
		const leadStatus = hasPassed ? 'passed' : (relatedLeads[0]?.status || null)
		
		return {
			id     : account.id,
			name   : account.name,
			status : leadStatus,
		}
	})

	return { data : accountsWithStatus as readonly { id : string, name : string, status : string | null }[] }
})

export const listAvailablePeople = cache(async (): Promise<{ data : readonly { id : string, name : string }[] }> => {
	const supabase = await server()

	// Fetch all people
	const { data: people, error: peopleError } = await supabase
		.from('people')
		.select('id, name')
		.order('name', { ascending : true })

	if (peopleError || !people || people.length === 0)
		return { data : [] }

	// Fetch all people already linked to any account
	const { data: accountPeople, error: accountPeopleError } = await supabase
		.from('account_people')
		.select('people')

	if (accountPeopleError)
		return { data : people as readonly { id : string, name : string }[] }

	const usedPeopleIds = new Set<string>()

	accountPeople?.forEach((row: any) => {
		if (row.people)
			usedPeopleIds.add(row.people as string)
	})

	const availablePeople = (people as readonly { id : string, name : string }[]).filter((person) => !usedPeopleIds.has(person.id))

	return { data : availablePeople }
})
