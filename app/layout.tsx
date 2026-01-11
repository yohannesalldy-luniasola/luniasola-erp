import { ReactNode } from 'react'

import Font from 'next/font/local'

import { Theme }            from '@/app/component/theme'
import { HTML, Body }       from '@/component/canggu/block'
import { Toaster }          from '@/component/canggu/sonner'
import { ViewportProvider } from '@/component/hook/viewport'

import '@/app/asset/style/tailwind.css'

const font = Font({
	src : [
		{
			path   : './asset/static/font/satoshi/regular.otf',
			weight : '400',
			style  : 'normal',
		},
		{
			path   : './asset/static/font/satoshi/italic.otf',
			weight : '400',
			style  : 'italic',
		},
		{
			path   : './asset/static/font/satoshi/light.otf',
			weight : '300',
			style  : 'normal',
		},
		{
			path   : './asset/static/font/satoshi/light-italic.otf',
			weight : '300',
			style  : 'italic',
		},
		{
			path   : './asset/static/font/satoshi/bold.otf',
			weight : '600',
			style  : 'normal',
		},
		{
			path   : './asset/static/font/satoshi/bold-italic.otf',
			weight : '600',
			style  : 'italic',
		},
		{
			path   : './asset/static/font/satoshi/black.otf',
			weight : '700',
			style  : 'normal',
		},
		{
			path   : './asset/static/font/satoshi/black-italic.otf',
			weight : '700',
			style  : 'italic',
		},
	],
	variable : '--font-satoshi',
})

export default function RootLayout({ children }: Readonly<{ children : ReactNode }>) {
	return (
		<HTML lang={'en'} suppressHydrationWarning>
			<Body className={[ font.variable, 'antialiased bg-neutral-100 dark:bg-black' ].join(' ')}>
				<Theme>
					<ViewportProvider>
						{children}
					</ViewportProvider>

					<Toaster />
				</Theme>
			</Body>
		</HTML>
	)
}
