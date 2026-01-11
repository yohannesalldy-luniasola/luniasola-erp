import { ReactNode } from 'react'

import { Header }                        from '@/app/system/component/header'
import { Sidebar }                       from '@/app/system/component/sidebar'
import { Div }                           from '@/component/canggu/block'
import { SidebarProvider, SidebarInset } from '@/component/canggu/sidebar'

export default function SystemLayout({ children }: Readonly<{ children : ReactNode }>) {
	return (
		<SidebarProvider className={'h-dvh overflow-hidden bg-neutral-100 dark:bg-black'}>
			<Sidebar />

			<SidebarInset className={'relative flex size-full flex-col overflow-hidden'}>
				<Header />

				<Div className={'flex-1 overflow-hidden'}>
					{children}
				</Div>
			</SidebarInset>
		</SidebarProvider>
	)
}
