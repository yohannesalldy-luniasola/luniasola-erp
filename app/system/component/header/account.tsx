import type { UserResponse } from '@supabase/supabase-js'

import { Skeleton }   from '@/component/canggu/skeleton'
import { ExtraSmall } from '@/component/canggu/typography'
import { classNames } from '@/component/utility/style'
import { server }     from '@/library/supabase/server'

type HeaderAccount = Readonly<{ className? : string }>

export async function HeaderAccount({ className }: HeaderAccount) {
	const supabase = await server()

	const { data, error }: UserResponse = await supabase.auth.getUser()

	if (error || !data?.user?.email) 
		return null

	return (
		<ExtraSmall className={classNames('font-semibold text-neutral-500 md:hidden lg:block dark:text-white', className)}>
			{data.user.user_metadata.name}
		</ExtraSmall>
	)
}

export function HeaderAccountFallback({ className }: HeaderAccount) {
	return <Skeleton className={classNames('h-4 w-36 md:hidden lg:block', className)} />
}
