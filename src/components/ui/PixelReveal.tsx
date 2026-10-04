import { useMemo, useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { hash01 } from '../../lib/glyphs'
import { cn } from '../../lib/motion'

interface Props {
  children: ReactNode
  className?: string
  /** Colour of the covering pixels — defaults to the section's `--reveal` CSS variable. */
  color?: string
  cols?: number
  rows?: number
}

/** Covers its content with a grid of pixels that dissolve randomly when scrolled into view. */
export default function PixelReveal({ children, className, color = 'var(--reveal, #0C0C0E)', cols = 8, rows = 6 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  const delays = useMemo(() => Array.from({ length: cols * rows }, (_, i) => hash01(i, cols) * 0.8), [cols, rows])

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
      >
        {delays.map((delay, i) => (
          <motion.span
            key={i}
            style={{ backgroundColor: color, boxShadow: `0 0 0 1px ${color}` }}
            initial={{ opacity: 1 }}
            animate={{ opacity: inView ? 0 : 1 }}
            transition={{ duration: 0.01, delay: inView ? delay : 0 }}
          />
        ))}
      </div>
    </div>
  )
}
