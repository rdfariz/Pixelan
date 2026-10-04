import { useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { waLink } from '../../data/site'
import { useLang } from '../../i18n/context'
import { EASE_OUT, cn, steps } from '../../lib/motion'
import PixelIcon from '../ui/PixelIcon'
import { RevealLines, SectionLabel } from '../ui/Text'

type IconName = 'star' | 'crosshair' | 'paw' | 'gamepad' | 'sword'

/** Game joki — styled like a game's character-select screen so it reads as its own world. */
export default function Joki() {
  const { t } = useLang()
  const games = t.joki.games
  const [gameIndex, setGameIndex] = useState(0)
  const [tasks, setTasks] = useState<number[]>([])

  const game = games[gameIndex]
  const logRef = useRef<HTMLDivElement>(null)
  const pickGame = (i: number) => {
    setGameIndex(i)
    setTasks([])
    // On stacked layouts the quest log sits below the tiles — bring it into view if it's off screen
    const log = logRef.current
    if (log && window.matchMedia('(max-width: 1023px)').matches && log.getBoundingClientRect().top > window.innerHeight * 0.75) {
      log.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  const toggleTask = (i: number) =>
    setTasks((current) => (current.includes(i) ? current.filter((n) => n !== i) : [...current, i].sort((a, b) => a - b)))

  const taskLabels = tasks.map((i) => game.tasks[i])
  const message = t.joki.message(game.name, taskLabels)

  return (
    <section
      id="joki"
      style={{ '--game': game.color } as CSSProperties}
      className="relative overflow-hidden bg-[#07070A] py-24 text-paper md:py-36"
    >
      {/* CRT scanlines + glow in the selected game's colour */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(0deg,#fff_0px,#fff_1px,transparent_1px,transparent_4px)]"
      />
      <motion.div
        aria-hidden
        animate={{ backgroundColor: game.color }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute -right-40 top-20 size-[520px] opacity-[0.12] blur-[120px]"
      />

      <div className="container-x relative">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <div className="flex items-center gap-3">
              <SectionLabel index="05" className="text-paper/60">
                {t.joki.label}
              </SectionLabel>
              <span className="label animate-pulse bg-[var(--game)] px-2 py-0.5 text-ink transition-colors">Open</span>
            </div>
            <RevealLines
              key={t.joki.title[0]}
              lines={[
                t.joki.title[0],
                <span className="font-pixel font-normal tracking-normal text-[var(--game)] transition-colors duration-500">
                  {t.joki.title[1]}
                </span>,
              ]}
              className="mt-6 text-[clamp(2.5rem,6.5vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.045em]"
            />
          </div>
          <p className="max-w-sm text-paper/60 md:col-span-4 md:justify-self-end">{t.joki.body}</p>
        </div>

        <ul className="mt-10 flex flex-wrap gap-2">
          {t.joki.points.map((point) => (
            <li key={point} className="label flex items-center gap-2 border border-paper/15 px-3 py-2 text-paper/70">
              <span className="text-[var(--game)] transition-colors">
                <PixelIcon name="check" className="size-2.5" />
              </span>
              {point}
            </li>
          ))}
        </ul>

        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 lg:grid-cols-12 lg:gap-8">
          {/* Game select — tiles on small screens, a list on desktop */}
          <div className="min-w-0 lg:col-span-5">
            <p className="label mb-4 flex items-center gap-2 text-paper/50">
              <span className="animate-pulse">▶</span> {t.joki.pick}
            </p>
            <div
              role="radiogroup"
              aria-label={t.joki.pick}
              className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-1 lg:gap-3"
            >
              {games.map((g, i) => {
                const active = i === gameIndex
                // With an odd number of games, the last tile spans the full row on 2-column phones
                const wide = i === games.length - 1 && games.length % 2 === 1
                return (
                  <button
                    key={g.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => pickGame(i)}
                    style={{ '--c': g.color } as CSSProperties}
                    className={cn(
                      'group relative flex min-w-0 gap-3 border p-3 text-left transition-colors lg:flex-row lg:items-center lg:gap-4',
                      wide
                        ? 'col-span-2 flex-row items-center sm:col-span-1 sm:flex-col sm:items-start'
                        : 'flex-col items-start',
                      active ? 'border-[var(--c)] bg-[color-mix(in_srgb,var(--c)_12%,transparent)]' : 'border-paper/15 hover:border-paper/40'
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-11 shrink-0 place-items-center transition-colors md:size-12 lg:size-16',
                        active ? 'bg-[var(--c)] text-ink' : 'bg-paper/5 text-[var(--c)]'
                      )}
                    >
                      <PixelIcon name={g.icon as IconName} className="size-5 lg:size-7" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-pixel text-2xl leading-[0.9] md:text-[28px] lg:truncate lg:text-4xl">{g.name}</span>
                      <span className="label mt-1.5 block truncate text-[10px] text-paper/45 md:text-[11px]">{g.tag}</span>
                    </span>
                    <span
                      className={cn(
                        'label absolute right-2 top-2 px-1.5 py-0.5 text-[10px] transition-opacity lg:static lg:shrink-0 lg:text-[11px]',
                        active ? 'bg-[var(--c)] text-ink opacity-100' : 'opacity-0'
                      )}
                    >
                      P1
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quest log */}
          <div ref={logRef} className="relative min-w-0 scroll-mt-6 border border-[var(--game)] bg-ink/60 transition-colors duration-500 lg:col-span-7">
            <HudCorners />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={game.id}
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                animate={{ clipPath: 'inset(0 0 0% 0)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: steps(7) }}
                className="p-4 sm:p-6 md:p-8"
              >
                <div className="flex items-start justify-between gap-4 border-b border-dashed border-paper/15 pb-5">
                  <div className="min-w-0">
                    <p className="label text-paper/45">{game.tag}</p>
                    <h3 className="mt-2 break-words font-pixel text-[40px] leading-[0.85] text-[var(--game)] sm:text-6xl md:text-7xl">{game.name}</h3>
                  </div>
                  <span className="grid size-12 shrink-0 place-items-center bg-[var(--game)] text-ink md:size-14">
                    <PixelIcon name={game.icon as IconName} className="size-6" />
                  </span>
                </div>

                <div className="mt-6">
                  <p className="text-lg font-medium tracking-tight">{t.joki.tasksLabel}</p>
                  <p className="label mt-1 text-paper/45">{t.joki.tasksHint}</p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {game.tasks.map((task, i) => {
                      const active = tasks.includes(i)
                      return (
                        <li key={task}>
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleTask(i)}
                            aria-pressed={active}
                            className={cn(
                              'flex min-h-12 w-full items-center gap-3 border px-3 py-3 text-left text-sm leading-snug transition-colors',
                              active ? 'border-[var(--game)] bg-[var(--game)] text-ink' : 'border-paper/15 hover:border-paper/40'
                            )}
                          >
                            <span
                              className={cn(
                                'grid size-4 shrink-0 place-items-center',
                                active ? 'bg-ink text-[var(--game)]' : 'border border-paper/30'
                              )}
                            >
                              {active && <PixelIcon name="check" className="size-2.5" />}
                            </span>
                            {task}
                          </motion.button>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <a
                  href={waLink(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-7 flex items-center justify-between gap-4 bg-[var(--game)] px-4 py-4 text-ink sm:px-5 md:mt-8 shadow-[4px_4px_0_#EEEDE7] transition-[transform,box-shadow] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[7px_7px_0_#EEEDE7] active:translate-x-0 active:translate-y-0 active:shadow-none md:px-6"
                >
                  <span className="label leading-relaxed">{t.joki.cta(game.name)}</span>
                  <PixelIcon
                    name="arrowUpRight"
                    className="size-3 shrink-0 transition-transform duration-300 [transition-timing-function:steps(4)] group-hover:rotate-45"
                  />
                </a>
                <p className="label mt-4 leading-relaxed text-paper/45">{t.joki.note}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function HudCorners() {
  const base = 'pointer-events-none absolute size-3 border-[var(--game)] transition-colors duration-500'
  return (
    <>
      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className={cn(base, '-left-1.5 -top-1.5 border-l-2 border-t-2')}
      />
      <span aria-hidden className={cn(base, '-right-1.5 -top-1.5 border-r-2 border-t-2')} />
      <span aria-hidden className={cn(base, '-bottom-1.5 -left-1.5 border-b-2 border-l-2')} />
      <span aria-hidden className={cn(base, '-bottom-1.5 -right-1.5 border-b-2 border-r-2')} />
    </>
  )
}
