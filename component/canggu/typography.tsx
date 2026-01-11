import { classNames } from '@/component/utility/style'

export type Heading   = ReadonlyComponentProps<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>
export type Paragraph = ReadonlyComponentProps<'p'>
export type Small     = ReadonlyComponentProps<'small'>

export const STYLE = classNames('scroll-m-20 font-sans leading-normal font-normal tracking-normal text-foreground antialiased')

export function Heading1({ className, ...props }: Heading) {
	return <h1 className={classNames(STYLE, 'text-4xl', className)} {...props} /> 
}

export function Heading2({ className, ...props }: Heading) {
	return <h2 className={classNames(STYLE, 'text-3xl', className)} {...props} /> 
}

export function Heading3({ className, ...props }: Heading) {
	return <h3 className={classNames(STYLE, 'text-2xl', className)} {...props} /> 
}

export function Heading4({ className, ...props }: Heading) {
	return <h4 className={classNames(STYLE, 'text-xl', className)} {...props} /> 
}

export function Heading5({ className, ...props }: Heading) {
	return <h5 className={classNames(STYLE, 'text-lg', className)} {...props} /> 
}

export function Heading6({ className, ...props }: Heading) {
	return <h6 className={classNames(STYLE, className)} {...props} /> 
}

export function Paragraph({ className, ...props }: Paragraph) {
	return <p className={classNames(STYLE, 'text-base', className)} {...props} /> 
}

export function Small({ className, ...props }: Small) {
	return <small className={classNames(STYLE, 'text-sm', className)} {...props} /> 
}

export function ExtraSmall({ className, ...props }: Small) {
	return <small className={classNames(STYLE, 'text-xs', className)} {...props} /> 
}
