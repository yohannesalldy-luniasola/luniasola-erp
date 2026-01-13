'use client'

import type { Action, Schema } from '@/app/system/growth/performance/ads/action/schema'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { GitPullRequestCreate, UserRound, UserRoundCheck, Flag, Plus, Trash2, Calendar } from 'lucide-react'
import { toast }                                                                         from 'sonner'

import { State }                                                                                                                    from '@/app/component/state'
import { Div, SVG, Path }                                                                                                           from '@/component/canggu/block'
import { Button }                                                                                                                   from '@/component/canggu/button'
import { Dialog, DialogContent, DialogCard, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogTrigger, DialogDescription } from '@/component/canggu/dialog'
import { Fieldset, Label, SelectGroup, Input, Message, Select, SelectTrigger, SelectValue, SelectContent, SelectItem }              from '@/component/canggu/form'
import { Separator }                                                                                                                from '@/component/canggu/separator'
import { Tooltip, TooltipTrigger, TooltipContent }                                                                                  from '@/component/canggu/tooltip'
import { Small, ExtraSmall }                                                                                                        from '@/component/canggu/typography'
import { useMobile }                                                                                                                from '@/component/hook/mobile'
import { number, numberCurrency, numberCurrencyParse }                                                                              from '@/component/utility/data'

type FormCollection = {
	readonly state          : Action
	readonly defaultValues? : Partial<Schema>
	readonly id             : string
	readonly provision?     : boolean
	readonly account        : { id : string, name : string }[]
}

const parse = (value: unknown, account: { id : string, name : string }[]): { account : string, accountName : string }[] => {
	if (!value || typeof value !== 'string') return []
	
	try {
		const payload = JSON.parse(value)
		
		if (!Array.isArray(payload))
			return []

		return payload.map((entry: { account : string, accountName? : string }) => {
			if (!entry?.account)
				return null

			return {
				account     : entry.account,
				accountName : entry.accountName || account.find(a => a.id === entry.account)?.name || 'Unknown Account',
			}
		})
			.filter((item): item is { account : string, accountName : string } => item !== null)
			.filter((item, index, self) => self.findIndex(association => association.account === item.account) === index)
	} catch {
		return []
	}
}

export function FormCollection({ state, defaultValues, id, provision = false, account }: FormCollection) {
	const errors = state?.status === 'error' ? state.errors ?? {} : {}
	const values = state?.status === 'error' ? state.inputs ?? defaultValues ?? {} : defaultValues ?? {}

	const [ association, setAssociation ] 	 	 	= useState<{ account : string, accountName : string }[]>(() => parse(values.adsPerformanceAccount, account))
	const [ cost, setCost ] 	 	 	 	 		= useState<string>(values.cost !== undefined && values.cost !== null ? String(values.cost) : '')
	const [ costDisplay, setCostDisplay ] 			= useState<string>(numberCurrency(values.cost))
	const [ lead, setLead ]           	  	 	 	= useState<string>(String(values.lead ?? ''))
	const [ leadQualified, setLeadQualified ] 	  	= useState<string>(String(values.lead_qualified ?? ''))
	const [ channel, setChannel ] 					= useState<string>(String(values.channel ?? 'google'))
	const [ dialogOpen, setDialogOpen ] 		   	= useState(false)
	const [ accountSelection, setAccountSelection ] = useState<string>('')
	const refForm 	 	 	 	 	 	 	 	 	= useRef<HTMLDivElement>(null)

	const performChangeCost = (event: React.ChangeEvent<HTMLInputElement>) => {
		const input = event.target.value
        
		if (!/^[0-9.,]*$/.test(input))
			return

		if (/\.\d{3,}/.test(input))
			return

		const clean = numberCurrencyParse(input) 
		setCost(clean)

		const format = numberCurrency(clean)

		if (input.endsWith('.') && !format.includes('.'))
			setCostDisplay(format + '.')
		else if (input.endsWith('.0') && !format.endsWith('.0'))
			setCostDisplay(format + '.0')
		else
			setCostDisplay(format)
	}

	const performAppend = () => {
		if (!accountSelection)
			return
        
		if (association.some(association => association.account === accountSelection))
			return

		const data = account.find(account => account.id === accountSelection)

		if (!data)
			return

		setAssociation(previous => [ ...previous, { account : accountSelection, accountName : data.name } ])
		setAccountSelection('')
		setDialogOpen(false)
	}

	const performRemove = (targetId: string) => {
		setAssociation(previous => previous.filter(association => association.account !== targetId))
	}

	const performValidation = useCallback(() => {
		const numberLead 		  = number(lead)
		const numberLeadQualified = number(leadQualified)

		if (lead !== '' && leadQualified !== '' && numberLeadQualified > numberLead) {
			toast.error('Validation Error', { description : 'Qualified Lead must be less than or equal to Incoming Lead' })

			return false
		}

		if (!provision && numberLeadQualified > 0 && association.length !== numberLeadQualified) {
			toast.error('Validation Error', { description : 'Mapped accounts (' + association.length + ') must correspond to Qualified Leads input (' + numberLeadQualified + ')' })

			return false
		}

		return true
	}, [ lead, leadQualified, association.length, provision ])

	useEffect(() => {
		if (provision)
			return

		const form = refForm.current?.closest('form')

		if (!form)
			return

		const performSubmit = (event: Event) => {
			if (!performValidation()) {
				event.preventDefault()
				event.stopPropagation()
			}
		}

		form.addEventListener('submit', performSubmit)

		return () => form.removeEventListener('submit', performSubmit)
	}, [ performValidation, provision ])

	return (
		<Div ref={refForm}>
			{provision && id && <Input name={'id'} type={'hidden'} value={id} />}
			
			<Input name={'adsPerformanceAccount'} type={'hidden'} value={useMemo(() => JSON.stringify(association.map(association => ({ account : association.account }))), [ association ])} />

			<Div className={'mb-3 grid gap-y-3 md:grid-cols-2 md:gap-x-3 md:gap-y-0'}>
				<Fieldset>
					<Label htmlFor={'channel'}>Channel</Label>
					<Select name={'channel'} value={channel} onValueChange={setChannel}>
						<SelectTrigger id={'channel'}>
							<SelectValue placeholder={'Select a Channel'} />
						</SelectTrigger>

						<SelectContent align={'start'} className={'w-72'} position={'popper'} sideOffset={5}>
							<SelectGroup>
								<SelectItem value={'google'}>
									<SVG className={'-mr-1 size-3.5'} height={18.000} viewBox={'0 0 256 256'} width={18.000}>
										<Path d={'M87.1164 40.4642C89.5908 33.9663 92.9931 27.9842 98.0449 23.1366C118.252 3.43679 151.656 8.38753 165.368 33.1412C175.678 51.9128 186.607 70.2718 197.226 88.837C214.959 119.676 232.898 150.515 250.425 181.457C265.168 207.345 249.188 240.041 219.908 244.476C201.968 247.157 185.163 238.906 175.884 222.816C160.317 195.69 144.646 168.565 129.078 141.542C128.768 140.923 128.356 140.407 127.944 139.892C126.294 138.551 125.572 136.591 124.541 134.838C117.634 122.667 110.52 110.6 103.612 98.5322C99.179 90.6936 94.5395 82.958 90.1063 75.1194C86.0854 68.1058 84.2297 60.4734 84.4359 52.4285C84.7452 48.3029 85.2607 44.1772 87.1164 40.4642Z'} fill={'#155dfc'} />
										<Path d={'M87.1157 40.4639C86.1879 44.1769 85.3631 47.89 85.1569 51.8093C84.8476 60.4731 87.0126 68.518 91.3428 76.0473C102.684 95.5408 114.025 115.138 125.262 134.734C126.293 136.488 127.118 138.241 128.149 139.891C121.963 150.618 115.777 161.241 109.488 171.968C100.828 186.923 92.1676 201.982 83.4042 216.937C82.9918 216.937 82.8887 216.731 82.7856 216.421C82.6825 215.596 82.9918 214.874 83.198 214.049C87.425 198.578 83.9197 184.86 73.3005 173.102C66.8053 165.986 58.5574 161.963 49.0723 160.622C36.7004 158.869 25.772 162.066 15.9776 169.802C14.2249 171.143 13.0908 173.102 11.0288 174.134C10.6164 174.134 10.4102 173.928 10.3071 173.618C15.2559 165.057 20.1015 156.497 25.0503 147.936C45.4638 112.456 65.8774 76.9756 86.394 41.5984C86.6002 41.1859 86.9095 40.8764 87.1157 40.4639Z'} fill={'#FABC04'} />
										<Path d={'M10.72 173.928C12.6789 172.174 14.5346 170.318 16.5966 168.668C41.6496 148.865 79.2807 163.201 84.7449 194.556C86.0852 202.085 85.3635 209.305 83.0954 216.525C82.9923 217.144 82.8892 217.659 82.683 218.278C81.7551 219.928 80.9303 221.682 79.8993 223.332C70.7235 238.494 57.2176 246.023 39.4846 244.888C19.1741 243.444 3.19378 228.18 0.410113 207.964C-0.930172 198.166 1.02871 188.986 6.08055 180.529C7.11154 178.672 8.34872 177.022 9.48281 175.165C9.9983 174.753 9.7921 173.928 10.72 173.928Z'} fill={'#34A852'} />
									</SVG> Google Ads
								</SelectItem>
								<SelectItem value={'facebook'}>
									<SVG className={'-mr-1 size-3.5'} height={18.000} viewBox={'0 0 256 256'} width={18.000}>
										<Path d={'M256 128C256 57.308 198.692 0 128 0C57.308 0 0 57.308 0 128C0 191.692 46.769 245.231 108 255.692V165H75.5V128H108V99.5C108 67.5 127.5 50.5 157 50.5C171.5 50.5 186.5 53.5 186.5 53.5V86.5H170C153.5 86.5 148 95.5 148 104.5V128H184L178 165H148V255.692C209.231 245.231 256 191.692 256 128Z'} fill={'#1877F2'} />
									</SVG> Facebook
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				
					{errors.channel && <Message>{errors.channel[0]}</Message>}
				</Fieldset>

				<Fieldset className={'mb-0'}>
					<Label htmlFor={'date'}>Date</Label>
					<Input adornment={<Calendar className={'size-3.5'} />} defaultValue={typeof values.date === 'string' ? values.date : ''} id={'date'} name={'date'} type={'date'} />

					{errors.date && <Message>{errors.date[0]}</Message>}
				</Fieldset>
			</Div>

			<Separator className={'mb-3 bg-neutral-200/50 dark:bg-zinc-800/50'} />

			<Div className={'mb-3 grid gap-y-3 md:grid-cols-3 md:gap-x-3 md:gap-y-0'}>
				<Fieldset className={'mb-0'}>
					<Label htmlFor={'lead'}>Incoming Lead</Label>
					<Input adornment={<UserRound className={'size-3.5'} />} aria-invalid={Boolean(errors.lead)} id={'lead'} min={0} name={'lead'} type={'number'} value={lead} onChange={event => (value => (setLead(value), value && leadQualified && +leadQualified > +value && setLeadQualified(value)))(event.target.value)} />

					{errors.lead && <Message>{errors.lead[0]}</Message>}
				</Fieldset>

				<Fieldset className={'mb-0'}>
					<Label htmlFor={'lead_qualified'}>Qualified Lead</Label>
					<Input adornment={<UserRoundCheck className={'size-3.5'} />} aria-invalid={Boolean(errors.lead_qualified)} id={'lead_qualified'} max={lead ? lead : undefined} min={0} name={'lead_qualified'} type={'number'} value={leadQualified} onChange={event => setLeadQualified(event.target.value && lead && +event.target.value > +lead ? lead : event.target.value)} />

					{errors.lead_qualified && <Message>{errors.lead_qualified[0]}</Message>}
				</Fieldset>

				<Fieldset className={'mb-0'}>
					<Label htmlFor={'cost'}>Ads Cost</Label>
					<Input adornment={<ExtraSmall className={'text-neutral-500'}>IDR</ExtraSmall>} id={'cost'} min={0} name={'cost-display'} type={'text'} value={costDisplay} onChange={performChangeCost} />
					<Input name={'cost'} type={'hidden'} value={cost} />

					{errors.cost && <Message>{errors.cost[0]}</Message>}
				</Fieldset>
			</Div>

			<Separator className={'mb-3 bg-neutral-200/50 dark:bg-zinc-800/50'} />

			<Div className={'flex flex-col gap-1.5'}>
				<Div className={'flex items-center justify-between align-middle'}>
					<Div className={'flex flex-col gap-1'}>
						<Label>Qualified Lead Account</Label>
					</Div>

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
									<DialogDescription>Map the Account to the Activity</DialogDescription>
								</DialogHeader>

								<DialogBody>
									<Fieldset>
										<Label htmlFor={'dialog-account'}>Account</Label>
										<Select value={accountSelection} onValueChange={setAccountSelection}>
											<SelectTrigger id={'dialog-account'}>
												<SelectValue placeholder={<><Flag className={'-mr-1 size-3.5 text-neutral-500'} /> Select Account</>} />
											</SelectTrigger>

											<SelectContent>
												{
													account.map(account => (
														<SelectItem disabled={association.some((association) => association.account === account.id)} key={account.id} value={account.id}>
															<Flag className={'-mr-1 size-3.5 text-neutral-500'} />
															{account.name}
														</SelectItem>
													))
												}
											</SelectContent>
										</Select>
									</Fieldset>
								</DialogBody>

								<DialogFooter>
									<Button appearance={'ghost'} shape={'ellipse'} size={useMobile() ? 'md' : 'sm'} type={'button'} onClick={() => setDialogOpen(false)}>Cancel</Button>
									<Button appearance={'primary'} disabled={!accountSelection} shape={'ellipse'} size={useMobile() ? 'md' : 'sm'} type={'button'} onClick={performAppend}>
										<Plus className={'-mx-0.75 size-3.5'} /> Map
									</Button>
								</DialogFooter>
							</DialogCard>
						</DialogContent>
					</Dialog>
				</Div>

				<Div className={'flex flex-col gap-2.5'}>
					{
						association.length === 0 && (
							<Div className={'rounded-lg border border-neutral-200/50 bg-neutral-50/35 text-center dark:border-zinc-800/50 dark:bg-zinc-950/15'}>
								<State description={'Try mapping an Account'} title={'No Account Mapping'} type={'empty'} />
							</Div>
						)
					}
					
					{
						association.map(association => (
							<Div className={'flex flex-row items-center justify-between overflow-clip rounded-xl border border-neutral-200/50 bg-neutral-50/25 p-3.5 dark:border-zinc-800/50 dark:bg-zinc-900'} key={association.account}>
								<Div className={'flex flex-row items-center gap-3.5'}>
									<Div className={'flex size-9 items-center justify-center rounded-full bg-primary-500'}>
										<Flag className={'size-3.5 text-white'} />
									</Div>	

									<Div className={'flex flex-col items-start gap-0.25'}>
										<Small className={'font-semibold'}>{association.accountName}</Small>
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
		</Div>
	)
}
