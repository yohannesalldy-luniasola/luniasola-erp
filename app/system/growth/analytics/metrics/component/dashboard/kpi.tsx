'use client'

import type { MetricsData } from '@/app/system/growth/analytics/metrics/action/query'

import { ArrowDown, ArrowUp, Coins, CreditCard, DollarSign, ShoppingCart, Target, TrendingUp, Users } from 'lucide-react'
import { motion }                                                                                     from 'motion/react'

import { Div, Span } from '@/component/canggu/block'
import { Card }      from '@/component/canggu/card'

type KPICardProps = {
	readonly title       : string
	readonly value       : string | number
	readonly icon        : React.ComponentType<{ className? : string }>
	readonly trend?      : 'up' | 'down' | 'neutral'
	readonly trendValue? : string
}

function KPICard({ title, value, icon: Icon, trend, trendValue }: KPICardProps) {
	return (
		<motion.div
			animate={{ opacity : 1, y : 0 }}
			initial={{ opacity : 0, y : 20 }}
			transition={{ duration : 0.3 }}
		>
			<Card className={'p-4'}>
				<Div className={'flex items-center justify-between'}>
					<Div className={'flex flex-col gap-1'}>
						<Span className={'text-xs font-medium text-neutral-500'}>{title}</Span>
						<Span className={'text-2xl font-bold'}>{value}</Span>
						{trend && trendValue && (
							<Div className={'flex items-center gap-1 text-xs'}>
								{trend === 'up' ? (
									<ArrowUp className={'size-3 text-emerald-500'} />
								) : trend === 'down' ? (
									<ArrowDown className={'size-3 text-red-500'} />
								) : null}
								<Span className={trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-neutral-500'}>
									{trendValue}
								</Span>
							</Div>
						)}
					</Div>
					<Div className={'rounded-lg bg-primary/10 p-3'}>
						<Icon className={'size-5 text-primary'} />
					</Div>
				</Div>
			</Card>
		</motion.div>
	)
}

function formatCurrency(value: number): string {
	return new Intl.NumberFormat('id-ID', {
		style                 : 'currency',
		currency              : 'IDR',
		minimumFractionDigits : 0,
		maximumFractionDigits : 0,
	}).format(value)
}

function formatNumber(value: number): string {
	return new Intl.NumberFormat('id-ID').format(value)
}

function formatPercentage(value: number): string {
	return (value * 100).toFixed(1) + '%'
}

export function KPICards({ metrics }: { readonly metrics : MetricsData }) {
	const passedLeadsCount = metrics.leads.filter(lead => lead.status === 'passed').length
	const conversionRate = metrics.totalLeads > 0 ? passedLeadsCount / metrics.totalLeads : 0

	return (
		<Div className={'flex flex-col gap-6'}>
			<Div className={'flex flex-col gap-4'}>
				<Div className={'flex items-center gap-2'}>
					<Span className={'text-lg font-semibold text-neutral-900 dark:text-neutral-100'}>Global KPI Achievement</Span>
				</Div>
				<Div className={'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'}>
					<KPICard
						icon={Users}
						title={'Cost per Lead (CPL)'}
						value={formatCurrency(metrics.cpl)}
					/>
					<KPICard
						icon={DollarSign}
						title={'Return on Ad Spend (ROAS)'}
						value={metrics.roas.toFixed(2) + 'x'}
					/>
					{/* <KPICard
						icon={Users}
						title={'Total Leads'}
						value={formatNumber(metrics.totalLeads)}
					/> */}
					<KPICard
						icon={CreditCard}
						title={'Total Campaign Cost'}
						value={formatCurrency(metrics.totalCost)}
					/>
					<KPICard
						icon={Target}
						title={'Lead Conversion Rate'}
						value={formatPercentage(conversionRate)}
					/>
				</Div>
			</Div>
			<Div className={'flex flex-col gap-4'}>
				<Div className={'flex items-center gap-2'}>
					<Span className={'text-lg font-semibold text-neutral-900 dark:text-neutral-100'}>Deal Stage Metrics</Span>
				</Div>
				<Div className={'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'}>
					<KPICard
						icon={TrendingUp}
						title={'Customer Acquisition Cost (CAC)'}
						value={formatCurrency(metrics.cac)}
					/>
					<KPICard
						icon={Coins}
						title={'Total Revenue'}
						value={formatCurrency(metrics.totalRevenue)}
					/>
					<KPICard
						icon={ShoppingCart}
						title={'Purchase'}
						value={formatNumber(metrics.purchase)}
					/>
				</Div>
			</Div>
		</Div>
	)
}
