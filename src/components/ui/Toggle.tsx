import { motion } from 'framer-motion'
import { cn } from '../../lib/motion'

interface Option<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  /** Unique id so the sliding highlight doesn't jump between toggles */
  id: string
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
  label: string
  /** 'light' sits on light backgrounds, 'blend' on the mix-blend header */
  tone?: 'light' | 'blend'
  className?: string
}

/** Small segmented switch — used for language (EN/ID) and currency (Rp/$). */
export default function Toggle<T extends string>({ id, value, options, onChange, label, tone = 'light', className }: Props<T>) {
  const blend = tone === 'blend'
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('label inline-flex border p-0.5', blend ? 'border-white' : 'border-ink', className)}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className="relative min-w-9 px-2.5 py-1.5"
          >
            {active && (
              <motion.span
                layoutId={`toggle-${id}`}
                className={cn('absolute inset-0', blend ? 'bg-white' : 'bg-ink')}
                transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
              />
            )}
            <span
              className={cn(
                'relative transition-colors',
                active ? (blend ? 'text-black' : 'text-paper') : blend ? 'text-white' : 'text-ink'
              )}
            >
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
