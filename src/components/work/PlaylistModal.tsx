import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { youtubeThumb, type PlaylistProject } from '../../data/projects'
import { useLang } from '../../i18n/context'
import { lockScroll } from '../../lib/scrollLock'
import { EASE_OUT, cn, steps } from '../../lib/motion'
import PixelIcon from '../ui/PixelIcon'

interface Props {
  project: PlaylistProject
  selected: number
  onSelect: (index: number) => void
  onClose: () => void
}

/**
 * Full-screen gallery of every video in a playlist.
 * Rendered in a portal so it isn't trapped inside the moving project track.
 */
export default function PlaylistModal({ project, selected, onSelect, onClose }: Props) {
  const { t } = useLang()
  const total = project.videos.length

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const unlock = lockScroll()
    return () => {
      window.removeEventListener('keydown', onKey)
      unlock()
    }
  }, [onClose])

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.45, ease: steps(8) }}
      className="fixed inset-0 z-[65] overflow-y-auto overscroll-contain bg-ink text-paper"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-paper/10 bg-ink/90 backdrop-blur-md">
        <div className="container-x flex items-center justify-between gap-4 py-4 md:py-5">
          <div className="min-w-0">
            <p className="label flex items-center gap-2 text-paper/50">
              <span className="size-1.5 bg-lime" />
              {t.work.playlist} · {total} {t.work.videos}
            </p>
            <h2 className="mt-1 truncate text-xl font-medium tracking-tight md:text-3xl">{project.title}</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="label hidden items-center gap-2 border border-paper/25 px-3 py-2.5 transition-colors hover:border-lime hover:text-lime sm:flex"
            >
              {t.work.openYoutube}
              <PixelIcon name="arrowUpRight" className="size-2.5" />
            </a>
            <button
              type="button"
              onClick={onClose}
              autoFocus
              className="label flex items-center gap-2 bg-lime px-3 py-2.5 text-ink"
            >
              {t.work.close}
              <PixelIcon name="close" className="size-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <ul className="container-x grid grid-cols-2 gap-x-3 gap-y-6 py-8 sm:grid-cols-3 md:gap-x-5 md:gap-y-10 md:py-12 lg:grid-cols-4">
        {project.videos.map((video, i) => (
          <motion.li
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.2 + Math.min(i, 12) * 0.03 }}
          >
            <button type="button" onClick={() => onSelect(i)} className="group block w-full text-left">
              <span
                className={cn(
                  'relative block aspect-video overflow-hidden bg-ink-800 outline outline-2 -outline-offset-2',
                  i === selected ? 'outline-lime' : 'outline-transparent'
                )}
              >
                <img
                  src={youtubeThumb(video.id, 'mq')}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/30" />
                <span className="label absolute left-2 top-2 bg-ink/85 px-1.5 py-0.5 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="absolute bottom-2 right-2 grid size-8 place-items-center bg-lime text-ink opacity-0 transition-opacity group-hover:opacity-100 max-md:opacity-100">
                  <PixelIcon name="play" className="size-2.5" />
                </span>
              </span>
              <span
                className={cn(
                  'mt-2.5 line-clamp-2 text-sm leading-snug transition-colors md:text-[15px]',
                  i === selected ? 'text-lime' : 'text-paper/80 group-hover:text-paper'
                )}
              >
                {video.title}
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.div>,
    document.body
  )
}
