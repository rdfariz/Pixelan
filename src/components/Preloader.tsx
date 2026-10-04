import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'
import { bitmap, hash01 } from '../lib/glyphs'
import { cn } from '../lib/motion'

interface Props {
  /** Fired when the pixels start dissolving — page entrance animations begin. */
  onReveal: () => void
  /** Fired once the loader is fully gone and can be unmounted. */
  onDone: () => void
}

const LOGO = bitmap('PIXELAN')
const CELLS = 16 * 24 // enough cover cells for any viewport (8 or 16 columns)
const BLOCKS = 24
const MIN_MS = 1400
const MAX_MS = 2200

/**
 * Pixel preloader. It is server-rendered, so it covers the page from the very first paint;
 * the wordmark assembles with pure CSS (no waiting on JS), then JS drives the counter to 100
 * once fonts and images are ready, and finally the cover dissolves pixel by pixel.
 */
export default function Preloader({ onReveal, onDone }: Props) {
  const [count, setCount] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const callbacks = useRef({ onReveal, onDone })
  callbacks.current = { onReveal, onDone }

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Timings are measured from navigation start: the CSS wordmark has been animating since first paint
    const remaining = () => Math.max(0, MIN_MS - performance.now())
    let value = 0
    let controls = animate(0, 82, {
      duration: Math.max(0.4, remaining() / 1000),
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setCount((value = v)),
    })
    const timers: number[] = []

    // Fonts are what change the look of the first screen; images below the fold load lazily
    const pageReady = Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, MAX_MS)),
    ])

    let cancelled = false
    pageReady.then(() => {
      if (cancelled) return
      const wait = remaining()
      timers.push(
        window.setTimeout(() => {
          controls.stop()
          // Continue smoothly from wherever the counter is — never jumps
          controls = animate(value, 100, {
            duration: reduce ? 0.2 : 0.45,
            ease: [0.65, 0, 0.35, 1],
            onUpdate: (v) => setCount(v),
            onComplete: () => {
              timers.push(
                window.setTimeout(() => {
                  setLeaving(true)
                  callbacks.current.onReveal()
                  timers.push(window.setTimeout(() => callbacks.current.onDone(), reduce ? 150 : 1000))
                }, 180)
              )
            },
          })
        }, wait)
      )
    })

    return () => {
      cancelled = true
      controls.stop()
      timers.forEach(clearTimeout)
    }
  }, [])

  const shown = Math.round(count)
  const filled = Math.round((count / 100) * BLOCKS)

  return (
    <div id="preloader" aria-hidden className={cn('preloader fixed inset-0 z-[100]', leaving && 'is-leaving')}>
      {/* Cover cells — dissolve in a pseudo-random order */}
      <div className="absolute inset-0 grid grid-cols-8 content-start md:grid-cols-[repeat(16,minmax(0,1fr))]">
        {Array.from({ length: CELLS }, (_, i) => (
          <span
            key={i}
            className="preloader-cell aspect-square bg-ink"
            style={{ transitionDelay: `${(hash01(i, 7) * 0.55).toFixed(3)}s` }}
          />
        ))}
      </div>

      <div className="preloader-ui absolute inset-0 flex flex-col justify-between p-5 text-paper md:p-10">
        <div className="label flex items-start justify-between text-paper/60">
          <span>Pixelan Studio</span>
          <span className="flex items-center gap-2">
            <span className="preloader-blink size-1.5 bg-lime" />
            Loading
          </span>
        </div>

        {/* Wordmark assembles pixel by pixel (CSS keyframes) */}
        <div
          className="mx-auto grid w-[min(78vw,640px)] gap-[2px] md:gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${LOGO.cols}, minmax(0, 1fr))` }}
        >
          {LOGO.cells.map((on, i) => (
            <span
              key={i}
              className={cn('aspect-square', on ? 'preloader-pixel bg-paper' : 'bg-paper/[0.04]')}
              style={on ? { animationDelay: `${(0.1 + hash01(i, 3) * 0.9).toFixed(3)}s` } : undefined}
            />
          ))}
        </div>

        <div>
          <div className="mb-4 flex gap-[3px] md:mb-6">
            {Array.from({ length: BLOCKS }, (_, i) => (
              <span
                key={i}
                className={cn('h-2 flex-1 transition-colors duration-150 md:h-2.5', i < filled ? 'bg-lime' : 'bg-ink-700')}
              />
            ))}
          </div>
          <div className="flex items-end justify-between gap-6">
            <span className="label max-w-[26ch] text-paper/50">
              Websites · Apps · AI Ads · Video · Joki · Mentoring
            </span>
            <span className="font-pixel text-[26vw] leading-[0.72] tabular-nums md:text-[13vw]">
              {String(shown).padStart(3, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
