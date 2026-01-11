import type { ReactNode } from 'react'

export type Dynamic      = 'auto' | 'error' | 'force-dynamic' | 'force-static'
export type SearchParams = Promise<{ [key: string] : string | string[] | undefined }>
export type PageProps    = Readonly<{ params : Promise<{ [key: string] : string }>, searchParams : SearchParams }>
export type LayoutProps  = Readonly<{ children : ReactNode, params : Promise<{ [key: string] : string }> }>
