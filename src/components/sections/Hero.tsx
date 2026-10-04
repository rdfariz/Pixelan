import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projects } from '../../data/projects'
import { waLink } from '../../data/site'
import { useLang } from '../../i18n/context'
import { EASE_OUT, steps } from '../../lib/motion'
import { useReady } from '../../lib/ready'
import PixelButton from '../ui/PixelButton'
import PixelField from '../ui/PixelField'
import { RevealLines } from '../ui/Text'

export default function Hero() {
  const { t } = useLang()
  const ready = useReady()
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 0.9, ease: EASE_OUT, delay },
  })

  return (
    <section id="top" className="relative flex min-h-svh flex-col overflow-hidden bg-paper text-ink">
      <PixelField className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_45%,transparent)]" />

      <div className="container-x relative flex flex-1 flex-col justify-center pb-10 pt-28 md:pb-14 md:pt-32">
        <motion.p {...fade(0.1)} className="label flex w-fit items-center gap-2 bg-ink px-3 py-2 text-paper">
          <span className="size-1.5 bg-lime" />
          {t.hero.badge}
        </motion.p>

        <RevealLines
          key={t.hero.title[0]}
          as="h1"
          show={ready}
          delay={0.15}
          className="mt-8 text-[clamp(2.6rem,10vw,11.5rem)] font-medium leading-[0.9] tracking-[-0.05em] md:mt-10"
          lines={[t.hero.title[0], <RotatingWord words={t.hero.words} />, t.hero.title[1]]}
        />

        <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-12 lg:items-end">
          <motion.p {...fade(0.5)} className="max-w-xl text-base leading-relaxed text-ink/70 md:text-lg lg:col-span-5">
            {t.hero.body}
          </motion.p>

          <motion.div {...fade(0.6)} className="flex flex-col gap-3 sm:flex-row lg:col-span-4">
            <PixelButton href={waLink(t.services.list[0].message)} external>
              {t.hero.ctaProject}
            </PixelButton>
            <PixelButton href="#work" variant="ghost" icon="arrowDown">
              {t.hero.ctaWork}
            </PixelButton>
          </motion.div>

          <motion.dl {...fade(0.7)} className="grid grid-cols-3 gap-4 border-t border-ink/15 pt-5 lg:col-span-3 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            {t.hero.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="mt-2 text-xs leading-snug text-ink/55">{stat.label}</dt>
                <dd className="font-pixel text-4xl leading-none">
                  {stat.value === 'projects' ? String(projects.length).padStart(2, '0') : stat.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>

      <ServiceBand words={t.hero.marquee} />
    </section>
  )
}

function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => i + 1), 2400)
    return () => clearInterval(id)
  }, [])

  const word = words[index % words.length]

  return (
    <motion.span
      layout
      transition={{ layout: { duration: 0.45, ease: steps(6) } }}
      className="relative inline-flex overflow-hidden bg-accent px-[0.12em] align-bottom font-pixel text-[1.06em] font-normal leading-[0.92] tracking-normal text-paper"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word}
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.45, ease: steps(6) }}
          className="block whitespace-nowrap"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}

/** Running band listing every service — the "all-in-one" signal. */
function ServiceBand({ words }: { words: string[] }) {
  return (
    <div className="relative overflow-hidden border-y border-ink bg-accent py-4 text-paper md:py-5" aria-hidden>
      <motion.div
        className="flex w-max items-center will-change-transform"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
      >
        {[...words, ...words, ...words, ...words].map((word, i) => (
          <span key={i} className="flex items-center">
            <span className="whitespace-nowrap px-5 font-pixel text-3xl leading-none md:px-8 md:text-5xl">{word}</span>
            <span className="size-2 bg-lime md:size-2.5" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}
