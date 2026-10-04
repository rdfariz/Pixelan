import { useMemo, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { bitmap, hash01 } from '../../lib/glyphs'

/** Bitmap wordmark built from interactive cells — hover leaves a lime trail. */
export default function PixelWordmark({ text = 'PIXELAN' }: { text?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })

  const { cells, cols } = useMemo(() => {
    const map = bitmap(text, 1)
    return { cols: map.cols, cells: map.cells.map((on, i) => ({ on, delay: hash01(i) * 0.9 })) }
  }, [text])

  return (
    <div
      ref={ref}
      role="img"
      aria-label={text}
      className="grid gap-[2px] md:gap-[3px]"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {cells.map((cell, i) =>
        cell.on ? (
          <motion.span
            key={i}
            className="pixel-cell aspect-square bg-paper"
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ duration: 0.01, delay: cell.delay }}
          />
        ) : (
          <span key={i} className="pixel-cell aspect-square bg-ink-800" />
        )
      )}
    </div>
  )
}
