import type { ReactNode } from 'react'
import { cn } from '../../lib/motion'
import PixelIcon from './PixelIcon'

const variants = {
  primary:
    'bg-accent text-paper border-ink shadow-[4px_4px_0_#0C0C0E] hover:shadow-[7px_7px_0_#0C0C0E] active:shadow-[0_0_0_#0C0C0E]',
  ghost: 'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper',
  lime: 'bg-lime text-ink border-lime shadow-[4px_4px_0_#EEEDE7] hover:shadow-[7px_7px_0_#EEEDE7] active:shadow-[0_0_0_#EEEDE7]',
}

interface Props {
  href: string
  children: ReactNode
  variant?: keyof typeof variants
  icon?: 'arrowUpRight' | 'arrowDown'
  external?: boolean
  className?: string
}

export default function PixelButton({
  href,
  children,
  variant = 'primary',
  icon = 'arrowUpRight',
  external,
  className,
}: Props) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'group inline-flex items-center justify-between gap-4 border px-5 py-4 font-mono text-xs uppercase tracking-[0.12em] transition-[transform,box-shadow,background-color,color] duration-150 hover:-translate-x-[3px] hover:-translate-y-[3px] active:translate-x-0 active:translate-y-0 md:px-6',
        variants[variant],
        className
      )}
    >
      <span>{children}</span>
      <span className="overflow-hidden">
        <PixelIcon
          name={icon}
          className={cn(
            'size-3 transition-transform duration-300 [transition-timing-function:steps(4)]',
            icon === 'arrowUpRight' ? 'group-hover:rotate-45' : 'group-hover:translate-y-0.5'
          )}
        />
      </span>
    </a>
  )
}
