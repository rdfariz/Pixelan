import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { EASE_OUT, cn } from '../../lib/motion'

/** Small mono label used above section titles, e.g. "(02) Selected Work". */
export function SectionLabel({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p className={cn('label flex items-center gap-2', className)}>
      <span className="size-1.5 bg-current" />
      {index && <span className="opacity-50">({index})</span>}
      <span>{children}</span>
    </p>
  )
}

interface RevealLinesProps {
  lines: ReactNode[]
  as?: 'h1' | 'h2' | 'p'
  className?: string
  delay?: number
  /** Control the reveal manually; falls back to in-view detection. */
  show?: boolean
}

/** Masked line-by-line slide-up reveal. */
export function RevealLines({ lines, as = 'h2', className, delay = 0, show }: RevealLinesProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const visible = show ?? inView
  const Tag = as

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
          <motion.span
            className="block"
            initial={{ y: '110%' }}
            animate={{ y: visible ? '0%' : '110%' }}
            transition={{ duration: 1.1, ease: EASE_OUT, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Text that rolls up to a duplicate on hover (needs a `group` parent). */
export function RollText({ children }: { children: string }) {
  const base = 'block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]'
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className={cn(base, 'group-hover:-translate-y-full')}>{children}</span>
      <span aria-hidden className={cn(base, 'absolute inset-0 translate-y-full group-hover:translate-y-0')}>
        {children}
      </span>
    </span>
  )
}
