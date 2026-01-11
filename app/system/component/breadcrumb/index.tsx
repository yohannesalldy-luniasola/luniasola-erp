'use client'

import Link            from 'next/link'
import { usePathname } from 'next/navigation'

import { Fragment } from 'react'

import { Breadcrumb as BreadcrumbRoot, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/component/canggu/breadcrumb'

export function Breadcrumb({ className }: Readonly<{ className? : string }>) {
	const pathname : string | null     = usePathname()
	
	const segments : readonly string[] = pathname.split('/').filter(Boolean)
	const total    : number            = segments.length

	return (
		<BreadcrumbRoot className={className}>
			<BreadcrumbList>
				{
					segments.map((segment, index) => {
						if (index === 0)
							return null

						const last       : boolean = index === segments.length - 1
						const department : boolean = index === 1
						const group      : boolean = total === 4 && index === 2
						const label      : boolean = last || department || group
						const route      : string  = '/' + segments.slice(0, index + 1).join('/')

						return (
							<Fragment key={route}>
								<BreadcrumbItem>
									{
										label ? (
											<BreadcrumbPage className={'capitalize'}>
												{segment}
											</BreadcrumbPage>
										) : (
											<BreadcrumbLink asChild>
												<Link className={'capitalize'} href={route}>
													{segment}
												</Link>
											</BreadcrumbLink>
										)
									}
								</BreadcrumbItem>
                            
								{!last && <BreadcrumbSeparator />}
							</Fragment>
						)
					})
				}
			</BreadcrumbList>
		</BreadcrumbRoot>
	)
}
