'use client'

import Link                                        from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Suspense, useEffect } from 'react'

import { ArrowRight, Menu, MessageCircle } from 'lucide-react'
import { motion }                          from 'motion/react'

import { A, Break, Div, Header, Main, Nav, Section, Span } from '@/component/canggu/block'
import { Button }                                          from '@/component/canggu/button'

function createId(): string {
	const random = Math.random().toString(36).slice(2, 10)
	const time   = Date.now().toString(36)

	return random + time
}

function LandingContent() {
	const router       = useRouter()
	const pathname     = usePathname()
	const searchParams = useSearchParams()

	useEffect(() => {
		const current = new URLSearchParams(searchParams.toString())

		current.set('gclid', createId())
		current.set('fbclid', createId())

		const query = current.toString()

		router.replace(query ? pathname + '?' + query : pathname)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	function getConsultUrl(): string {
		const params = new URLSearchParams()
		const gclid  = searchParams.get('gclid')
		const fbclid = searchParams.get('fbclid')

		if (gclid)
			params.set('gclid', gclid)
		if (fbclid)
			params.set('fbclid', fbclid)

		const query = params.toString()

		return query ? '/consult?' + query : '/consult'
	}

	return (
		<Main className={'flex h-dvh flex-col overflow-hidden bg-white'}>
			<Header className={'flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white/80 p-4 backdrop-blur-sm md:px-6 lg:px-8'}>
				<Nav className={'flex items-center gap-2'}>
					<Div className={'flex size-10 items-center justify-center rounded-md bg-blue-900 text-white'}>
						<Span className={'text-lg font-bold'}>L</Span>
					</Div>
					<Span className={'text-lg font-semibold text-blue-900'}>Luniasola</Span>
				</Nav>

				<Nav className={'hidden items-center gap-6 md:flex'}>
					<A className={'text-sm text-blue-900 hover:text-blue-950'} href={'https://luniasola.com/id-id/about?region=id'}>
						About Us
					</A>
					<Button appearance={'primary'} asChild={true} size={'sm'}>
						<Link href={getConsultUrl()}>
							Free Consultation
							<ArrowRight className={'size-4'} />
						</Link>
					</Button>
				</Nav>

				<Button appearance={'ghost'} className={'md:hidden'} icon={true} shape={'square'}>
					<Menu className={'size-5'} />
				</Button>
			</Header>

			<Section className={'relative flex flex-1 flex-col justify-center overflow-hidden px-4 py-8 md:px-6 lg:px-8'}>
				<Div className={'absolute inset-0 -z-10'}>
					<motion.div
						animate={{
							scale   : [ 1, 1.2, 1 ],
							opacity : [ 0.03, 0.05, 0.03 ],
						}}
						className={'absolute top-1/4 left-1/4 size-96 rounded-full bg-primary blur-3xl'}
						transition={{
							duration : 8,
							repeat   : Infinity,
							ease     : 'easeInOut',
						}}
					/>
					<motion.div
						animate={{
							scale   : [ 1, 1.3, 1 ],
							opacity : [ 0.02, 0.04, 0.02 ],
						}}
						className={'absolute right-1/4 bottom-1/4 size-80 rounded-full bg-primary blur-3xl'}
						transition={{
							duration : 10,
							repeat   : Infinity,
							ease     : 'easeInOut',
							delay    : 1,
						}}
					/>
				</Div>

				<Div className={'mx-auto w-full max-w-4xl'}>
					<Div className={'mb-4'}>
						<motion.h1
							animate={{ opacity : 1, y : 0 }}
							className={'mb-3 text-3xl leading-tight font-bold text-black/80 md:text-4xl lg:text-5xl'}
							initial={{ opacity : 0, y : 30 }}
							transition={{ duration : 0.8, ease : [ 0.325, 0.72, 0, 1 ] }}
						>
							<Span className={'inline-block'}>
								<motion.span
									animate={{ opacity : 1, y : 0 }}
									initial={{ opacity : 0, y : 20 }}
									transition={{ delay : 0.1, duration : 0.6, ease : [ 0.325, 0.72, 0, 1 ] }}
								>
									We Build User-Loved Digital
								</motion.span>
							</Span>
							<Break />
							<Span className={'inline-block'}>
								<motion.span
									animate={{ opacity : 1, y : 0 }}
									initial={{ opacity : 0, y : 20 }}
									transition={{ delay : 0.2, duration : 0.6, ease : [ 0.325, 0.72, 0, 1 ] }}
								>
									System
								</motion.span>
							</Span>
						</motion.h1>
						<motion.p
							animate={{ opacity : 1, y : 0 }}
							className={'mb-2 text-base text-blue-900 md:text-lg'}
							initial={{ opacity : 0, y : 20 }}
							transition={{ delay : 0.3, duration : 0.7, ease : [ 0.325, 0.72, 0, 1 ] }}
						>
							Transforming Your Business with Scalable Digital Solutions.
						</motion.p>
						<motion.p
							animate={{ opacity : 1, y : 0 }}
							className={'mb-4 text-sm text-blue-900 md:text-base'}
							initial={{ opacity : 0, y : 20 }}
							transition={{ delay : 0.4, duration : 0.7, ease : [ 0.325, 0.72, 0, 1 ] }}
						>
							Our Team Consists of Former Experts from Shopee, GOJEK, & Tokopedia.
						</motion.p>
						<motion.div
							animate={{ opacity : 1, y : 0 }}
							initial={{ opacity : 0, y : 20 }}
							transition={{ delay : 0.5, duration : 0.7, ease : [ 0.325, 0.72, 0, 1 ] }}
							whileHover={{ scale : 1.02 }}
							whileTap={{ scale : 0.98 }}
						>
							<Button
								appearance={'primary'}
								asChild={true}
								className={'bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 bg-[length:200%_100%] text-white shadow-lg shadow-purple-500/30 transition-all duration-500 hover:bg-[length:100%_100%] hover:shadow-xl hover:shadow-purple-500/40'}
								size={'md'}
							>
								<Link href={'https://luniasola.com/work?region=id'}>
									Explore Our Work
								</Link>
							</Button>
						</motion.div>
					</Div>
				</Div>
			</Section>

			<Section className={'flex shrink-0 border-t border-neutral-200 bg-white p-4 md:p-6 lg:px-8'}>
				<Div className={'mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row'}>
					<Div className={'flex items-center gap-3'}>
						<Div className={'flex size-10 items-center justify-center rounded-full bg-neutral-800 text-lg font-bold text-white'}>
							<Span>N</Span>
						</Div>
						<Div className={'relative flex size-10 items-center justify-center rounded-sm bg-blue-900 text-lg font-bold text-white'}>
							<Span>C</Span>
							<Div className={'absolute -top-1 -right-1 size-3 rounded-full bg-red-500'} />
						</Div>
						<Span className={'text-sm font-medium text-blue-900'}>
							5.0 ★★★★★ Rating on Clutch
						</Span>
					</Div>

					<Div className={'flex flex-wrap items-center justify-center gap-2 text-sm text-blue-900'}>
						<Span>Artificial Intelligence (AI)</Span>
						<Span>/</Span>
						<Span>Website</Span>
						<Span>/</Span>
						<Span>Web Application</Span>
						<Span>/</Span>
						<Span>Software</Span>
						<Span>/</Span>
						<Span>Mobile Application</Span>
						<Span>/</Span>
						<Span>UI & UX</Span>
					</Div>

					<Span className={'text-sm font-medium text-blue-900'}>
						Impact-Driven Software AI
					</Span>
				</Div>
			</Section>

			<motion.div
				animate={{ scale : 1 }}
				className={'fixed right-6 bottom-6 z-50'}
				initial={{ scale : 0 }}
				transition={{ delay : 0.5, duration : 0.4, ease : [ 0.325, 0.72, 0, 1 ] }}
				whileHover={{ scale : 1.1 }}
				whileTap={{ scale : 0.95 }}
			>
				<Button
					appearance={'primary'}
					aria-label={'Chat with us'}
					asChild={true}
					className={'size-14 shadow-lg'}
					icon={true}
					shape={'circle'}
				>
					<Link href={getConsultUrl()}>
						<MessageCircle className={'size-6'} />
					</Link>
				</Button>
			</motion.div>
		</Main>
	)
}

export default function Landing() {
	return (
		<Suspense fallback={
			<Main className={'flex h-dvh flex-col overflow-hidden bg-white'}>
				<Div className={'flex h-full items-center justify-center'}>
					<Span className={'text-blue-900'}>Loading...</Span>
				</Div>
			</Main>
		}>
			<LandingContent />
		</Suspense>
	)
}
