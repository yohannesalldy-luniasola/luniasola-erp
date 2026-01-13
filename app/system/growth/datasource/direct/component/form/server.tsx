import { sumPassedAmount } from '@/app/system/growth/datasource/direct/action/query'
import { FormCreate }      from '@/app/system/growth/datasource/direct/component/form'
import { Skeleton }        from '@/component/canggu/skeleton'

export async function FormCreateServer() {
	const totalAmount = await sumPassedAmount()

	return <FormCreate totalAmount={totalAmount} />
}

export function FormCreateServerFallback() {
	return <Skeleton className={'h-8 w-23'} />
}
