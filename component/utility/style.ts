import { clsx, type ClassValue } from 'clsx'
import { twMerge }               from 'tailwind-merge'

export const classNames = (...args: ReadonlyArray<ClassValue>): string => twMerge(clsx(args))
