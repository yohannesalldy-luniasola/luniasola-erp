import type { ComponentProps, ElementType } from 'react'

declare global {
    type ReadonlyComponentProps<T extends ElementType> = Readonly<ComponentProps<T>>
}

export {}
