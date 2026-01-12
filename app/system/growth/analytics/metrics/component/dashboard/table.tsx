'use client'

import type { LeadMetric } from '@/app/system/growth/analytics/metrics/action/query'

import { useCallback } from 'react'

import { ExternalLink, MessageSquare } from 'lucide-react'

import { Badge }                                                                      from '@/component/canggu/badge'
import { Div, Span, Small }                                                           from '@/component/canggu/block'
import { Card }                                                                       from '@/component/canggu/card'
import { Table as TableRoot, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/component/canggu/table'
import { ExtraSmall }                                                                 from '@/component/canggu/typography'
import { classNames }                                                                 from '@/component/utility/style'

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('id-ID', {
		year  : 'numeric',
		month : 'short',
		day   : 'numeric',
	})
}

function getStatusColor(status: string): string {
	const colors = {
		'pending'     : 'bg-yellow-500',
		'in progress' : 'bg-blue-500',
		'cancelled'   : 'bg-red-500',
		'passed'      : 'bg-emerald-500',
	}

	return colors[status as keyof typeof colors] || 'bg-neutral-400'
}

function openWhatsApp(gclid: string | null, fbclid: string | null, name: string) {
	const phoneNumber = '6288297032508'
	let message = 'Hello! I would like to follow up on my consultation request.\n\n'
	message += 'Name: ' + name + '\n'
	
	if (gclid || fbclid) {
		message += '\nTracking Information\n'
		if (gclid)
			message += 'GCLID: ' + gclid + '\n'
		if (fbclid)
			message += 'FBCLID: ' + fbclid + '\n'
	}

	const encodedMessage = encodeURIComponent(message.trim())
	const whatsappUrl = 'https://wa.me/' + phoneNumber + '?text=' + encodedMessage

	window.open(whatsappUrl, '_blank')
}

export function Table({ leads }: { readonly leads : readonly LeadMetric[] }) {
	const handleLeadClick = useCallback((lead: LeadMetric) => {
		openWhatsApp(lead.gclid, lead.fbclid, lead.name)
	}, [])

	return (
		<Card className={'p-4'}>
			<Div className={'mb-4'}>
				<Span className={'text-sm font-semibold'}>Lead Details</Span>
			</Div>

			<Div className={'overflow-x-auto'}>
				<TableRoot>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>GCLID</TableHead>
							<TableHead>FBCLID</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Date</TableHead>
							<TableHead className={'text-right'}>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{leads.length === 0 ? (
							<TableRow>
								<TableCell className={'text-center text-neutral-500'} colSpan={6}>
									No leads found
								</TableCell>
							</TableRow>
						) : (
							leads.map((lead) => (
								<TableRow className={'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900'} key={lead.id} onClick={() => handleLeadClick(lead)}>
									<TableCell>
										<Span className={'font-medium'}>{lead.name}</Span>
									</TableCell>
									<TableCell>
										<Small className={'text-neutral-500'}>{lead.gclid || '-'}</Small>
									</TableCell>
									<TableCell>
										<Small className={'text-neutral-500'}>{lead.fbclid || '-'}</Small>
									</TableCell>
									<TableCell>
										<Badge>
											<Span className={classNames('size-2 rounded-full', getStatusColor(lead.status))} />
											<ExtraSmall className={'font-semibold text-inherit! capitalize'}>{lead.status}</ExtraSmall>
										</Badge>
									</TableCell>
									<TableCell>
										<Small className={'text-neutral-500'}>{formatDate(lead.created_at)}</Small>
									</TableCell>
									<TableCell className={'text-right'}>
										<Div className={'flex items-center justify-end gap-2'}>
											<MessageSquare className={'size-4 text-primary'} />
											<ExternalLink className={'size-3 text-neutral-400'} />
										</Div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</TableRoot>
			</Div>
		</Card>
	)
}
