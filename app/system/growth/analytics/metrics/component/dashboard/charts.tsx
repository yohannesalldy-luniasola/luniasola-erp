'use client'

import type { MetricsData } from '@/app/system/growth/analytics/metrics/action/query'

import { useMemo } from 'react'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'

import { Div, Span, Small } from '@/component/canggu/block'
import { Card }             from '@/component/canggu/card'

type TooltipPayload = {
	value : number
	name  : string
}

type CustomTooltipProps = {
	active?  : boolean
	payload? : TooltipPayload[]
	label?   : string
}

function formatCurrency(value: number): string {
	if (value === 0)
		return 'Rp 0'

	return new Intl.NumberFormat('id-ID', {
		style                 : 'currency',
		currency              : 'IDR',
		minimumFractionDigits : 0,
		maximumFractionDigits : 0,
	}).format(value)
}

function formatCampaignName(campaign: string): string {
	if (campaign === 'Unknown')
		return 'Unknown'

	if (campaign.length > 12)
		return campaign.substring(0, 9) + '...'

	return campaign
}

function getCampaignLabel(campaign: string): string {
	if (campaign === 'Unknown')
		return 'Unknown'

	if (campaign.startsWith('GCLID:'))
		return 'G: ' + formatCampaignName(campaign.replace('GCLID:', ''))

	if (campaign.startsWith('FBCLID:'))
		return 'FB: ' + formatCampaignName(campaign.replace('FBCLID:', ''))

	return formatCampaignName(campaign)
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
	if (active && payload && payload.length) {
		return (
			<Div className={'rounded-lg border border-neutral-200 bg-white p-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-950'}>
				<Small className={'mb-2 block font-semibold'}>{label}</Small>
				{payload.map((entry, index) => (
					<Div className={'flex items-center gap-2 text-sm'} key={index}>
						<Span className={'text-neutral-500'}>{entry.name}:</Span>
						<Span className={'font-medium'}>
							{entry.name === 'CPL' || entry.name === 'CAC'
								? formatCurrency(entry.value)
								: entry.name === 'ROAS'
									? entry.value.toFixed(2) + 'x'
									: entry.value.toLocaleString('id-ID')}
						</Span>
					</Div>
				))}
			</Div>
		)
	}

	return null
}

export function Charts({ metrics }: { readonly metrics : MetricsData }) {
	const chartData = useMemo(() => {
		const campaignMap = new Map<string, { campaign : string, campaignLabel : string, leads : number, deals : number, revenue : number }>()

		metrics.leads.forEach(lead => {
			const campaignId = lead.gclid ? 'GCLID:' + lead.gclid : lead.fbclid ? 'FBCLID:' + lead.fbclid : 'Unknown'
			const campaignLabel = lead.gclid ? 'GCLID: ' + formatCampaignName(lead.gclid) : lead.fbclid ? 'FBCLID: ' + formatCampaignName(lead.fbclid) : 'Unknown'
			const existing = campaignMap.get(campaignId) || { campaign : campaignId, campaignLabel, leads : 0, deals : 0, revenue : 0 }

			existing.leads += 1
			campaignMap.set(campaignId, existing)
		})

		metrics.deals.forEach(deal => {
			const campaignId = 'Unknown'
			const campaignLabel = 'Unknown'
			const existing = campaignMap.get(campaignId) || { campaign : campaignId, campaignLabel, deals : 0, leads : 0, revenue : 0 }

			existing.deals += 1
			existing.revenue += deal.revenue || 0
			campaignMap.set(campaignId, existing)
		})

		return Array.from(campaignMap.values())
			.map(item => ({
				campaign     : getCampaignLabel(item.campaign),
				campaignFull : item.campaignLabel,
				cac          : item.deals > 0 && metrics.totalCost > 0 ? metrics.totalCost / item.deals : 0,
				cpl          : item.leads > 0 && metrics.totalCost > 0 ? metrics.totalCost / item.leads : 0,
				leads        : item.leads,
				purchase     : item.deals,
				roas         : metrics.totalCost > 0 ? item.revenue / metrics.totalCost : 0,
			}))
			.sort((a, b) => b.leads - a.leads)
			.slice(0, 10)
	}, [ metrics ])

	if (chartData.length === 0) {
		return (
			<Div className={'grid grid-cols-1 gap-6 lg:grid-cols-2'}>
				<Card className={'p-8'}>
					<Div className={'flex flex-col items-center justify-center gap-2 text-center'}>
						<Span className={'text-sm font-medium text-neutral-500'}>No campaign data available</Span>
						<Small className={'mt-1 block text-xs text-neutral-400'}>Submit a form to see campaign metrics</Small>
					</Div>
				</Card>
				<Card className={'p-8'}>
					<Div className={'flex flex-col items-center justify-center gap-2 text-center'}>
						<Span className={'text-sm font-medium text-neutral-500'}>No campaign data available</Span>
						<Small className={'mt-1 block text-xs text-neutral-400'}>Submit a form to see campaign metrics</Small>
					</Div>
				</Card>
			</Div>
		)
	}

	return (
		<Div className={'grid grid-cols-1 gap-6 lg:grid-cols-2'}>
			<Card className={'p-6'}>
				<Div className={'mb-6'}>
					<Span className={'text-base font-semibold'}>CPL & CAC by Campaign</Span>
					<Small className={'mt-1 block text-xs text-neutral-500'}>Cost Per Lead and Customer Acquisition Cost</Small>
				</Div>
				<ResponsiveContainer height={350} width={'100%'}>
					<BarChart data={chartData} margin={{ bottom : 80, left : 0, right : 20, top : 10 }}>
						<CartesianGrid opacity={0.5} stroke={'#e5e7eb'} strokeDasharray={'3 3'} />
						<XAxis
							angle={-45}
							dataKey={'campaign'}
							height={100}
							interval={0}
							stroke={'#6b7280'}
							textAnchor={'end'}
							tick={{ fontSize : 11 }}
						/>
						<YAxis
							stroke={'#6b7280'}
							tick={{ fontSize : 11 }}
							tickFormatter={(value) => {
								if (value === 0)
									return 'Rp 0'

								if (value >= 1000000)
									return 'Rp ' + (value / 1000000).toFixed(1) + 'M'

								if (value >= 1000)
									return 'Rp ' + (value / 1000).toFixed(0) + 'K'

								return 'Rp ' + value.toFixed(0)
							}}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Legend wrapperStyle={{ paddingTop : '20px' }} />
						<Bar dataKey={'cpl'} fill={'#3b82f6'} name={'CPL'} radius={[ 4, 4, 0, 0 ]} />
						<Bar dataKey={'cac'} fill={'#10b981'} name={'CAC'} radius={[ 4, 4, 0, 0 ]} />
					</BarChart>
				</ResponsiveContainer>
			</Card>

			<Card className={'p-6'}>
				<Div className={'mb-6'}>
					<Span className={'text-base font-semibold'}>ROAS & Purchase by Campaign</Span>
					<Small className={'mt-1 block text-xs text-neutral-500'}>Return on Ad Spend and Purchase Count</Small>
				</Div>
				<ResponsiveContainer height={350} width={'100%'}>
					<LineChart data={chartData} margin={{ bottom : 80, left : 0, right : 20, top : 10 }}>
						<CartesianGrid opacity={0.5} stroke={'#e5e7eb'} strokeDasharray={'3 3'} />
						<XAxis
							angle={-45}
							dataKey={'campaign'}
							height={100}
							interval={0}
							stroke={'#6b7280'}
							textAnchor={'end'}
							tick={{ fontSize : 11 }}
						/>
						<YAxis stroke={'#6b7280'} tick={{ fontSize : 11 }} yAxisId={'left'} />
						<YAxis orientation={'right'} stroke={'#6b7280'} tick={{ fontSize : 11 }} yAxisId={'right'} />
						<Tooltip content={<CustomTooltip />} />
						<Legend wrapperStyle={{ paddingTop : '20px' }} />
						<Line
							activeDot={{ r : 6 }}
							dataKey={'roas'}
							dot={{ fill : '#8b5cf6', r : 4 }}
							name={'ROAS'}
							stroke={'#8b5cf6'}
							strokeWidth={2}
							type={'monotone'}
							yAxisId={'left'}
						/>
						<Line
							activeDot={{ r : 6 }}
							dataKey={'purchase'}
							dot={{ fill : '#f59e0b', r : 4 }}
							name={'Purchase'}
							stroke={'#f59e0b'}
							strokeWidth={2}
							type={'monotone'}
							yAxisId={'right'}
						/>
					</LineChart>
				</ResponsiveContainer>
			</Card>
		</Div>
	)
}
