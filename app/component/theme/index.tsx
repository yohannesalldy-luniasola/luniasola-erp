'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function Theme({ children, ...props }: ReadonlyComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider attribute={'class'} defaultTheme={'system'} enableSystem={true} {...props}>{children}</NextThemesProvider>
}
