import { listLost } from '@/app/system/growth/datasource/deal/action/query'
import { HistoryTable } from '@/app/system/growth/datasource/deal/component/history/table'
import { Skeleton } from '@/component/canggu/skeleton'

export async function HistoryTableServer() {
	const { data } = await listLost()

	return <HistoryTable data={data} />
}

export function HistoryTableServerFallback() {
	return <Skeleton className={'h-32 w-full'} />
}

