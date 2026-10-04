import { youtubeThumb, type ChannelProject } from '../../data/projects'
import { useLang } from '../../i18n/context'
import PixelIcon from '../ui/PixelIcon'
import PixelReveal from '../ui/PixelReveal'
import { CardMeta, THUMB, ThumbBadge } from './shared'
import type { PlayRequest } from './VideoModal'

interface Props {
  project: ChannelProject
  number: number
  badge?: string
  onPlay: (video: PlayRequest) => void
}

/** YouTube channel squeezed into the standard card frame: banner, profile, stats, recent videos. */
export default function ChannelCard({ project, number, badge, onPlay }: Props) {
  const { t, lang } = useLang()
  const format = (n: number) => n.toLocaleString(lang === 'id' ? 'id-ID' : 'en-US')

  return (
    <div>
      <PixelReveal className={THUMB}>
        <div className="absolute inset-0 flex flex-col">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.work.visitChannel}: ${project.title}`}
            className="group relative block h-[36%] shrink-0 overflow-hidden"
            style={{ backgroundColor: project.color }}
          >
            <img
              src={project.banner}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </a>

          <div className="flex min-h-0 flex-1 flex-col justify-between gap-2 p-3 md:p-4">
            <div className="flex items-end gap-3">
              <img
                src={project.avatar}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="-mt-9 size-14 shrink-0 border-4 border-ink-800 bg-ink object-cover md:-mt-12 md:size-[4.5rem]"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium leading-tight text-paper md:text-lg">{project.title}</p>
                <p className="label truncate text-paper/50">{project.handle}</p>
              </div>
              <dl className="hidden shrink-0 gap-4 text-right sm:flex">
                {[
                  [format(project.subscribers), t.work.subscribers],
                  [format(project.videoCount), t.work.videos],
                ].map(([value, label]) => (
                  <div key={label} className="flex flex-col-reverse">
                    <dt className="label text-paper/45">{label}</dt>
                    <dd className="font-pixel text-2xl leading-none md:text-3xl" style={{ color: project.color }}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {project.videos.map((video) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => onPlay({ id: video.id, title: video.title })}
                  aria-label={`${t.work.play}: ${video.title}`}
                  className="group/v relative aspect-video overflow-hidden bg-ink"
                >
                  <img
                    src={youtubeThumb(video.id, 'mq')}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover opacity-75 transition-opacity group-hover/v:opacity-100"
                  />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-6 place-items-center bg-lime text-ink transition-transform group-hover/v:scale-110 md:size-7">
                      <PixelIcon name="play" className="size-2" />
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <ThumbBadge>{badge ?? 'YouTube'}</ThumbBadge>
      </PixelReveal>

      <CardMeta project={project} number={number} actionLabel={t.work.visitChannel} actionHref={project.url} />
    </div>
  )
}
