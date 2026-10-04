import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../../i18n/context'
import { lockScroll } from '../../lib/scrollLock'
import { cn, steps } from '../../lib/motion'
import PixelIcon from '../ui/PixelIcon'

export interface PlayRequest {
  id: string
  title: string
  vertical?: boolean
  /** Playlist id — lets YouTube continue to the next video */
  list?: string
  index?: number
}

/** Lightbox player. The YouTube iframe only loads once a video is opened. */
export default function VideoModal({ video, onClose }: { video: PlayRequest; onClose: () => void }) {
  const { t } = useLang()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const unlock = lockScroll()
    return () => {
      window.removeEventListener('keydown', onKey)
      unlock()
    }
  }, [onClose])

  const params = new URLSearchParams({ autoplay: '1', rel: '0', playsinline: '1' })
  if (video.list) {
    params.set('list', video.list)
    params.set('index', String((video.index ?? 0) + 1))
  }

  const width = video.vertical
    ? 'w-[min(92vw,calc(78svh*9/16))]'
    : 'w-[min(92vw,calc(78svh*16/9),1280px)]'

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-md"
    >
      <div className={width} onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between gap-4 text-paper">
          <p className="truncate text-sm md:text-base">{video.title}</p>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="label flex shrink-0 items-center gap-2 border border-paper/30 px-3 py-2 transition-colors hover:border-lime hover:bg-lime hover:text-ink"
          >
            {t.work.close}
            <PixelIcon name="close" className="size-2.5" />
          </button>
        </div>
        <motion.div
          initial={{ clipPath: 'inset(50% 0 50% 0)' }}
          animate={{ clipPath: 'inset(0% 0 0% 0)' }}
          transition={{ duration: 0.4, ease: steps(8) }}
          className={cn('w-full bg-black', video.vertical ? 'aspect-[9/16]' : 'aspect-video')}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?${params}`}
            title={video.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="size-full"
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
