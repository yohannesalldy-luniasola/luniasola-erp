'use client'

import { useSearchParams } from 'next/navigation'

import { Suspense, useState } from 'react'

import { Loader2, Mail, Menu, Phone, User } from 'lucide-react'
import { motion }                           from 'motion/react'

import { submitConsult }                            from '@/app/consult/action'
import { A, Div, Header, Main, Nav, Section, Span } from '@/component/canggu/block'
import { Button }                                   from '@/component/canggu/button'
import { Fieldset, Form, Input, Label, Message }    from '@/component/canggu/form'

function ConsultFormContent() {
	const searchParams = useSearchParams()
	const [ submitting, setSubmitting ] = useState(false)
	const [ errors, setErrors ] = useState<{ name? : string, contact? : string }>({})

	function validateForm(name: string, contact: string): boolean {
		const newErrors: { name? : string, contact? : string } = {}

		if (!name || name.trim() === '')
			newErrors.name = 'Name is required'

		if (!contact || contact.trim() === '')
			newErrors.contact = 'Contact is required'

		setErrors(newErrors)

		return Object.keys(newErrors).length === 0
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		event.stopPropagation()

		const formData = new FormData(event.currentTarget)
		const name     = formData.get('name') as string
		const contact  = formData.get('contact') as string
		const company  = formData.get('company') as string || ''
		const gclid    = searchParams.get('gclid')
		const fbclid   = searchParams.get('fbclid')

		if (!validateForm(name, contact)) {
			setSubmitting(false)

			return
		}

		setSubmitting(true)

		try {
			await submitConsult({ 
				name, 
				contact, 
				company : company || undefined,
				gclid   : gclid || null,
				fbclid  : fbclid || null,
			})
		} catch (error) {
			console.error('Failed to save consultation data:', error)
			setSubmitting(false)

			return
		}

		const gclidValue  = gclid || ''
		const fbclidValue = fbclid || ''

		let message = 'Hello! I would like to request a free consultation.\n\n'
		message += 'Consultation Request\n\n'
		message += 'Name: ' + name + '\n'
		message += 'Contact: ' + contact + '\n'
		if (company)
			message += 'Company: ' + company + '\n'
		if (gclidValue || fbclidValue) {
			message += '\n'
			message += 'Tracking Information\n'
			if (gclidValue)
				message += 'GCLID: ' + gclidValue + '\n'
			if (fbclidValue)
				message += 'FBCLID: ' + fbclidValue + '\n'
		}

		const phoneNumber = '6288297032508'
		const encodedMessage = encodeURIComponent(message.trim())
		const whatsappUrl = 'https://wa.me/' + phoneNumber + '?text=' + encodedMessage

		window.location.href = whatsappUrl
	}

	return (
		<Main className={'min-h-dvh bg-gradient-to-br from-purple-50 via-white to-blue-50'}>
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
				</Nav>

				<Button appearance={'ghost'} className={'md:hidden'} icon={true} shape={'square'}>
					<Menu className={'size-5'} />
				</Button>
			</Header>

			<Section className={'flex min-h-[calc(100dvh-80px)] items-center justify-center px-4 py-16 md:px-6 lg:px-8'}>
				<Div className={'mx-auto w-full max-w-md'}>
					<motion.div
						animate={{ opacity : 1, y : 0 }}
						initial={{ opacity : 0, y : 20 }}
						transition={{ duration : 0.6, ease : [ 0.325, 0.72, 0, 1 ] }}
					>
						<Div className={'mb-8 text-center'}>
							<motion.h1
								animate={{ opacity : 1, y : 0 }}
								className={'mb-3 text-3xl font-bold text-blue-900 md:text-4xl'}
								initial={{ opacity : 0, y : 20 }}
								transition={{ delay : 0.1, duration : 0.6, ease : [ 0.325, 0.72, 0, 1 ] }}
							>
								Free Consultation
							</motion.h1>
							<motion.p
								animate={{ opacity : 1, y : 0 }}
								className={'text-base text-blue-900/80 md:text-lg'}
								initial={{ opacity : 0, y : 20 }}
								transition={{ delay : 0.2, duration : 0.6, ease : [ 0.325, 0.72, 0, 1 ] }}
							>
								Let&apos;s discuss how we can transform your business with scalable digital solutions.
							</motion.p>
						</Div>

						<motion.div
							animate={{ opacity : 1, y : 0 }}
							className={'rounded-2xl border border-neutral-200/50 bg-white/90 p-6 shadow-xl shadow-black/5 backdrop-blur-sm md:p-7'}
							initial={{ opacity : 0, y : 20 }}
							transition={{ delay : 0.3, duration : 0.6, ease : [ 0.325, 0.72, 0, 1 ] }}
						>
							<Suspense fallback={
								<Form className={'space-y-4'}>
									<Fieldset>
										<Label className={'justify-between'} htmlFor={'name'}>
											<Span className={'flex items-center gap-2 text-xs font-semibold text-neutral-700'}>
												<User className={'size-3.5'} />
												Name
											</Span>
										</Label>
										<Input
											className={'h-10 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/10 dark:border-neutral-200 dark:bg-white dark:text-neutral-900 dark:placeholder:text-neutral-500'}
											disabled={true}
											id={'name'}
											name={'name'}
											placeholder={'Enter your full name'}
											required={true}
											type={'text'}
										/>
									</Fieldset>
									<Fieldset>
										<Label className={'justify-between'} htmlFor={'contact'}>
											<Span className={'flex items-center gap-2 text-xs font-semibold text-neutral-700'}>
												<Phone className={'size-3.5'} />
												Contact
											</Span>
										</Label>
										<Input
											className={'h-10 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/10 dark:border-neutral-200 dark:bg-white dark:text-neutral-900 dark:placeholder:text-neutral-500'}
											disabled={true}
											id={'contact'}
											name={'contact'}
											placeholder={'Email or phone number'}
											required={true}
											type={'text'}
										/>
									</Fieldset>
									<Fieldset>
										<Label className={'justify-between'} htmlFor={'company'}>
											<Span className={'flex items-center gap-2 text-xs font-semibold text-neutral-700'}>
												<Mail className={'size-3.5'} />
												Company
											</Span>
											<Span className={'text-2xs font-medium text-neutral-400'}>(Optional)</Span>
										</Label>
										<Input
											className={'h-10 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/10 dark:border-neutral-200 dark:bg-white dark:text-neutral-900 dark:placeholder:text-neutral-500'}
											disabled={true}
											id={'company'}
											name={'company'}
											placeholder={'Your company name'}
											type={'text'}
										/>
									</Fieldset>
									<Div className={'mt-6'}>
										<Button
											appearance={'primary'}
											className={'w-full rounded-lg bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 bg-[length:200%_100%] text-white shadow-lg shadow-purple-500/30 transition-all duration-500 hover:bg-[length:100%_100%] hover:shadow-xl hover:shadow-purple-500/40'}
											disabled={true}
											size={'lg'}
											type={'submit'}
										>
											Loading...
										</Button>
									</Div>
								</Form>
							}>
								<Form className={'space-y-4'} noValidate={true} onSubmit={handleSubmit}>
									<Fieldset>
										<Label className={'justify-between'} htmlFor={'name'}>
											<Span className={'flex items-center gap-2 text-xs font-semibold text-neutral-700'}>
												<User className={'size-3.5'} />
												Name
											</Span>
										</Label>
										<Input
											className={'h-10 rounded-lg border bg-white text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus-visible:ring-3 dark:bg-white dark:text-neutral-900 dark:placeholder:text-neutral-500 ' + (errors.name ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/10' : 'border-neutral-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/10 dark:border-neutral-200')}
											id={'name'}
											name={'name'}
											placeholder={'Enter your full name'}
											type={'text'}
											onChange={() => {
												if (errors.name)
													setErrors(prev => ({ ...prev, name : undefined }))
											}}
											onInvalid={(event) => {
												event.preventDefault()
											}}
										/>
										{errors.name && (
											<motion.div
												animate={{ opacity : 1, y : 0 }}
												initial={{ opacity : 0, y : -4 }}
												transition={{ duration : 0.2, ease : [ 0.325, 0.72, 0, 1 ] }}
											>
												<Message className={'mt-1 flex items-center gap-1.5 text-sm font-medium text-red-600'}>
													<Span>{errors.name}</Span>
												</Message>
											</motion.div>
										)}
									</Fieldset>

									<Fieldset>
										<Label className={'justify-between'} htmlFor={'contact'}>
											<Span className={'flex items-center gap-2 text-xs font-semibold text-neutral-700'}>
												<Phone className={'size-3.5'} />
												Contact
											</Span>
										</Label>
										<Input
											className={'h-10 rounded-lg border bg-white text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus-visible:ring-3 dark:bg-white dark:text-neutral-900 dark:placeholder:text-neutral-500 ' + (errors.contact ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/10' : 'border-neutral-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/10 dark:border-neutral-200')}
											id={'contact'}
											name={'contact'}
											placeholder={'Email or phone number'}
											type={'text'}
											onChange={() => {
												if (errors.contact)
													setErrors(prev => ({ ...prev, contact : undefined }))
											}}
											onInvalid={(event) => {
												event.preventDefault()
											}}
										/>
										{errors.contact && (
											<motion.div
												animate={{ opacity : 1, y : 0 }}
												initial={{ opacity : 0, y : -4 }}
												transition={{ duration : 0.2, ease : [ 0.325, 0.72, 0, 1 ] }}
											>
												<Message className={'mt-1 flex items-center gap-1.5 text-sm font-medium text-red-600'}>
													<Span>{errors.contact}</Span>
												</Message>
											</motion.div>
										)}
									</Fieldset>

									<Fieldset>
										<Label className={'justify-between'} htmlFor={'company'}>
											<Span className={'flex items-center gap-2 text-xs font-semibold text-neutral-700'}>
												<Mail className={'size-3.5'} />
												Company
											</Span>
											<Span className={'text-2xs font-medium text-neutral-400'}>(Optional)</Span>
										</Label>
										<Input
											className={'h-10 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/10 dark:border-neutral-200 dark:bg-white dark:text-neutral-900 dark:placeholder:text-neutral-500'}
											id={'company'}
											name={'company'}
											placeholder={'Your company name'}
											type={'text'}
										/>
									</Fieldset>

									<Div className={'mt-6'}>
										<Button
											appearance={'primary'}
											className={'w-full rounded-lg bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 bg-[length:200%_100%] text-white shadow-lg shadow-purple-500/30 transition-all duration-500 hover:bg-[length:100%_100%] hover:shadow-xl hover:shadow-purple-500/40'}
											disabled={submitting}
											size={'lg'}
											type={'submit'}
										>
											{submitting ? <Loader2 className={'size-5 animate-spin'} /> : 'Continue to WhatsApp'}
										</Button>
									</Div>
								</Form>
							</Suspense>
						</motion.div>

						<motion.p
							animate={{ opacity : 1 }}
							className={'mt-6 text-center text-sm text-blue-900/60'}
							initial={{ opacity : 0 }}
							transition={{ delay : 0.5, duration : 0.6 }}
						>
							You&apos;ll be redirected to WhatsApp to start the conversation
						</motion.p>
					</motion.div>
				</Div>
			</Section>
		</Main>
	)
}

export default function Consult() {
	return (
		<Suspense fallback={
			<Main className={'min-h-dvh bg-gradient-to-br from-purple-50 via-white to-blue-50'}>
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
					</Nav>

					<Button appearance={'ghost'} className={'md:hidden'} icon={true} shape={'square'}>
						<Menu className={'size-5'} />
					</Button>
				</Header>

				<Section className={'flex min-h-[calc(100dvh-80px)] items-center justify-center px-4 py-16 md:px-6 lg:px-8'}>
					<Div className={'mx-auto w-full max-w-md'}>
						<motion.div
							animate={{ opacity : 1, y : 0 }}
							initial={{ opacity : 0, y : 20 }}
							transition={{ duration : 0.6, ease : [ 0.325, 0.72, 0, 1 ] }}
						>
							<Div className={'mb-8 text-center'}>
								<motion.h1
									animate={{ opacity : 1, y : 0 }}
									className={'mb-3 text-3xl font-bold text-blue-900 md:text-4xl'}
									initial={{ opacity : 0, y : 20 }}
									transition={{ delay : 0.1, duration : 0.6, ease : [ 0.325, 0.72, 0, 1 ] }}
								>
									Free Consultation
								</motion.h1>
								<motion.p
									animate={{ opacity : 1, y : 0 }}
									className={'text-base text-blue-900/80 md:text-lg'}
									initial={{ opacity : 0, y : 20 }}
									transition={{ delay : 0.2, duration : 0.6, ease : [ 0.325, 0.72, 0, 1 ] }}
								>
									Let&apos;s discuss how we can transform your business with scalable digital solutions.
								</motion.p>
							</Div>

							<motion.div
								animate={{ opacity : 1, y : 0 }}
								className={'rounded-2xl border border-neutral-200/50 bg-white/90 p-6 shadow-xl shadow-black/5 backdrop-blur-sm md:p-7'}
								initial={{ opacity : 0, y : 20 }}
								transition={{ delay : 0.3, duration : 0.6, ease : [ 0.325, 0.72, 0, 1 ] }}
							>
								<Form className={'space-y-4'}>
									<Fieldset>
										<Label className={'justify-between'} htmlFor={'name'}>
											<Span className={'flex items-center gap-2 text-xs font-semibold text-neutral-700'}>
												<User className={'size-3.5'} />
												Name
											</Span>
										</Label>
										<Input
											className={'h-10 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/10 dark:border-neutral-200 dark:bg-white dark:text-neutral-900 dark:placeholder:text-neutral-500'}
											disabled={true}
											id={'name'}
											name={'name'}
											placeholder={'Enter your full name'}
											required={true}
											type={'text'}
										/>
									</Fieldset>
									<Fieldset>
										<Label className={'justify-between'} htmlFor={'contact'}>
											<Span className={'flex items-center gap-2 text-xs font-semibold text-neutral-700'}>
												<Phone className={'size-3.5'} />
												Contact
											</Span>
										</Label>
										<Input
											className={'h-10 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/10 dark:border-neutral-200 dark:bg-white dark:text-neutral-900 dark:placeholder:text-neutral-500'}
											disabled={true}
											id={'contact'}
											name={'contact'}
											placeholder={'Email or phone number'}
											required={true}
											type={'text'}
										/>
									</Fieldset>
									<Fieldset>
										<Label className={'justify-between'} htmlFor={'company'}>
											<Span className={'flex items-center gap-2 text-xs font-semibold text-neutral-700'}>
												<Mail className={'size-3.5'} />
												Company
											</Span>
											<Span className={'text-2xs font-medium text-neutral-400'}>(Optional)</Span>
										</Label>
										<Input
											className={'h-10 rounded-lg border border-neutral-200 bg-white text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/10 dark:border-neutral-200 dark:bg-white dark:text-neutral-900 dark:placeholder:text-neutral-500'}
											disabled={true}
											id={'company'}
											name={'company'}
											placeholder={'Your company name'}
											type={'text'}
										/>
									</Fieldset>
									<Div className={'mt-6'}>
										<Button
											appearance={'primary'}
											className={'w-full rounded-lg bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 bg-[length:200%_100%] text-white shadow-lg shadow-purple-500/30 transition-all duration-500 hover:bg-[length:100%_100%] hover:shadow-xl hover:shadow-purple-500/40'}
											disabled={true}
											size={'lg'}
											type={'submit'}
										>
											Loading...
										</Button>
									</Div>
								</Form>
							</motion.div>

							<motion.p
								animate={{ opacity : 1 }}
								className={'mt-6 text-center text-sm text-blue-900/60'}
								initial={{ opacity : 0 }}
								transition={{ delay : 0.5, duration : 0.6 }}
							>
								You&apos;ll be redirected to WhatsApp to start the conversation
							</motion.p>
						</motion.div>
					</Div>
				</Section>
			</Main>
		}>
			<ConsultFormContent />
		</Suspense>
	)
}
