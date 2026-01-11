import { listAccount } from '@/app/system/growth/datasource/people/action/query'
import { FormCreate }  from '@/app/system/growth/datasource/people/component/form'
import { Skeleton }    from '@/component/canggu/skeleton'

export async function FormCreateServer() {
	const { data: account } = await listAccount()

	return <FormCreate account={account} />
}

export function FormCreateServerFallback() {
	return <Skeleton className={'h-8 w-23'} />
}
