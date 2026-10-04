import { useEffect } from 'react'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Smoothly scroll to `#id` (or the very top for `#top` / empty). */
export function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'
  if (!id || id === 'top') return window.scrollTo({ top: 0, behavior })
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior })
}

/**
 * Hash links across the site:
 * - opening the page with `#work` (etc.) glides there once the preloader reveals the page
 * - in-page `#links` scroll smoothly and update the URL (works even while a menu is locking scroll)
 * - browser back / forward between sections
 */
export function useHashNavigation(ready: boolean) {
  // Start at the top so the preloader → hero reveal always plays first
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    if (window.location.hash) window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!ready) return
    const timers: number[] = []

    if (window.location.hash) timers.push(window.setTimeout(() => scrollToHash(window.location.hash), 450))

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]')
      if (!link) return
      const hash = link.getAttribute('href') ?? '#'
      e.preventDefault()
      const url = hash === '#top' || hash === '#' ? window.location.pathname + window.location.search : hash
      if (url !== window.location.hash) history.pushState(null, '', url)
      // Let menus close (and release the scroll lock) before moving
      timers.push(window.setTimeout(() => scrollToHash(hash), 40))
    }
    const onPop = () => scrollToHash(window.location.hash)

    document.addEventListener('click', onClick)
    window.addEventListener('popstate', onPop)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('popstate', onPop)
      timers.forEach(clearTimeout)
    }
  }, [ready])
}
