import { motion } from 'framer-motion'
import { waLink } from '../../data/site'
import { useLang } from '../../i18n/context'
import { EASE_OUT, cn } from '../../lib/motion'
import PixelButton from '../ui/PixelButton'
import PixelIcon from '../ui/PixelIcon'
import { RevealLines, SectionLabel } from '../ui/Text'

const themes = [
  { card: 'border-ink bg-paper-50 text-ink lg:hover:shadow-[8px_8px_0_#0C0C0E]', dot: 'bg-accent', badge: 'bg-accent text-paper', muted: 'text-ink/60', line: 'border-ink/15', button: 'primary' },
  { card: 'border-accent bg-accent text-paper lg:hover:shadow-[8px_8px_0_#0C0C0E]', dot: 'bg-lime', badge: 'bg-paper text-accent', muted: 'text-paper/75', line: 'border-paper/25', button: 'lime' },
  { card: 'border-ink bg-ink text-paper lg:hover:shadow-[8px_8px_0_#3A2BFF]', dot: 'bg-lime', badge: 'bg-lime text-ink', muted: 'text-paper/65', line: 'border-paper/15', button: 'lime' },
] as const

export default function Services() {
  const { t } = useLang()

  return (
    <section id="services" className="bg-paper py-24 md:py-36">
      <div className="container-x">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel index="01" className="text-ink/60">
              {t.services.label}
            </SectionLabel>
            <RevealLines
              key={t.services.title[0]}
              lines={t.services.title}
              className="mt-6 text-[clamp(2.75rem,7.5vw,7.5rem)] font-medium leading-[0.9] tracking-[-0.05em]"
            />
          </div>
          <p className="max-w-sm text-ink/60 md:col-span-4 md:justify-self-end">{t.services.body}</p>
        </div>

        <div className="mt-14 grid gap-4 md:mt-20 lg:grid-cols-3 lg:gap-5">
          {t.services.list.map((service, i) => {
            const theme = themes[i % themes.length]
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: i * 0.1 }}
                className={cn(
                  'flex flex-col border p-6 transition-[transform,box-shadow] duration-300 md:p-8 lg:hover:-translate-y-1',
                  theme.card
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className={cn('label', theme.muted)}>0{i + 1}</span>
                  <span className={cn('label px-2 py-1', theme.badge)}>{service.subtitle}</span>
                </div>

                <h3 className="mt-10 font-pixel text-[clamp(4.5rem,9vw,7rem)] leading-[0.75] md:mt-14">
                  {service.title}
                  <span className={i === 0 ? 'text-accent' : 'text-lime'}>.</span>
                </h3>

                <p className={cn('mt-6 leading-relaxed', theme.muted)}>{service.description}</p>

                <ul className={cn('mt-6 border-t', theme.line)}>
                  {service.items.map((item) => (
                    <li key={item} className={cn('flex items-center gap-3 border-b py-3 text-[15px]', theme.line)}>
                      <span className={cn('size-1.5 shrink-0', theme.dot)} />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col gap-3 lg:mt-auto lg:pt-10">
                  <PixelButton href={waLink(service.message)} external variant={theme.button} className="w-full">
                    {service.cta}
                  </PixelButton>
                  {service.id === 'mentor' && (
                    <a
                      href="#alumni"
                      className="label flex items-center justify-between border border-paper/25 px-5 py-4 text-paper/80 transition-colors hover:border-lime hover:text-lime md:px-6"
                    >
                      {t.services.alumni}
                      <PixelIcon name="arrowDown" className="size-3" />
                    </a>
                  )}
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
