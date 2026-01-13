import { listAccount, listAvailablePeople } from '@/app/system/growth/datasource/deal/action/query'
import { FormCreateStage }                   from '@/app/system/growth/datasource/deal/component/kanban/form'
import { Skeleton }                          from '@/component/canggu/skeleton'

type FormCreateStageServerProps = {
	readonly defaultStage  : string | null
	readonly open          : boolean
	readonly onOpenChange  : (open: boolean) => void
}

export async function FormCreateStageServer({ defaultStage, open, onOpenChange }: FormCreateStageServerProps) {
	const { data: account } = await listAccount()
	const { data: people }  = await listAvailablePeople()

	return (
		<FormCreateStage
			account={account}
			defaultStage={defaultStage}
			open={open}
			people={people}
			onOpenChange={onOpenChange}
		/>
	)
}

export function FormCreateStageServerFallback() {
	return <Skeleton className={'h-8 w-23'} />
}

