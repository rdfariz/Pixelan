import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'

/** True once the preloader starts revealing the page — entrance animations wait for it. */
export const ReadyContext = createContext(false)
export const useReady = () => useContext(ReadyContext)

/** useLayoutEffect in the browser, useEffect during server rendering (no warning). */
export const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * False on the server and during hydration, true right after. Content behind it
 * (the portfolio) is left out of the prerendered HTML, so search results stay
 * about Pixelan Studio itself rather than the projects it has made.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}
