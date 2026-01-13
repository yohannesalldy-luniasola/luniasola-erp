'use client'

import type { Action, Schema } from '@/app/system/growth/datasource/deal/action/schema'

import Link from 'next/link'

import { useState } from 'react'

import { Building2, Tag, UserRound, X } from 'lucide-react'

import { LABEL, SOURCE_VALUES, STAGE_VALUES }                                                             from '@/app/system/growth/datasource/deal/action/schema'
import { Div, Span }                                                                                      from '@/component/canggu/block'
import { Fieldset, Label, Input, Message, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/component/canggu/form'
import { Separator }                                                                                      from '@/component/canggu/separator'

type FormCollection = {
	readonly state          : Action
	readonly defaultValues? : Partial<Schema>
	readonly id             : string
	readonly provision?     : boolean
	readonly account        : readonly { id : string, name : string, status : string | null }[]
	readonly people         : readonly { id : string, name : string }[]
}

export function FormCollection({ state, defaultValues, id, provision = false, account, people }: FormCollection) {
	const errors = state?.status === 'error' ? state.errors ?? {} : {}
	const values = state?.status === 'error' ? state.inputs ?? defaultValues ?? {} : defaultValues ?? {}

	const [ accountValue, setAccountValue ] = useState<string | undefined>(values.account)
	const [ peopleValue, setPeopleValue ]   = useState<string | undefined>(undefined)

	const isAccountDisabled = !!peopleValue
	const isPeopleDisabled  = !!accountValue

	const handleClearAccount = (e: React.MouseEvent) => {
		e.stopPropagation()
		setAccountValue(undefined)
		setPeopleValue(undefined)
	}

	const handleClearPeople = (e: React.MouseEvent) => {
		e.stopPropagation()
		setAccountValue(undefined)
		setPeopleValue(undefined)
	}

	return (
		<>
			{provision && id && <Input name={'id'} type={'hidden'} value={id} />}

			<Fieldset>
				<Label htmlFor={'name'}>{LABEL} Name</Label>
				<Input adornment={<Tag className={'size-3.5'} />} defaultValue={values.name} id={'name'} name={'name'} placeholder={LABEL + ' ' + 'Name'} type={'text'} />

				{errors.name && <Message>{errors.name[0]}</Message>}
			</Fieldset>

			<Fieldset>
				<Label className={'flex items-center gap-2'} htmlFor={'account'}>
					Account
					<Link className={'text-2xs text-primary hover:underline'} href={'/system/growth/datasource/people'}>
						(for unassigned contact please set through People page)
					</Link>
				</Label>
				<Div className={'relative'}>
					<Select
						disabled={isAccountDisabled}
						key={`account-${accountValue || 'empty'}`}
						name={isAccountDisabled ? undefined : 'account'}
						value={accountValue}
						onValueChange={(value) => {
							setAccountValue(value)
							setPeopleValue(undefined)
						}}
					>
						<SelectTrigger aria-disabled={isAccountDisabled} className={'pr-8'} id={'account'}>
							<SelectValue placeholder={'Select an Account'} />
						</SelectTrigger>

						<SelectContent align={'start'} position={'popper'} sideOffset={5}>
							{account.map((acc) => {
								const isPassed = acc.status === 'passed'

								return (
									<SelectItem disabled={!isPassed} key={acc.id} value={acc.id}>
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
												{acc.status ?? 'Contact Unassigned'}
											</Span>
										</Span>
									</SelectItem>
								)
							})}
						</SelectContent>
					</Select>
					{accountValue && (
						<button
							className={'absolute top-1/2 right-2 z-10 flex -translate-y-1/2 items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none'}
							type={'button'}
							onClick={handleClearAccount}
						>
							<X className={'size-3.5'} />
							<span className={'sr-only'}>Clear selection</span>
						</button>
					)}
				</Div>

				{errors.account && <Message>{errors.account[0]}</Message>}
			</Fieldset>

			<Fieldset>
				<Label htmlFor={'people'}>Contact Person</Label>
				<Div className={'relative'}>
					<Select
						disabled={isPeopleDisabled}
						key={`people-${peopleValue || 'empty'}`}
						name={isPeopleDisabled ? undefined : 'people'}
						value={peopleValue}
						onValueChange={(value) => {
							setPeopleValue(value)
							setAccountValue(undefined)
						}}
					>
						<SelectTrigger aria-disabled={isPeopleDisabled} className={'pr-8'} id={'people'}>
							<SelectValue placeholder={'Select a Contact Person'} />
						</SelectTrigger>

						<SelectContent align={'start'} position={'popper'} sideOffset={5}>
							{people.map((person) => (
								<SelectItem key={person.id} value={person.id}>
									<Span className={'flex items-center gap-2'}>
										<UserRound className={'size-3.5'} />
										{person.name}
									</Span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{peopleValue && (
						<button
							className={'absolute top-1/2 right-2 z-10 flex -translate-y-1/2 items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none'}
							type={'button'}
							onClick={handleClearPeople}
						>
							<X className={'size-3.5'} />
							<span className={'sr-only'}>Clear selection</span>
						</button>
					)}
				</Div>
			</Fieldset>

			<Fieldset>
				<Label htmlFor={'amount'}>Amount</Label>
				<Input adornment={<Span className={'text-sm font-medium text-neutral-600 dark:text-neutral-400'}>Rp</Span>} defaultValue={values.amount} id={'amount'} name={'amount'} placeholder={'0'} type={'number'} />

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
