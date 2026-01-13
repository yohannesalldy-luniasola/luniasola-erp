'use client'

import type { MetricsData } from '@/app/system/growth/analytics/metrics/action/query'

import { ArrowDown, ArrowUp, DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react'
import { motion }                                                          from 'motion/react'

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

export function KPICards({ metrics }: { readonly metrics : MetricsData }) {
	return (
		<Div className={'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'}>
			<KPICard
				icon={Users}
				title={'Cost per Lead (CPL)'}
				value={formatCurrency(metrics.cpl)}
			/>
			<KPICard
				icon={TrendingUp}
				title={'Customer Acquisition Cost (CAC)'}
				value={formatCurrency(metrics.cac)}
			/>
			<KPICard
				icon={DollarSign}
				title={'Return on Ad Spend (ROAS)'}
				value={metrics.roas.toFixed(2) + 'x'}
			/>
			<KPICard
				icon={ShoppingCart}
				title={'Purchase'}
				value={formatNumber(metrics.purchase)}
			/>
		</Div>
	)
}
