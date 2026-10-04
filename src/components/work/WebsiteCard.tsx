import type { WebsiteProject } from '../../data/projects'
import { useLang } from '../../i18n/context'
import PixelReveal from '../ui/PixelReveal'
import { CardMeta, THUMB, ThumbBadge } from './shared'

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'

/** Thumbnail = brand-coloured backdrop + desktop browser frame + phone peeking from below. */
export default function WebsiteCard({ project, number, badge }: { project: WebsiteProject; number: number; badge?: string }) {
  const { t } = useLang()

  return (
    <div className="group">
      <a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`${t.work.visit}: ${project.title}`}>
        <PixelReveal className={THUMB}>
          <div className="absolute inset-0" style={{ backgroundColor: project.color }} />
          <div
            aria-hidden
            className="absolute inset-0 opacity-25 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"
          />
          <ThumbBadge>{badge ?? t.work.filters.website}</ThumbBadge>

          {/* Desktop */}
          <div
            className={`absolute left-[7%] top-[15%] w-[78%] bg-ink shadow-[10px_10px_0_rgba(12,12,14,0.3)] transition-transform duration-700 ${EASE} group-hover:-translate-y-2`}
          >
            <div className="flex items-center gap-1 px-2 py-1.5 md:gap-1.5 md:px-3 md:py-2">
              <span className="size-1 bg-lime md:size-1.5" />
              <span className="size-1 bg-paper/30 md:size-1.5" />
              <span className="size-1 bg-paper/30 md:size-1.5" />
              <span className="ml-2 truncate font-mono text-[8px] uppercase tracking-wider text-paper/60 md:text-[10px]">
                {project.domain}
              </span>
            </div>
            <img
              src={project.image}
              alt={`${project.title} — desktop`}
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] w-full object-cover object-top"
            />
          </div>

          {/* Phone */}
          {project.mobileImage && (
            <div
              className={`absolute -bottom-[8%] right-[5%] w-[23%] overflow-hidden rounded-[8px] border-[3px] border-ink bg-ink shadow-[8px_8px_0_rgba(12,12,14,0.3)] transition-transform delay-75 duration-700 md:rounded-[14px] md:border-4 ${EASE} group-hover:-translate-y-[8%]`}
            >
              <img
                src={project.mobileImage}
                alt={`${project.title} — mobile`}
                loading="lazy"
                decoding="async"
                className="aspect-[390/844] w-full object-cover object-top"
              />
            </div>
          )}
        </PixelReveal>
      </a>

      <CardMeta project={project} number={number} actionLabel={t.work.visit} actionHref={project.url} />
    </div>
  )
}
