import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { youtubeThumb, type PlaylistProject } from '../../data/projects'
import { useLang } from '../../i18n/context'
import { cn } from '../../lib/motion'
import PixelIcon from '../ui/PixelIcon'
import PixelReveal from '../ui/PixelReveal'
import PlaylistModal from './PlaylistModal'
import { CardMeta, PlayBadge, THUMB, ThumbBadge } from './shared'
import type { PlayRequest } from './VideoModal'

interface Props {
  project: PlaylistProject
  number: number
  onPlay: (video: PlayRequest) => void
}

/**
 * Playlist in the standard card frame:
 * big preview on top, a swipeable strip of every video below, and a "view all" gallery.
 */
export default function PlaylistCard({ project, number, onPlay }: Props) {
  const { t } = useLang()
  const [selected, setSelected] = useState(0)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const total = project.videos.length
  const video = project.videos[selected]
  const pad = (n: number) => String(n).padStart(2, '0')
  const go = (dir: 1 | -1) => setSelected((i) => (i + dir + total) % total)
  const play = (i: number) =>
    onPlay({ id: project.videos[i].id, title: project.videos[i].title, list: project.playlistId, index: i })

  // Keep the selected thumbnail visible in the strip (scrolls the strip only, never the page)
  useEffect(() => {
    const strip = stripRef.current
    const item = itemRefs.current[selected]
    if (!strip || !item) return
    strip.scrollTo({ left: item.offsetLeft - strip.clientWidth / 2 + item.clientWidth / 2, behavior: 'smooth' })
  }, [selected])

  return (
    <div>
      <PixelReveal className={THUMB}>
        <div className="absolute inset-0 flex flex-col">
          {/* Preview */}
          <motion.button
            type="button"
            initial="rest"
            whileHover="hover"
            animate="rest"
            onClick={() => play(selected)}
            aria-label={`${t.work.play}: ${video.title}`}
            className="group relative min-h-0 flex-1 overflow-hidden text-left"
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={video.id}
                src={youtubeThumb(video.id, 'maxres')}
                alt={video.title}
                loading="lazy"
                decoding="async"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </AnimatePresence>
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/5 to-ink/40" />
            <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 md:p-4">
              <span className="min-w-0 text-paper">
                <span className="label block text-paper/60">
                  {t.work.nowShowing} · {pad(selected + 1)}/{pad(total)}
                </span>
                <span className="mt-1 block truncate text-sm font-medium md:text-base">{video.title}</span>
              </span>
              <PlayBadge label={t.work.play} className="shrink-0 py-2.5 pl-3 pr-4" />
            </span>
          </motion.button>

          {/* Strip of every video */}
          <div className="relative flex h-[27%] shrink-0 gap-1.5 bg-ink p-1.5">
            <div
              ref={stripRef}
              className="flex min-w-0 flex-1 snap-x gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {project.videos.map((item, i) => (
                <button
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[i] = el
                  }}
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-label={item.title}
                  aria-pressed={i === selected}
                  className={cn(
                    'relative aspect-video h-full shrink-0 snap-start overflow-hidden outline outline-2 -outline-offset-2 transition-[outline-color]',
                    i === selected ? 'outline-lime' : 'outline-transparent hover:outline-paper/40'
                  )}
                >
                  <img
                    src={youtubeThumb(item.id, 'mq')}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      'size-full object-cover transition-opacity',
                      i === selected ? 'opacity-100' : 'opacity-55 hover:opacity-100'
                    )}
                  />
                  <span className="absolute left-1 top-1 bg-ink/80 px-1 font-mono text-[9px] leading-tight text-paper">
                    {pad(i + 1)}
                  </span>
                </button>
              ))}
            </div>

            {/* Open the full gallery */}
            <button
              type="button"
              onClick={() => setGalleryOpen(true)}
              className="flex aspect-square h-full shrink-0 flex-col items-center justify-center gap-1 bg-lime text-ink transition-colors hover:bg-paper"
            >
              <span className="font-pixel text-2xl leading-none md:text-3xl">{total}</span>
              <span className="font-mono text-[8px] uppercase tracking-wider md:text-[9px]">{t.work.viewAll}</span>
            </button>
          </div>
        </div>

        <ThumbBadge>{t.work.filters[project.category]}</ThumbBadge>

        {/* Prev / next */}
        <div className="absolute right-3 top-3 z-10 flex gap-1">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => go(dir)}
              aria-label={dir === -1 ? t.work.prev : t.work.next}
              className="grid size-8 place-items-center bg-ink/80 text-paper transition-colors hover:bg-lime hover:text-ink"
            >
              <PixelIcon name="play" className={cn('size-2.5', dir === -1 && 'rotate-180')} />
            </button>
          ))}
        </div>
      </PixelReveal>

      <CardMeta project={project} number={number} actionLabel={t.work.openYoutube} actionHref={project.url} />

      <AnimatePresence>
        {galleryOpen && (
          <PlaylistModal
            project={project}
            selected={selected}
            onClose={() => setGalleryOpen(false)}
            onSelect={(i) => {
              setSelected(i)
              setGalleryOpen(false)
              play(i)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
