'use client'

import type { ReactNode } from 'react'

import { Dialog, DialogTrigger } from '@/component/canggu/dialog'

type HistoryDialogClientProps = {
	readonly children : ReactNode
	readonly trigger : ReactNode
}

export function HistoryDialogClient({ children, trigger }: HistoryDialogClientProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				{trigger}
			</DialogTrigger>
			{children}
		</Dialog>
	)
}

