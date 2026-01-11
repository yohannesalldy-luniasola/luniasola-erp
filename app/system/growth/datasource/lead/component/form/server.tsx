import { FormCreate } from '@/app/system/growth/datasource/lead/component/form'
import { Skeleton }    from '@/component/canggu/skeleton'

export async function FormCreateServer() {
	return <FormCreate />
}

export function FormCreateServerFallback() {
	return <Skeleton className={'h-8 w-23'} />
}
