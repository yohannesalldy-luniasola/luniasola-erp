'use client'

import type { Action, Schema } from '@/app/system/growth/datasource/people/action/schema'

import { useState } from 'react'

import { GitPullRequestCreate, UserRound, Mail, Phone, Flag, Briefcase, Plus, Trash2 } from 'lucide-react'

import { State }                                                                                                                    from '@/app/component/state'
import { Div }                                                                                                                      from '@/component/canggu/block'
import { Button }                                                                                                                   from '@/component/canggu/button'
import { Dialog, DialogContent, DialogCard, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogTrigger, DialogDescription } from '@/component/canggu/dialog'
import { Fieldset, Label, Input, Message, Select, SelectTrigger, SelectValue, SelectContent, SelectItem }                           from '@/component/canggu/form'
import { Separator }                                                                                                                from '@/component/canggu/separator'
import { Tooltip, TooltipTrigger, TooltipContent }                                                                                  from '@/component/canggu/tooltip'
import { Small, ExtraSmall }                                                                                                        from '@/component/canggu/typography'
import { useMobile }                                                                                                                from '@/component/hook/mobile'

type FormCollection = {
	readonly state          : Action
	readonly defaultValues? : Partial<Schema>
	readonly id             : string
	readonly provision?     : boolean
	readonly account        : { id : string, name : string }[]
}

export function FormCollection({ state, defaultValues, id, provision = false, account }: FormCollection) {
	const errors = state?.status === 'error' ? state.errors ?? {} : {}
	const values = state?.status === 'error' ? state.inputs ?? defaultValues ?? {} : defaultValues ?? {}

	const initial = (() => {
		if (values.accountPeople) {
			try {
				return Array.isArray(JSON.parse(values.accountPeople as string)) ? JSON.parse(values.accountPeople as string) : []
			} catch {
				return []
			}
		}

		return []
	})()

	const [ dialogOpen, setDialogOpen ] 		    = useState(false)
	const [ accountPeople, setAccountPeople ] 	    = useState<{ account : string, accountName : string, designation : string }[]>(initial)
	const [ accountSelection, setSelectionAccount ] = useState<string>('')
	const [ designation, setDesignation ] 		    = useState<string>('')

	function performAppend() {
		if (!accountSelection || !designation.trim())
			return

		const data  = account.find(account => account.id === accountSelection)
		const exist = accountPeople.some(accountPeople => accountPeople.account === accountSelection)
		
		if (!data)
			return

		if (exist)
			return

		setAccountPeople(previous => [ ...previous, {
			account     : accountSelection,
			accountName : data.name,
			designation : designation.trim(),
		} ])

		setSelectionAccount('')
		setDesignation('')
		setDialogOpen(false)
	}

	function performRemove(account: string) {
		setAccountPeople(previous => previous.filter(accountPeople => accountPeople.account !== account))
	}

	return (
		<>
			{provision && id && <Input name={'id'} type={'hidden'} value={id} />}
			
			<Input name={'accountPeople'} type={'hidden'} value={JSON.stringify(accountPeople.map(association => ({ account : association.account, designation : association.designation })))} />

			<Div className={'mb-3 grid gap-y-3 md:grid-cols-2 md:gap-x-3 md:gap-y-0'}>
				<Fieldset className={'mb-0'}>
					<Label htmlFor={'name'}>Name</Label>
					<Input adornment={<UserRound className={'size-3.5'} />} defaultValue={values.name} id={'name'} name={'name'} placeholder={'Fullname'} type={'text'} />

					{errors.name && <Message>{errors.name[0]}</Message>}
				</Fieldset>
			</Div>

			<Separator className={'mb-3 bg-neutral-200/50 dark:bg-zinc-800/50'} />

			<Div className={'mb-3 grid gap-y-3 md:grid-cols-2 md:gap-x-3 md:gap-y-0'}>
				<Fieldset className={'mb-0'}>
					<Label htmlFor={'email'}>Email</Label>
					<Input adornment={<Mail className={'size-3.5'} />} defaultValue={values.email ?? ''} id={'email'} name={'email'} placeholder={'Email'} type={'email'} />

					{errors.email && <Message>{errors.email[0]}</Message>}
				</Fieldset>

				<Fieldset className={'mb-0'}>
					<Label htmlFor={'phone'}>Phone</Label>
					<Input adornment={<Phone className={'size-3.5'} />} defaultValue={values.phone ?? ''} id={'phone'} name={'phone'} placeholder={'Phone Number'} type={'text'} />

					{errors.phone && <Message>{errors.phone[0]}</Message>}
				</Fieldset>
			</Div>

			<Separator className={'mb-3 bg-neutral-200/50 dark:bg-zinc-800/50'} />

			<Div className={'flex flex-col gap-1.5'}>
				<Div className={'flex items-center justify-between align-middle'}>
					<Label>Account</Label>

					<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
						<DialogTrigger asChild>
							<Button appearance={'ghost'} className={'focus-visible:bg-neutral-100 focus-visible:ring-0'} shape={'ellipse'} size={'sm'} type={'button'}>
								<Plus className={'size-3.5'} /> Map Account
							</Button>
						</DialogTrigger>

						<DialogContent className={'md:max-w-md'} overlay={false}>
							<DialogCard>
								<DialogHeader>
									<DialogTitle className={'flex flex-row items-center gap-2 capitalize'}>
										<GitPullRequestCreate className={'size-4 text-primary'} strokeWidth={2.250} /> Map Account
									</DialogTitle>
									<DialogDescription>Map the Account to the People</DialogDescription>
								</DialogHeader>

								<DialogBody>
									<Fieldset>
										<Label htmlFor={'dialog-account'}>Account</Label>
										<Select value={accountSelection} onValueChange={setSelectionAccount}>
											<SelectTrigger id={'dialog-account'}>
												<SelectValue placeholder={<><Flag className={'-mr-1 size-3.5 text-neutral-500'} /> Select Account</>} />
											</SelectTrigger>

											<SelectContent>
												{
													account.map(account => (
														<SelectItem disabled={accountPeople.some(accountPeople => accountPeople.account === account.id)} key={account.id} value={account.id}>
															<Flag className={'-mr-1 size-3.5 text-neutral-500'} />
															{account.name}
														</SelectItem>
													))
												}
											</SelectContent>
										</Select>
									</Fieldset>

									<Fieldset className={'mb-0'}>
										<Label htmlFor={'dialog-designation'}>Designation</Label>
										<Input adornment={<Briefcase className={'size-3.5'} />} id={'dialog-designation'} placeholder={'Chief Executive Officer'} type={'text'} value={designation} onChange={event => setDesignation(event.target.value)} />
									</Fieldset>
								</DialogBody>

								<DialogFooter>
									<Button appearance={'ghost'} shape={'ellipse'} size={useMobile() ? 'md' : 'sm'} type={'button'} onClick={() => setDialogOpen(false)}>Cancel</Button>
									<Button appearance={'primary'} disabled={!accountSelection || !designation.trim()} shape={'ellipse'} size={useMobile() ? 'md' : 'sm'} type={'button'} onClick={performAppend}>
										<Plus className={'-mx-0.75 size-3.5'} /> Map
									</Button>
								</DialogFooter>
							</DialogCard>
						</DialogContent>
					</Dialog>
				</Div>

				<Div className={'flex flex-col gap-2.5'}>
					{
						accountPeople.length === 0 && (
							<Div className={'rounded-lg border border-neutral-200/50 bg-neutral-50/35 text-center dark:border-zinc-800/50 dark:bg-zinc-950/15'}>
								<State description={'Try mapping an Account'} title={'No Account Mapping'} type={'empty'} />
							</Div>
						)
					}
					
					{
						accountPeople.map(association => (
							<Div className={'flex flex-row items-center justify-between overflow-clip rounded-xl border border-neutral-200/50 bg-neutral-50/25 bg-linear-to-t from-neutral-100/40 to-transparent p-3.5 dark:border-zinc-800/50 dark:bg-zinc-900 dark:from-zinc-800/30'} key={association.account}>
								<Div className={'flex flex-row items-center gap-3.5'}>
									<Div className={'flex size-9 items-center justify-center rounded-full bg-primary-500'}>
										<Flag className={'size-3.5 text-white'} />
									</Div>	

									<Div className={'flex flex-col items-start gap-0.25'}>
										<Small className={'font-semibold'}>{association.accountName}</Small>
										<ExtraSmall className={'text-neutral-500'}>{association.designation}</ExtraSmall>
									</Div>
								</Div>

								<Tooltip>
									<TooltipTrigger asChild>
										<Button appearance={'ghost'} icon={true} shape={'circle'} size={'sm'} type={'button'} onClick={() => performRemove(association.account)}>
											<Trash2 className={'size-3.5'} />
										</Button>
									</TooltipTrigger>
									<TooltipContent>Remove Account</TooltipContent>
								</Tooltip>
							</Div>
						))
					}
				</Div>
			</Div>
		</>
	)
}
