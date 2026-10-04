import { motion } from 'framer-motion'
import { youtubeThumb, type VideoProject } from '../../data/projects'
import { useLang } from '../../i18n/context'
import PixelReveal from '../ui/PixelReveal'
import { CardMeta, PlayBadge, THUMB, ThumbBadge } from './shared'
import type { PlayRequest } from './VideoModal'

interface Props {
  project: VideoProject
  number: number
  onPlay: (video: PlayRequest) => void
}

/** Single video. Vertical videos sit in a phone-style frame so every card keeps the same size. */
export default function VideoCard({ project, number, onPlay }: Props) {
  const { t } = useLang()
  const thumb = youtubeThumb(project.youtubeId, project.vertical ? 'oar' : 'maxres')

  return (
    <div>
      <motion.button
        type="button"
        initial="rest"
        whileHover="hover"
        animate="rest"
        onClick={() => onPlay({ id: project.youtubeId, title: project.title, vertical: project.vertical })}
        aria-label={`${t.work.play}: ${project.title}`}
        className="group block w-full text-left"
      >
        <PixelReveal className={THUMB}>
          {project.vertical ? (
            <>
              {/* Soft backdrop from the same frame */}
              <img
                src={youtubeThumb(project.youtubeId, 'mq')}
                alt=""
                aria-hidden
                decoding="async"
                className="absolute inset-0 size-full scale-125 object-cover opacity-60 blur-xl"
              />
              <div className="absolute inset-0 bg-ink/30" />
              <div className="absolute inset-y-[7%] left-1/2 aspect-[9/16] -translate-x-1/2 overflow-hidden rounded-[10px] border-4 border-ink shadow-[8px_8px_0_rgba(12,12,14,0.45)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2">
                <img src={thumb} alt={project.title} loading="lazy" decoding="async" className="size-full object-cover" />
              </div>
            </>
          ) : (
            <img
              src={thumb}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <ThumbBadge>{t.work.filters[project.category]}</ThumbBadge>
          <PlayBadge label={t.work.play} className="absolute bottom-4 left-4" />
        </PixelReveal>
      </motion.button>

      <CardMeta project={project} number={number} actionLabel={t.work.openYoutube} actionHref={project.url} />
    </div>
  )
}
