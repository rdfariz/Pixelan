let locks = 0

/** Reference-counted page scroll lock, so stacked modals don't unlock each other. */
export function lockScroll() {
  locks += 1
  document.documentElement.style.overflow = 'hidden'
  return () => {
    locks = Math.max(0, locks - 1)
    if (locks === 0) document.documentElement.style.overflow = ''
  }
}
