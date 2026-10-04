import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { projects, type Category } from '../../data/projects'
import { useLang } from '../../i18n/context'
import { cn } from '../../lib/motion'
import { useIsomorphicLayoutEffect } from '../../lib/ready'
import PixelIcon from '../ui/PixelIcon'
import { RevealLines, SectionLabel } from '../ui/Text'
import PlaylistCard from '../work/PlaylistCard'
import VideoCard from '../work/VideoCard'
import VideoModal, { type PlayRequest } from '../work/VideoModal'
import WebsiteCard from '../work/WebsiteCard'

type Filter = 'all' | Category
const ORDER: Category[] = ['website', 'ads', 'video']

// Mentoring alumni live in their own section
const showcase = projects.filter((p) => p.category !== 'mentoring')

/** One width for every card; also capped by viewport height so a full card always fits on screen. */
const CARD_W = 'w-[min(80vw,calc((100svh_-_340px)*16/11))] sm:w-[min(56vw,calc((100svh_-_340px)*16/11))] lg:w-[min(40vw,640px,calc((100svh_-_340px)*16/11))]'

// Track padding lines the first card up with the page container
const TRACK_PAD = 'px-5 md:px-10 min-[1680px]:px-[calc((100vw_-_1600px)/2_+_40px)]'

export default function Work() {
  const { t } = useLang()
  const [filter, setFilter] = useState<Filter>('all')
  const [playing, setPlaying] = useState<PlayRequest | null>(null)
  const closePlayer = useCallback(() => setPlaying(null), [])

  const filters: Filter[] = ['all', ...ORDER.filter((c) => showcase.some((p) => p.category === c))]
  const list = filter === 'all' ? showcase : showcase.filter((p) => p.category === filter)
  const countFor = (f: Filter) => (f === 'all' ? showcase.length : showcase.filter((p) => p.category === f).length)

  const pinRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const [index, setIndex] = useState(0)

  // How far the track has to travel horizontally
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current
    const viewport = viewportRef.current
    if (!track || !viewport) return
    const measure = () => setDistance(Math.max(0, track.scrollWidth - viewport.clientWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    ro.observe(viewport)
    return () => ro.disconnect()
  }, [list.length])

  // Vertical scroll drives the horizontal track while the section is pinned
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, (v) => -v * distance)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setIndex(Math.round(v * Math.max(list.length - 1, 0))))

  const pinTop = () => (pinRef.current ? pinRef.current.getBoundingClientRect().top + window.scrollY : 0)
  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(i, list.length - 1))
    const step = list.length > 1 ? distance / (list.length - 1) : 0
    window.scrollTo({ top: pinTop() + step * clamped, behavior: 'smooth' })
  }

  // After changing the filter, jump back to the first card
  const changeFilter = (next: Filter) => {
    setFilter(next)
    if (window.scrollY > pinTop()) window.scrollTo({ top: pinTop(), behavior: 'smooth' })
  }

  useEffect(() => setIndex(0), [filter])

  const pinned = distance > 0

  return (
    <section id="work" className="bg-ink text-paper">
      <div className="container-x pt-24 md:pt-36">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel index="02" className="text-paper/60">
              {t.work.label}
            </SectionLabel>
            <div className="mt-6 flex items-start gap-3">
              <RevealLines
                key={t.work.title[0]}
                lines={t.work.title}
                className="text-[clamp(2.75rem,7.5vw,7.5rem)] font-medium leading-[0.9] tracking-[-0.05em]"
              />
              <span className="font-pixel text-3xl text-lime md:text-5xl">({String(showcase.length).padStart(2, '0')})</span>
            </div>
          </div>
          <p className="max-w-sm text-paper/60 md:col-span-4 md:justify-self-end">{t.work.body}</p>
        </div>
      </div>

      <div ref={pinRef} className="relative" style={{ height: pinned ? `calc(100svh + ${distance}px)` : undefined }}>
        <div className={cn('flex flex-col justify-center overflow-hidden py-8', pinned && 'sticky top-0 h-svh')}>
          {filters.length > 2 && (
            <LayoutGroup>
              <div className="container-x">
                <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
                  <div role="tablist" aria-label={t.work.label} className="flex w-max gap-2">
                    {filters.map((f) => {
                      const active = filter === f
                      return (
                        <button
                          key={f}
                          role="tab"
                          aria-selected={active}
                          onClick={() => changeFilter(f)}
                          className="label relative whitespace-nowrap border border-paper/20 px-4 py-3 transition-colors hover:border-paper/60"
                        >
                          {active && (
                            <motion.span
                              layoutId="work-filter"
                              className="absolute inset-0 bg-lime"
                              transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                            />
                          )}
                          <span className={cn('relative', active ? 'text-ink' : 'text-paper/70')}>
                            {t.work.filters[f]} <sup className="opacity-60">{countFor(f)}</sup>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </LayoutGroup>
          )}

          <div ref={viewportRef} className="mt-6 md:mt-8">
            <motion.div
              ref={trackRef}
              style={{ x }}
              role="region"
              aria-roledescription="carousel"
              aria-label={t.work.label}
              className={cn('flex w-max items-start gap-4 will-change-transform md:gap-6', TRACK_PAD)}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {list.map((project, i) => {
                  const number = showcase.indexOf(project) + 1
                  return (
                    <motion.div
                      key={`${filter}-${project.slug}`}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, delay: Math.min(i, 4) * 0.05 }}
                      aria-label={`${i + 1} / ${list.length}`}
                      className={cn('shrink-0', CARD_W)}
                    >
                      {project.kind === 'website' && <WebsiteCard project={project} number={number} />}
                      {project.kind === 'video' && <VideoCard project={project} number={number} onPlay={setPlaying} />}
                      {project.kind === 'playlist' && <PlaylistCard project={project} number={number} onPlay={setPlaying} />}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="container-x mt-6 flex items-center gap-4 md:mt-8 md:gap-6">
            <span className="label shrink-0 tabular-nums text-paper/60">
              {String(index + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
            </span>
            <div className="relative h-[3px] flex-1 overflow-hidden bg-paper/15">
              <motion.span
                className="absolute inset-0 origin-left bg-lime"
                style={{ scaleX: pinned ? scrollYProgress : 1 }}
              />
            </div>
            {pinned && (
              <span className="label hidden shrink-0 items-center gap-2 text-paper/40 sm:flex">
                <PixelIcon name="arrowDown" className="size-2.5 animate-bounce" />
                {t.work.drag}
              </span>
            )}
            <div className="flex shrink-0 gap-2">
              <NavButton label={t.work.prev} onClick={() => goTo(index - 1)} disabled={!pinned || index === 0} flip />
              <NavButton label={t.work.next} onClick={() => goTo(index + 1)} disabled={!pinned || index >= list.length - 1} />
            </div>
          </div>
        </div>
      </div>

      <div className="h-12 md:h-20" />

      <AnimatePresence>{playing && <VideoModal video={playing} onClose={closePlayer} />}</AnimatePresence>
    </section>
  )
}

function NavButton({ label, onClick, disabled, flip }: { label: string; onClick: () => void; disabled: boolean; flip?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-11 place-items-center border border-paper/25 text-paper transition-colors hover:border-lime hover:bg-lime hover:text-ink disabled:pointer-events-none disabled:opacity-30 md:size-12"
    >
      <PixelIcon name="play" className={cn('size-3', flip && 'rotate-180')} />
    </button>
  )
}
