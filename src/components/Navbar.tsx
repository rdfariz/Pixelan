import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { sectionIds, site, waLink } from '../data/site'
import { useLang, type Lang } from '../i18n/context'
import { EASE, EASE_OUT, steps } from '../lib/motion'
import { useReady } from '../lib/ready'
import { lockScroll } from '../lib/scrollLock'
import { useClock } from '../lib/useClock'
import PixelButton from './ui/PixelButton'
import { RollText } from './ui/Text'
import Toggle from './ui/Toggle'

const langOptions: { value: Lang; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'id', label: 'ID' },
]

export default function Navbar() {
  const { t, lang, setLang } = useLang()
  const ready = useReady()
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(v > prev && v > 240)
  })

  useEffect(() => (open ? lockScroll() : undefined), [open])

  return (
    <>
      <motion.header
        initial={{ y: '-100%' }}
        animate={{ y: ready && (!hidden || open) ? '0%' : '-100%' }}
        transition={{ duration: 0.7, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference"
      >
        <div className="container-x flex h-16 items-center justify-between gap-4 md:h-20">
          <a href="#top" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
            <span className="font-pixel text-[32px] leading-none md:text-4xl">pixelan</span>
            <span className="label hidden opacity-60 sm:inline">studio</span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {sectionIds.map((id) => (
              <a key={id} href={`#${id}`} className="group label">
                <RollText>{t.nav.links[id]}</RollText>
              </a>
            ))}
            <Toggle id="lang-desktop" tone="blend" label="Language" value={lang} options={langOptions} onChange={setLang} />
            <a
              href={waLink(t.contact.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="group label flex items-center gap-2 border border-white px-4 py-2.5"
            >
              <span className="size-1.5 animate-pulse bg-white" />
              <RollText>{t.nav.talk}</RollText>
            </a>
          </nav>

          <div className="flex items-center gap-4 lg:hidden">
            <Toggle id="lang-mobile" tone="blend" label="Language" value={lang} options={langOptions} onChange={setLang} />
            <button
              onClick={() => setOpen((o) => !o)}
              className="label flex items-center gap-2 py-2"
              aria-expanded={open}
              aria-label={open ? t.nav.close : t.nav.menu}
            >
              <span className="flex flex-col gap-[3px]">
                <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 5 : 0 }} className="block h-[2px] w-4 bg-white" />
                <motion.span animate={{ opacity: open ? 0 : 1 }} className="block h-[2px] w-4 bg-white" />
                <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -5 : 0 }} className="block h-[2px] w-4 bg-white" />
              </span>
              <span className="hidden sm:inline">{open ? t.nav.close : t.nav.menu}</span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>{open && <MobileMenu onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  )
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const { t } = useLang()
  const time = useClock()

  return (
    <motion.div
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.5, ease: steps(8) }}
      className="fixed inset-0 z-40 flex flex-col bg-ink px-5 pb-8 pt-24 text-paper lg:hidden"
    >
      <nav className="flex flex-col">
        {sectionIds.map((id, i) => (
          <div key={id} className="overflow-hidden border-b border-paper/10">
            <motion.a
              href={`#${id}`}
              onClick={onClose}
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.25 + i * 0.06 }}
              className="flex items-baseline justify-between py-3"
            >
              <span className="font-pixel text-6xl leading-none">{t.nav.links[id]}</span>
              <span className="label text-paper/40">0{i + 1}</span>
            </motion.a>
          </div>
        ))}
      </nav>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-auto space-y-6">
        <PixelButton href={waLink(t.contact.message)} external variant="lime" className="w-full">
          {t.contact.chat}
        </PixelButton>
        <div className="label flex justify-between text-paper/50">
          <span>{site.name}</span>
          <span>
            {time} {site.timezoneLabel}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
