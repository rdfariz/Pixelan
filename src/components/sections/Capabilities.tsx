import { motion } from 'framer-motion'
import { waLink } from '../../data/site'
import { useLang } from '../../i18n/context'
import { EASE_OUT } from '../../lib/motion'
import PixelButton from '../ui/PixelButton'
import { RevealLines, SectionLabel } from '../ui/Text'

/** "What we handle" — a clean index of everything the studio can take on, instead of a showcase. */
export default function Capabilities() {
  const { t } = useLang()
  const c = t.capabilities

  return (
    <section id="capabilities" className="bg-ink py-24 text-paper md:py-36">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel index="02" className="text-paper/60">
              {c.label}
            </SectionLabel>
            <RevealLines
              key={c.title[0]}
              lines={c.title}
              className="mt-6 text-[clamp(2.75rem,7.5vw,7.5rem)] font-medium leading-[0.9] tracking-[-0.05em]"
            />
          </div>
          <p className="max-w-sm text-paper/60 md:col-span-4 md:justify-self-end">{c.body}</p>
        </div>

        <ul className="mt-14 border-t border-paper/15 md:mt-20">
          {c.items.map((item, i) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: (i % 4) * 0.06 }}
              className="group grid grid-cols-[auto_1fr] items-baseline gap-x-4 border-b border-paper/15 py-5 transition-colors duration-300 hover:bg-paper/[0.03] md:grid-cols-[4rem_1fr_minmax(0,22rem)] md:gap-x-6 md:py-7"
            >
              <span className="label text-paper/40 transition-colors group-hover:text-lime">0{i + 1}</span>
              <h3 className="text-[clamp(1.75rem,4vw,3.5rem)] font-medium leading-[1] tracking-[-0.04em] transition-transform duration-500 group-hover:translate-x-2 motion-reduce:transition-none">
                {item.title}
              </h3>
              <p className="col-start-2 mt-2 text-[15px] leading-snug text-paper/55 md:col-start-auto md:mt-0 md:justify-self-end md:text-right">
                {item.note}
              </p>
            </motion.li>
          ))}
        </ul>

        <div className="mt-12 flex md:mt-16 md:justify-end">
          <PixelButton href={waLink(c.message)} external variant="lime">
            {c.cta}
          </PixelButton>
        </div>
      </div>
    </section>
  )
}
