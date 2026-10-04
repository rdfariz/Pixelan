import { useEffect, useRef } from 'react'
import { cn } from '../../lib/motion'

interface Props {
  className?: string
  /** RGB triplet of the lit pixels */
  rgb?: string
}

/**
 * Interactive canvas grid: pixels light up under the pointer and fade out.
 * The render loop only runs while pixels are lit and the canvas is on screen.
 */
export default function PixelField({ className, rgb = '58,43,255' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dots = document.createElement('canvas')
    let w = 0
    let h = 0
    let cell = 30
    let cols = 0
    let rows = 0
    let cells = new Float32Array(0)
    let raf = 0
    let running = false
    let visible = true

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(dots, 0, 0, w, h)

      let active = false
      for (let i = 0; i < cells.length; i++) {
        const v = cells[i]
        if (v < 0.02) {
          cells[i] = 0
          continue
        }
        active = true
        ctx.fillStyle = `rgba(${rgb},${v})`
        ctx.fillRect((i % cols) * cell + 1, Math.floor(i / cols) * cell + 1, cell - 2, cell - 2)
        cells[i] = v * 0.93
      }

      running = active && visible
      if (running) raf = requestAnimationFrame(draw)
    }

    const start = () => {
      if (running || !visible) return
      running = true
      raf = requestAnimationFrame(draw)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      cell = w < 768 ? 24 : 32
      canvas.width = dots.width = Math.round(w * dpr)
      canvas.height = dots.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(w / cell)
      rows = Math.ceil(h / cell)
      cells = new Float32Array(cols * rows)

      const dctx = dots.getContext('2d')
      if (!dctx) return
      dctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dctx.fillStyle = 'rgba(12,12,14,0.14)'
      for (let y = 1; y < rows; y++) {
        for (let x = 1; x < cols; x++) dctx.fillRect(x * cell - 1, y * cell - 1, 2, 2)
      }
      draw()
    }

    const light = (x: number, y: number, v: number) => {
      if (x < 0 || y < 0 || x >= cols || y >= rows) return
      const i = y * cols + x
      cells[i] = Math.max(cells[i], v)
      start()
    }

    const onMove = (e: PointerEvent) => {
      if (!visible) return
      const rect = canvas.getBoundingClientRect()
      const x = Math.floor((e.clientX - rect.left) / cell)
      const y = Math.floor((e.clientY - rect.top) / cell)
      light(x, y, 1)
    }

    // Occasional ambient sparkle so the grid feels alive on touch devices too
    const sparkle = reduce
      ? 0
      : window.setInterval(() => {
          if (visible) light(Math.floor(Math.random() * cols), Math.floor(Math.random() * rows), 0.5)
        }, 700)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    io.observe(canvas)
    window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(sparkle)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [rgb])

  return <canvas ref={canvasRef} aria-hidden className={cn('pointer-events-none size-full', className)} />
}
