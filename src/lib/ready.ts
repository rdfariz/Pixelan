import { createContext, useContext, useEffect, useLayoutEffect } from 'react'

/** True once the preloader starts revealing the page — entrance animations wait for it. */
export const ReadyContext = createContext(false)
export const useReady = () => useContext(ReadyContext)

/** useLayoutEffect in the browser, useEffect during server rendering (no warning). */
export const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
