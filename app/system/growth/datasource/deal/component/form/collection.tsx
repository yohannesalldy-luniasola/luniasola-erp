'use client'

import type { Action, Schema } from '@/app/system/growth/datasource/deal/action/schema'

import { Building2, DollarSign, Tag } from 'lucide-react'

import { LABEL, SOURCE_VALUES, STAGE_VALUES }                                                             from '@/app/system/growth/datasource/deal/action/schema'
import { Span }                                                                                           from '@/component/canggu/block'
import { Fieldset, Label, Input, Message, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/component/canggu/form'
import { Separator }                                                                                      from '@/component/canggu/separator'

type FormCollection = {
	readonly state          : Action
	readonly defaultValues? : Partial<Schema>
	readonly id             : string
	readonly provision?     : boolean
	readonly account        : readonly { id : string, name : string, status : string | null }[]
}

export function FormCollection({ state, defaultValues, id, provision = false, account }: FormCollection) {
	const errors = state?.status === 'error' ? state.errors ?? {} : {}
	const values = state?.status === 'error' ? state.inputs ?? defaultValues ?? {} : defaultValues ?? {}

	return (
		<>
			{provision && id && <Input name={'id'} type={'hidden'} value={id} />}

			<Fieldset>
				<Label htmlFor={'name'}>{LABEL} Name</Label>
				<Input adornment={<Tag className={'size-3.5'} />} defaultValue={values.name} id={'name'} name={'name'} placeholder={LABEL + ' ' + 'Name'} type={'text'} />

				{errors.name && <Message>{errors.name[0]}</Message>}
			</Fieldset>

			<Fieldset>
				<Label htmlFor={'account'}>Account</Label>
				<Select defaultValue={values.account} name={'account'}>
					<SelectTrigger id={'account'}>
						<SelectValue placeholder={'Select an Account'} />
					</SelectTrigger>

					<SelectContent align={'start'} position={'popper'} sideOffset={5}>
						{account.map((acc) => {
							const isPassed   = acc.status === 'passed'
							const isSelected = values.account === acc.id

							return (
								<SelectItem disabled={!isPassed && !isSelected} key={acc.id} value={acc.id}>
									<Span className={'flex items-center justify-between gap-3'}>
										<Span className={'flex items-center gap-2'}>
											<Building2 className={'size-3.5'} />
											{acc.name}
										</Span>

										<Span
											className={
												'rounded-full px-2 py-0.5 text-2xs font-semibold ' +
												(acc.status === 'passed'
													? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
													: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500')
											}
										>
											{acc.status ?? 'Unknown'}
										</Span>
									</Span>
								</SelectItem>
							)
						})}
					</SelectContent>
				</Select>

				{errors.account && <Message>{errors.account[0]}</Message>}
			</Fieldset>

			<Fieldset>
				<Label htmlFor={'amount'}>Amount</Label>
				<Input adornment={<DollarSign className={'size-3.5'} />} defaultValue={values.amount} id={'amount'} name={'amount'} placeholder={'0'} type={'number'} />

				{errors.amount && <Message>{errors.amount[0]}</Message>}
			</Fieldset>

			<Separator className={'mb-2.5 bg-neutral-200/50 dark:bg-zinc-800/50'} />

			<Fieldset>
				<Label htmlFor={'source'}>Source</Label>
				<Select defaultValue={values.source} name={'source'}>
					<SelectTrigger className={'w-1/2'} id={'source'}>
						<SelectValue placeholder={'Select a Source'} />
					</SelectTrigger>

					<SelectContent align={'start'} position={'popper'} sideOffset={5}>
						{SOURCE_VALUES.map((source) => (
							<SelectItem key={source} value={source}>
								{source}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{errors.source && <Message>{errors.source[0]}</Message>}
			</Fieldset>

			<Fieldset>
				<Label htmlFor={'stage'}>Stage</Label>
				<Select defaultValue={values.stage ?? 'Discovery'} name={'stage'}>
					<SelectTrigger className={'w-1/2'} id={'stage'}>
						<SelectValue placeholder={'Select a Stage'} />
					</SelectTrigger>

					<SelectContent align={'start'} position={'popper'} sideOffset={5}>
						{STAGE_VALUES.map((stage) => (
							<SelectItem key={stage} value={stage}>
								{stage}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{errors.stage && <Message>{errors.stage[0]}</Message>}
			</Fieldset>
		</>
	)
}
