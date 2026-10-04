import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { waLink } from '../../data/site'
import { useLang, type Currency } from '../../i18n/context'
import { EASE_OUT, cn } from '../../lib/motion'
import PixelButton from '../ui/PixelButton'
import PixelIcon from '../ui/PixelIcon'
import { RevealLines, SectionLabel } from '../ui/Text'
import Toggle from '../ui/Toggle'

const currencyOptions: { value: Currency; label: string }[] = [
  { value: 'IDR', label: 'Rp' },
  { value: 'USD', label: '$' },
]

export default function Pricing() {
  const { t, currency, setCurrency } = useLang()
  // Selections are stored as indexes so they survive language & currency switches
  const [needs, setNeeds] = useState<number[]>([])
  const [budget, setBudget] = useState<number | null>(null)

  const budgets = t.pricing.budgets[currency]
  const toggleNeed = (i: number) =>
    setNeeds((current) => (current.includes(i) ? current.filter((n) => n !== i) : [...current, i].sort((a, b) => a - b)))

  const needLabels = needs.map((i) => t.pricing.needs[i])
  const budgetLabel = budget === null ? null : budget < budgets.length ? budgets[budget] : t.pricing.notSure
  const message = t.pricing.message(needLabels, budgetLabel ?? t.pricing.notSure)

  return (
    <section id="pricing" className="bg-paper py-24 md:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionLabel index="06" className="text-ink/60">
            {t.pricing.label}
          </SectionLabel>
          <RevealLines
            key={t.pricing.title[0]}
            lines={t.pricing.title}
            className="mt-6 text-[clamp(2.75rem,6.5vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.05em]"
          />

          <ul className="mt-10 border-t border-ink/15 md:mt-14">
            {t.pricing.points.map((point, i) => (
              <li key={i} className="flex gap-5 border-b border-ink/15 py-5">
                <span className="label pt-1 text-ink/40">0{i + 1}</span>
                <div>
                  <h3 className="text-lg font-medium tracking-tight">{point.title}</h3>
                  <p className="mt-1 text-ink/60">{point.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          className="lg:col-span-6 lg:col-start-7"
        >
          <div className="border border-ink bg-paper-50 shadow-[8px_8px_0_#0C0C0E] md:shadow-[12px_12px_0_#0C0C0E]">
            <div className="label flex items-center justify-between bg-ink px-4 py-3 text-paper">
              <span className="flex gap-1.5">
                <span className="size-2.5 bg-lime" />
                <span className="size-2.5 bg-paper/40" />
                <span className="size-2.5 bg-paper/40" />
              </span>
              <span>{t.pricing.card}</span>
            </div>

            <div className="p-5 md:p-10">
              <Step number="01" title={t.pricing.step1} hint={t.pricing.step1Hint}>
                {t.pricing.needs.map((need, i) => (
                  <Chip key={i} active={needs.includes(i)} onClick={() => toggleNeed(i)}>
                    {need}
                  </Chip>
                ))}
              </Step>

              <Step
                number="02"
                title={t.pricing.step2}
                hint={t.pricing.step2Hint}
                action={
                  <Toggle id="currency" label="Currency" value={currency} options={currencyOptions} onChange={setCurrency} />
                }
              >
                {[...budgets, t.pricing.notSure].map((option, i) => (
                  <Chip key={i} active={budget === i} onClick={() => setBudget(budget === i ? null : i)}>
                    {option}
                  </Chip>
                ))}
              </Step>

              <div className="mt-10 border-t border-dashed border-ink/25 pt-8">
                <p className="label text-ink/50">03 — {t.pricing.step3}</p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={`${needLabels.join()}-${budgetLabel}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="mt-3 min-h-[3rem] text-lg leading-snug tracking-tight md:text-xl"
                  >
                    {needLabels.length ? needLabels.join(' + ') : t.pricing.somethingNew}
                    <span className="text-ink/40"> · </span>
                    <span className="text-accent">{budgetLabel ?? t.pricing.flexible}</span>
                  </motion.p>
                </AnimatePresence>
                <PixelButton href={waLink(message)} external className="mt-6 w-full">
                  {t.pricing.cta}
                </PixelButton>
                <p className="label mt-4 text-center text-ink/45">{t.pricing.note}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

interface StepProps {
  number: string
  title: string
  hint: string
  action?: ReactNode
  children: ReactNode
}

function Step({ number, title, hint, action, children }: StepProps) {
  return (
    <div role="group" aria-label={title} className="mt-9 first:mt-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium tracking-tight">
            <span className="label mr-3 text-ink/40">{number}</span>
            {title}
          </h3>
          <p className="label mt-1 text-ink/45">{hint}</p>
        </div>
        {action}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      aria-pressed={active}
      className={cn(
        'flex items-center gap-2 border px-3 py-2.5 text-sm transition-colors duration-150 md:px-3.5',
        active ? 'border-ink bg-ink text-paper' : 'border-ink/25 hover:border-ink'
      )}
    >
      <span className={cn('grid size-3.5 shrink-0 place-items-center', active ? 'bg-lime text-ink' : 'border border-ink/30')}>
        {active && <PixelIcon name="check" className="size-2.5" />}
      </span>
      {children}
    </motion.button>
  )
}
