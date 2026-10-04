import { motion } from 'framer-motion'
import { waLink } from '../../data/site'
import { useLang } from '../../i18n/context'
import { EASE_OUT } from '../../lib/motion'
import PixelButton from '../ui/PixelButton'
import PixelIcon from '../ui/PixelIcon'
import { RevealLines, SectionLabel } from '../ui/Text'

/** 12×12 pixel portrait — a friendly placeholder until a real photo is added. */
const AVATAR = [
  '....####....',
  '..########..',
  '.##########.',
  '.##########.',
  '.#oooooooo#.',
  '.oo.oooo.oo.',
  '.oooooooooo.',
  '.ooo.oo.ooo.',
  '..oo....oo..',
  '...oooooo...',
  '..########..',
  '.##########.',
]

function PixelPortrait() {
  return (
    <svg viewBox="0 0 12 12" className="size-full" shapeRendering="crispEdges" aria-hidden>
      {AVATAR.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === '.' ? null : (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={c === '#' ? '#0C0C0E' : '#F7F6F2'} />
          )
        )
      )}
    </svg>
  )
}

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -10% 0px' },
  transition: { duration: 0.9, ease: EASE_OUT, delay },
})

/** 1-on-1 sessions with Rex — calm palette, same pixel language. */
export default function Psychology() {
  const { t } = useLang()
  const p = t.psych
  const href = waLink(p.message)

  return (
    <section id="psychology" className="relative overflow-hidden bg-[#E7E4FF] py-24 text-ink md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#3A2BFF_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
      />

      <div className="container-x relative grid gap-10 md:gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Intro */}
        <div className="lg:col-span-5">
          <SectionLabel index="04" className="text-ink/60">
            {p.label}
          </SectionLabel>
          <RevealLines
            key={p.title[0]}
            lines={[p.title[0], <span className="font-pixel font-normal tracking-normal text-accent">{p.title[1]}</span>]}
            className="mt-6 text-[clamp(2.75rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.045em]"
          />
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70 md:text-lg">{p.body}</p>

          <div className="mt-8 border-t border-ink/15 pt-6">
            <p className="label text-ink/50">{p.promisesLabel}</p>
            <ul className="mt-4 space-y-3">
              {p.promises.map((promise) => (
                <li key={promise} className="flex items-start gap-3 text-[15px] leading-snug md:text-base">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center bg-accent text-paper">
                    <PixelIcon name="check" className="size-2.5" />
                  </span>
                  {promise}
                </li>
              ))}
            </ul>
          </div>

          <PixelButton href={href} external className="mt-10 w-full sm:w-auto">
            {p.cta}
          </PixelButton>
        </div>

        {/* Mentor card + how it works */}
        <div className="flex flex-col gap-5 lg:col-span-7">
          <motion.article {...reveal()} className="bg-ink p-5 text-paper shadow-[8px_8px_0_#3A2BFF] md:p-8 md:shadow-[10px_10px_0_#3A2BFF]">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="size-20 shrink-0 bg-lime p-1.5 sm:size-24 md:size-32 md:p-2">
                <PixelPortrait />
              </div>
              <div className="min-w-0">
                <p className="label text-paper/50">{p.role}</p>
                <h3 className="mt-1 font-pixel text-6xl leading-[0.8] text-lime sm:text-7xl md:text-8xl">{p.name}</h3>
              </div>
            </div>
            <p className="mt-5 text-lg leading-snug text-paper/85 md:mt-6 md:text-2xl">{p.quote}</p>

            <div className="mt-6 border-t border-paper/15 pt-5 md:mt-8 md:pt-6">
              <p className="label text-paper/50">{p.topicsLabel}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.topics.map((topic) => (
                  <li key={topic} className="flex items-center gap-2 border border-paper/15 px-3 py-2 text-sm md:text-[15px]">
                    <span className="size-1.5 shrink-0 bg-lime" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>

          <motion.div {...reveal(0.1)} className="border border-ink/15 bg-paper-50/80 p-5 md:p-8">
            <p className="label text-ink/50">{p.stepsLabel}</p>
            <ol className="relative mt-5 grid gap-5 md:grid-cols-3">
              {/* Connector line on mobile */}
              <span aria-hidden className="absolute bottom-5 left-5 top-5 w-px bg-ink/15 md:hidden" />
              {p.steps.map((step, i) => (
                <li key={step.title} className="relative flex gap-4 md:flex-col md:gap-3">
                  <span className="grid size-10 shrink-0 place-items-center bg-accent font-pixel text-2xl leading-none text-paper">
                    {i + 1}
                  </span>
                  <div className="pt-1 md:pt-0">
                    <h4 className="font-medium tracking-tight">{step.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-ink/60">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Second chance to book once the visitor has read how it works (mobile) */}
            <PixelButton href={href} external className="mt-7 w-full lg:hidden">
              {p.cta}
            </PixelButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
