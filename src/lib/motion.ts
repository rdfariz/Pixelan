export const EASE = [0.76, 0, 0.24, 1] as const
export const EASE_OUT = [0.16, 1, 0.3, 1] as const

/** Stepped easing — makes any tween move in chunky "pixel" increments. */
export const steps = (n: number) => (t: number) => Math.floor(t * n) / n

export const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(' ')
