import { Megaphone, Sparkles } from 'lucide-react'

import { Section, Div, Span } from '@/component/canggu/block'
import { Separator }           from '@/component/canggu/separator'
import { Paragraph, Small }    from '@/component/canggu/typography'
import { Card }                from '@/component/canggu/card'

export function Header() {
	return (
		<Section className={'shrink-0 border-b border-neutral-100 bg-white px-3 py-1.75 md:px-4 dark:border-zinc-800/50 dark:bg-zinc-950'}>
			<Div className={'flex flex-row items-center justify-between gap-2'}>
				<Div className={'flex flex-row items-center gap-2.5'}>
					<Paragraph className={'flex flex-row items-center gap-2.5 text-sm font-semibold'}>
						<Megaphone className={'size-4 text-primary'} strokeWidth={2.500} /> Campaigns
					</Paragraph>

					<Separator className={'-mr-0.5 data-[orientation=vertical]:h-4'} orientation={'vertical'} />
				</Div>
			</Div>
		</Section>
	)
}

export function Body() {
	return (
		<Section className={'flex h-full min-h-0 flex-1 flex-col overflow-hidden'}>
			<Div className={'flex min-h-0 flex-1 flex-col items-center justify-center overflow-auto p-8'}>
				<Card className={'flex max-w-md flex-col items-center gap-6 p-12 text-center'}>
					<Div className={'relative'}>
						<Div className={'absolute inset-0 animate-pulse rounded-full bg-primary-500/20 blur-2xl'} />
						<Div className={'relative flex size-20 items-center justify-center rounded-full bg-primary-500/10'}>
							<Sparkles className={'size-10 text-primary-500'} strokeWidth={1.5} />
						</Div>
					</Div>

					<Div className={'flex flex-col gap-2'}>
						<Span className={'text-xl font-bold'}>Campaigns Feature</Span>
						<Small className={'text-neutral-500'}>This feature is currently under development</Small>
					</Div>

					<Div className={'mt-2 flex flex-col gap-1'}>
						<Small className={'text-sm text-neutral-400'}>We're working hard to bring you</Small>
						<Small className={'text-sm text-neutral-400'}>an amazing campaign management experience</Small>
					</Div>
				</Card>
			</Div>
		</Section>
	)
}

