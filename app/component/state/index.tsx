import type { ReactNode } from 'react'

import Image from 'next/image'

import { State as StateRoot, StateHeader, StateTitle, StateDescription, StateContent, StateMedia } from '@/component/canggu/state'

type State = { 
	readonly type         : StateType
	readonly title?       : string
	readonly description? : ReactNode
	readonly children?    : ReactNode
	readonly className?   : string 
}
type StateType   = 'empty' | 'error' | 'forthcoming' | 404
type StateConfig = {
	readonly title       : string
	readonly description : string
	readonly src         : string
	readonly alt         : string
	readonly width       : number
	readonly height      : number
}

const STATE: Record<StateType, StateConfig> = {
	'empty' : { 
		title       : 'No Results Available', 
		description : 'There is nothing to display here yet. Try adjusting your filters or search criteria.',
		src         : '/asset/static/state/empty.png', 
		alt         : 'No Results Available',
		width       : 64,
		height      : 64, 
	},
	'error' : { 
		title       : 'Something Went Wrong!', 
		description : 'An unexpected error occurred while processing your request. Please try again later.',
		src         : '/asset/static/state/error.png', 
		alt         : 'Something Went Wrong!', 
		width       : 128,
		height      : 128,
	},
	'forthcoming' : { 
		title       : 'Forthcoming Feature', 
		description : 'This feature is currently under development and will be launched in a future release.',
		src         : '/asset/static/state/forthcoming.png', 
		alt         : 'Forthcoming', 
		width       : 128,
		height      : 128,
	},
	404 : { 
		title       : 'Page Not Found', 
		description : 'The page you are looking for does not exist or has been moved.',
		src         : '/asset/static/state/404.png', 
		alt         : 'Page Not Found', 
		width       : 128,
		height      : 128,
	},
}

export function State({ type, title, description, children, className }: State) {
	const config = STATE[type]

	return (
		<StateRoot className={className}>
			<StateHeader>
				<StateMedia>
					<Image alt={title ?? config.title} className={'duration-400 ease-in-out transform-3d hover:translate-z-42 hover:scale-105 hover:-rotate-y-10'} height={config.height} priority={true} src={config.src} width={config.width} />
				</StateMedia>

				<StateTitle>{title ?? config.title}</StateTitle>
				{(description ?? config.description) && <StateDescription>{description ?? config.description}</StateDescription>}
			</StateHeader>

			{children && <StateContent>{children}</StateContent>}
		</StateRoot>
	)         
}
