import { motion } from 'framer-motion'
import type { Project } from '../../data/projects'
import { useLang } from '../../i18n/context'
import { cn, steps } from '../../lib/motion'
import PixelIcon from '../ui/PixelIcon'

/** Every project thumbnail uses this frame so cards line up perfectly. */
export const THUMB = 'aspect-[16/11] bg-ink-800'

/** Title, description, tags and action link shown under every project. */
export function CardMeta({
  project,
  number,
  actionLabel,
  actionHref,
}: {
  project: Project
  number: number
  actionLabel: string
  actionHref: string
}) {
  const { l } = useLang()

  return (
    <div className="mt-5 border-t border-paper/15 pt-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            <span className="label text-paper/40">{String(number).padStart(2, '0')}</span>
            <h3 className="truncate text-2xl font-medium tracking-tight md:text-[28px]">{project.title}</h3>
          </div>
        </div>
        <a
          href={actionHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${actionLabel}: ${project.title}`}
          className="group/link label flex shrink-0 items-center gap-2 pt-1.5 text-paper/60 transition-colors hover:text-lime"
        >
          <span className="hidden xl:inline">{actionLabel}</span>
          <span className="grid size-8 place-items-center border border-paper/25 transition-colors group-hover/link:border-lime group-hover/link:bg-lime group-hover/link:text-ink">
            <PixelIcon name="arrowUpRight" className="size-2.5" />
          </span>
        </a>
      </div>
      <p className="mt-2 line-clamp-2 min-h-[2.8em] text-sm leading-relaxed text-paper/55 md:text-[15px]">
        {l(project.description)}
      </p>
      {project.tags && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li key={tag} className="label border border-paper/15 px-2 py-1 text-paper/55">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Lime play button used on video thumbnails. */
export function PlayBadge({ label, className }: { label: string; className?: string }) {
  return (
    <motion.span
      variants={{ rest: { scale: 1 }, hover: { scale: 1.1 } }}
      transition={{ duration: 0.25, ease: steps(3) }}
      className={cn('flex items-center gap-3 bg-lime py-3 pl-4 pr-5 text-ink shadow-[4px_4px_0_#0C0C0E]', className)}
    >
      <PixelIcon name="play" className="size-3.5" />
      <span className="label">{label}</span>
    </motion.span>
  )
}

/** Small label pinned to the top-left of a thumbnail. */
export function ThumbBadge({ children }: { children: string }) {
  return <span className="label absolute left-3 top-3 z-10 bg-paper px-2 py-1 text-ink">{children}</span>
}
