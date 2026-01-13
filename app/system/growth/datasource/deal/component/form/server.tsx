import { listAccount, listAvailablePeople } from '@/app/system/growth/datasource/deal/action/query'
import { FormCreate }                       from '@/app/system/growth/datasource/deal/component/form'
import { Skeleton }                         from '@/component/canggu/skeleton'

export async function FormCreateServer() {
	const { data: account } = await listAccount()
	const { data: people }  = await listAvailablePeople()

	return <FormCreate account={account} people={people} />
}

export function FormCreateServerFallback() {
	return <Skeleton className={'h-8 w-23'} />
}

