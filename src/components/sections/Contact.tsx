import { motion } from 'framer-motion'
import { sectionIds, site, waLink } from '../../data/site'
import { useLang } from '../../i18n/context'
import { EASE_OUT, steps } from '../../lib/motion'
import { useClock } from '../../lib/useClock'
import PixelIcon from '../ui/PixelIcon'
import PixelWordmark from '../ui/PixelWordmark'
import { RevealLines, RollText, SectionLabel } from '../ui/Text'

export default function Contact() {
  const { t } = useLang()
  const time = useClock()

  return (
    <footer id="contact" className="overflow-hidden bg-ink pt-24 text-paper md:pt-40">
      <div className="container-x">
        <SectionLabel index="08" className="text-paper/60">
          {t.contact.label}
        </SectionLabel>

        <RevealLines
          key={t.contact.title[0]}
          lines={[
            t.contact.title[0],
            <>
              {t.contact.title[1]} <span className="font-pixel font-normal tracking-normal text-lime">{t.contact.title[2]}</span>
            </>,
          ]}
          className="mt-6 text-[clamp(3.25rem,11vw,12rem)] font-medium leading-[0.88] tracking-[-0.05em]"
        />

        <motion.a
          href={waLink(t.contact.message)}
          target="_blank"
          rel="noopener noreferrer"
          initial="rest"
          whileHover="hover"
          animate="rest"
          className="group relative mt-12 flex items-center justify-between gap-6 overflow-hidden border border-paper/25 px-5 py-6 md:mt-20 md:px-8 md:py-10"
        >
          <motion.span
            aria-hidden
            className="absolute inset-0 bg-lime"
            variants={{ rest: { clipPath: 'inset(0 100% 0 0)' }, hover: { clipPath: 'inset(0 0% 0 0)' } }}
            transition={{ duration: 0.4, ease: steps(8) }}
          />
          <span className="relative transition-colors duration-200 group-hover:text-ink">
            <span className="label block text-paper/50 transition-colors group-hover:text-ink/60">
              {t.contact.chat}
            </span>
            <span className="mt-2 block text-3xl font-medium tracking-tight sm:text-4xl md:text-6xl">
              {t.contact.hello} <span className="font-pixel font-normal">:)</span>
            </span>
          </span>
          <span className="relative grid size-14 shrink-0 place-items-center bg-lime text-ink transition-colors group-hover:bg-ink group-hover:text-lime md:size-24">
            <PixelIcon
              name="arrowUpRight"
              className="size-4 transition-transform duration-300 [transition-timing-function:steps(4)] group-hover:rotate-45 md:size-6"
            />
          </span>
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          className="mt-16 grid grid-cols-2 gap-10 border-t border-paper/15 pt-10 md:mt-24 md:grid-cols-4"
        >
          <div>
            <p className="label text-paper/40">{t.contact.studio}</p>
            <p className="mt-3 leading-relaxed">
              {site.name}
              <br />
              <span className="text-paper/50">{t.contact.location}</span>
            </p>
          </div>
          <div>
            <p className="label text-paper/40">{t.contact.time}</p>
            <p className="mt-3 leading-relaxed">
              {time} {site.timezoneLabel}
              <br />
              <span className="text-paper/50">{t.contact.hours}</span>
            </p>
          </div>
          <div className="col-span-2 md:col-span-2">
            <p className="label text-paper/40">{t.contact.navigate}</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {sectionIds.map((id) => (
                <li key={id}>
                  <a href={`#${id}`} className="group">
                    <RollText>{t.nav.links[id]}</RollText>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="mt-20 md:mt-32">
          <PixelWordmark />
        </div>

        <div className="label flex flex-col-reverse gap-4 py-8 text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <span suppressHydrationWarning>© {new Date().getFullYear()} {site.name}. {t.contact.rights}</span>
          <span className="hidden md:inline">{t.contact.built} ■</span>
          <a href="#top" className="group flex items-center gap-2 text-paper">
            <RollText>{t.contact.top}</RollText>
            <PixelIcon name="arrowUp" className="size-2.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
