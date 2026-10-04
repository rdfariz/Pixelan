import { useState, type CSSProperties } from 'react'
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
  const pickGame = (i: number) => {
    setGameIndex(i)
    setTasks([])
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

        <div className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-12 lg:gap-8">
          {/* Game select */}
          <div className="lg:col-span-5">
            <p className="label mb-4 flex items-center gap-2 text-paper/50">
              <span className="animate-pulse">▶</span> {t.joki.pick}
            </p>
            <div
              role="radiogroup"
              aria-label={t.joki.pick}
              className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-1 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {games.map((g, i) => {
                const active = i === gameIndex
                return (
                  <button
                    key={g.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => pickGame(i)}
                    style={{ '--c': g.color } as CSSProperties}
                    className={cn(
                      'group relative flex w-[68vw] shrink-0 snap-start items-center gap-4 border p-3 text-left transition-colors sm:w-[42vw] lg:w-auto',
                      active ? 'border-[var(--c)] bg-[color-mix(in_srgb,var(--c)_12%,transparent)]' : 'border-paper/15 hover:border-paper/40'
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-14 shrink-0 place-items-center transition-colors md:size-16',
                        active ? 'bg-[var(--c)] text-ink' : 'bg-paper/5 text-[var(--c)]'
                      )}
                    >
                      <PixelIcon name={g.icon as IconName} className="size-6 md:size-7" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-pixel text-3xl leading-none md:text-4xl">{g.name}</span>
                      <span className="label mt-1 block truncate text-paper/45">{g.tag}</span>
                    </span>
                    <span
                      className={cn(
                        'label shrink-0 px-1.5 py-0.5 transition-opacity',
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
          <div className="relative border border-[var(--game)] bg-ink/60 transition-colors duration-500 lg:col-span-7">
            <HudCorners />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={game.id}
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                animate={{ clipPath: 'inset(0 0 0% 0)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: steps(7) }}
                className="p-5 md:p-8"
              >
                <div className="flex items-start justify-between gap-4 border-b border-dashed border-paper/15 pb-5">
                  <div>
                    <p className="label text-paper/45">{game.tag}</p>
                    <h3 className="mt-2 font-pixel text-5xl leading-[0.85] text-[var(--game)] md:text-7xl">{game.name}</h3>
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
                              'flex w-full items-center gap-3 border px-3 py-3 text-left text-sm transition-colors',
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
                  className="group mt-8 flex items-center justify-between gap-4 bg-[var(--game)] px-5 py-4 text-ink shadow-[4px_4px_0_#EEEDE7] transition-[transform,box-shadow] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[7px_7px_0_#EEEDE7] active:translate-x-0 active:translate-y-0 active:shadow-none md:px-6"
                >
                  <span className="label">{t.joki.cta(game.name)}</span>
                  <PixelIcon
                    name="arrowUpRight"
                    className="size-3 transition-transform duration-300 [transition-timing-function:steps(4)] group-hover:rotate-45"
                  />
                </a>
                <p className="label mt-4 text-paper/45">{t.joki.note}</p>
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
