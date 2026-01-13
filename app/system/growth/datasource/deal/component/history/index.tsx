import { Suspense } from 'react'

import { History, X } from 'lucide-react'

import { LABEL }                                                 from '@/app/system/growth/datasource/deal/action/schema'
import { HistoryDialogClient }                                   from '@/app/system/growth/datasource/deal/component/history/client'
import { HistoryTableServer, HistoryTableServerFallback }        from '@/app/system/growth/datasource/deal/component/history/server'
import { Div, Span }                                             from '@/component/canggu/block'
import { Button }                                                from '@/component/canggu/button'
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/component/canggu/dialog'

export function HistoryButton() {
	return (
		<HistoryDialogClient
			trigger={
				<Button appearance={'ghost'} className={'text-sm'} shape={'ellipse'} size={'sm'}>
					<History className={'size-3.5'} /> History
				</Button>
			}
		>
			<DialogContent className={'max-h-[80vh] w-4xl'} overlay={true} showCloseButton={false}>
				<DialogClose asChild>
					<Button
						appearance={'ghost'}
						className={'absolute top-1 right-2'}
						icon={true}
						shape={'circle'}
						size={'sm'}
					>
						<X /> <Span className={'sr-only'}>Close</Span>
					</Button>
				</DialogClose>

				<DialogHeader className={'mb-4'}>
					<DialogTitle className={'flex flex-row items-center gap-2'}>
						<History className={'size-4 text-primary'} strokeWidth={2.500} /> {LABEL} History (Lost)
					</DialogTitle>
				</DialogHeader>

				<Div className={'max-h-[calc(80vh-8rem)] overflow-auto'}>
					<Suspense fallback={<HistoryTableServerFallback />}>
						<HistoryTableServer />
					</Suspense>
				</Div>
			</DialogContent>
		</HistoryDialogClient>
	)
}
