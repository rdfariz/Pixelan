import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { clients, type Client } from '../../data/projects'
import { waLink } from '../../data/site'
import { useLang } from '../../i18n/context'
import { EASE_OUT, steps } from '../../lib/motion'
import PixelIcon from '../ui/PixelIcon'

const MIN_SLOTS = 5

export default function Clients() {
  const { t } = useLang()
  const openSlots = Math.max(MIN_SLOTS - clients.length, 1)

  return (
    <section aria-label="Clients" className="border-y border-ink/10 bg-paper py-10 md:py-14">
      <div className="container-x">
        <div className="label mb-6 flex justify-between text-ink/50">
          <span>({t.clients.label})</span>
          <span>{clients.length ? t.clients.count(clients.length) : t.clients.empty}</span>
        </div>

        <ul className="grid grid-cols-2 gap-2 lg:grid-cols-5">
          {clients.map((client, i) => (
            <Slot key={client.name} index={i}>
              <ClientLogo client={client} />
            </Slot>
          ))}
          {Array.from({ length: openSlots }, (_, i) => (
            <Slot
              key={`open-${i}`}
              index={clients.length + i}
              // keep the 2-column mobile grid even
              className={i === openSlots - 1 && (clients.length + openSlots) % 2 ? 'hidden lg:block' : ''}
            >
              <OpenSlot />
            </Slot>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Slot({ index, className = '', children }: { index: number; className?: string; children: ReactNode }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay: index * 0.06 }}
      className={className}
    >
      {children}
    </motion.li>
  )
}

function ClientLogo({ client }: { client: Client }) {
  const content = client.logo ? (
    <img src={client.logo} alt={client.name} loading="lazy" className="max-h-10 max-w-[70%] object-contain" />
  ) : (
    <span className="font-pixel text-3xl leading-none">{client.name}</span>
  )
  const className = 'grid aspect-[3/2] place-items-center border border-ink/15 bg-paper-50 px-4 text-center'

  return client.url ? (
    <a href={client.url} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  )
}

function OpenSlot() {
  const { t } = useLang()
  return (
    <motion.a
      href={waLink(t.clients.message)}
      target="_blank"
      rel="noopener noreferrer"
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="group relative grid aspect-[3/2] place-items-center overflow-hidden border border-dashed border-ink/30 text-ink/45 transition-colors duration-200 hover:border-accent hover:text-paper"
    >
      <motion.span
        aria-hidden
        className="absolute inset-0 bg-accent"
        variants={{ rest: { clipPath: 'inset(100% 0 0 0)' }, hover: { clipPath: 'inset(0% 0 0 0)' } }}
        transition={{ duration: 0.3, ease: steps(5) }}
      />
      <span className="relative flex flex-col items-center gap-3">
        <PixelIcon
          name="plus"
          className="size-4 transition-transform duration-300 [transition-timing-function:steps(4)] group-hover:rotate-90"
        />
        <span className="label">
          <span className="group-hover:hidden">{t.clients.slot}</span>
          <span className="hidden group-hover:inline">{t.clients.slotHover}</span>
        </span>
      </span>
    </motion.a>
  )
}
