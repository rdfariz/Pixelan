import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projects } from '../../data/projects'
import { waLink } from '../../data/site'
import { useLang } from '../../i18n/context'
import { EASE_OUT } from '../../lib/motion'
import PixelButton from '../ui/PixelButton'
import { RevealLines, SectionLabel } from '../ui/Text'
import ChannelCard from '../work/ChannelCard'
import VideoModal, { type PlayRequest } from '../work/VideoModal'
import WebsiteCard from '../work/WebsiteCard'

const alumni = projects.filter((p) => p.category === 'mentoring')

/** Work from people we've mentored — shown as dark "profile tiles" on a light section. */
export default function Alumni() {
  const { t } = useLang()
  const [playing, setPlaying] = useState<PlayRequest | null>(null)
  const closePlayer = useCallback(() => setPlaying(null), [])
  const mentor = t.services.list.find((s) => s.id === 'mentor')

  if (alumni.length === 0) return null

  return (
    <section id="alumni" className="bg-paper py-24 md:py-36">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <SectionLabel index="03" className="text-ink/60">
            {t.alumni.label}
          </SectionLabel>
          <RevealLines
            key={t.alumni.title[0]}
            lines={t.alumni.title}
            className="mt-6 text-[clamp(2.75rem,6vw,6rem)] font-medium leading-[0.9] tracking-[-0.05em]"
          />
          <p className="mt-6 max-w-sm text-ink/60">{t.alumni.body}</p>
          {mentor && (
            <PixelButton href={waLink(mentor.message)} external className="mt-8">
              {t.alumni.cta}
            </PixelButton>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
          {alumni.map((project, i) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: i * 0.1 }}
              className="bg-ink p-3 text-paper shadow-[8px_8px_0_#3A2BFF] md:p-4"
            >
              {project.kind === 'website' && <WebsiteCard project={project} number={i + 1} badge={t.work.alumniBadge} />}
              {project.kind === 'channel' && (
                <ChannelCard project={project} number={i + 1} badge={t.work.alumniBadge} onPlay={setPlaying} />
              )}
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>{playing && <VideoModal video={playing} onClose={closePlayer} />}</AnimatePresence>
    </section>
  )
}
