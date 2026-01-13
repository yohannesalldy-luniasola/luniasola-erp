import type { ColumnTable } from '@/app/system/growth/datasource/deal/action/schema'

import { listAccount, listAvailablePeople } from '@/app/system/growth/datasource/deal/action/query'
import { FormCreate, FormUpdate }           from '@/app/system/growth/datasource/deal/component/form'
import { Skeleton }                         from '@/component/canggu/skeleton'

export async function FormCreateServer() {
	const { data: account } = await listAccount()
	const { data: people }  = await listAvailablePeople()

	return <FormCreate account={account} people={people} />
}

export function FormCreateServerFallback() {
	return <Skeleton className={'h-8 w-23'} />
}

type FormUpdateServerProps = {
	readonly open         : boolean
	readonly onOpenChange : (open: boolean) => void
	readonly onUpdate     : (id: string, data: Partial<ColumnTable>) => Promise<void>
	readonly data         : ColumnTable & { account : { id : string, name : string } | null }
}

export async function FormUpdateServer({ open, onOpenChange, onUpdate, data }: FormUpdateServerProps) {
	const { data: account } = await listAccount()
	const { data: people }  = await listAvailablePeople()

	return <FormUpdate account={account} data={data} open={open} people={people} onOpenChange={onOpenChange} onUpdate={onUpdate} />
}
