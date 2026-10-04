import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { waLink } from '../../data/site'
import { useLang } from '../../i18n/context'
import { EASE, EASE_OUT, cn } from '../../lib/motion'
import PixelButton from '../ui/PixelButton'
import PixelIcon from '../ui/PixelIcon'
import { RevealLines, SectionLabel } from '../ui/Text'

export default function Faq() {
  const { t } = useLang()
  const [open, setOpen] = useState<number | null>(0)
  const baseId = useId()

  // FAQPage structured data, kept in sync with the visible (current-language) answers
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <section id="faq" className="bg-paper py-24 md:py-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <SectionLabel index="07" className="text-ink/60">
            {t.faq.label}
          </SectionLabel>
          <RevealLines
            key={t.faq.title[0]}
            lines={t.faq.title}
            className="mt-6 text-[clamp(2.75rem,6vw,6rem)] font-medium leading-[0.9] tracking-[-0.05em]"
          />
          <p className="mt-6 max-w-xs text-ink/60">{t.faq.body}</p>
          <PixelButton href={waLink(t.contact.message)} external variant="ghost" className="mt-8">
            {t.faq.ask}
          </PixelButton>
        </div>

        <ul className="border-t border-ink/15 lg:col-span-7 lg:col-start-6">
          {t.faq.items.map((item, i) => {
            const isOpen = open === i
            const panelId = `${baseId}-panel-${i}`
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: i * 0.05 }}
                className="border-b border-ink/15"
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="group flex w-full items-start gap-4 py-6 text-left md:gap-6 md:py-7"
                  >
                    <span className="label pt-1.5 text-ink/40">0{i + 1}</span>
                    <span className="flex-1 text-lg font-medium leading-snug tracking-tight transition-colors group-hover:text-accent md:text-2xl">
                      {item.q}
                    </span>
                    <span
                      className={cn(
                        'mt-0.5 grid size-8 shrink-0 place-items-center border transition-colors',
                        isOpen ? 'border-accent bg-accent text-paper' : 'border-ink/25 group-hover:border-ink'
                      )}
                    >
                      <PixelIcon
                        name="plus"
                        className={cn('size-3 transition-transform duration-300 [transition-timing-function:steps(4)]', isOpen && 'rotate-45')}
                      />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-7 pl-10 leading-relaxed text-ink/65 md:pl-14 md:text-lg">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
