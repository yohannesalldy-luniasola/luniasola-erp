'use client'

import type { Action } from '@/app/system/growth/datasource/deal/action/schema'

import { Form }              from '@/app/system/component/form'
import { insert }            from '@/app/system/growth/datasource/deal/action/mutation'
import { ICON, LABEL, PATH } from '@/app/system/growth/datasource/deal/action/schema'
import { FormCollection }    from '@/app/system/growth/datasource/deal/component/form/collection'

type FormCreateStageProps = {
	readonly defaultStage : string | null
	readonly open         : boolean
	readonly onOpenChange : (open: boolean) => void
	readonly account      : readonly { id : string, name : string, status : string | null }[]
	readonly people       : readonly { id : string, name : string }[]
}

export function FormCreateStage({ defaultStage, open, onOpenChange, account, people }: FormCreateStageProps) {
	const defaultValues = defaultStage ? { stage : defaultStage } : {}

	return (
		<Form
			action={insert}
			className={'w-3xl'}
			defaultOpen={open}
			icon={ICON}
			label={LABEL}
			mode={'create'}
			path={PATH}
			onOpenChange={onOpenChange}
		>
			{({ state }: { state : Action }) => (
				<FormCollection
					account={account}
					defaultValues={defaultValues}
					id={'form-create-stage'}
					people={people}
					provision={false}
					state={state}
				/>
			)}
		</Form>
	)
}
