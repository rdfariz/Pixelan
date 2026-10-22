/* eslint-disable react-refresh/only-export-components -- an entry point, not hot-reloaded UI */
import { StrictMode, useEffect, useRef, useState, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { PAGES, SHORT } from './pages'

/**
 * ?page=3          one page at 1600×1200 (for the PNG screenshots)
 * ?pages=all|short every page of the full / short brochure, one per printed page (PDF)
 * (nothing)        viewer: every page, scaled to fit the screen — works on a phone too
 */
const params = new URLSearchParams(location.search)
const one = Number(params.get('page')) || 0
const set = params.get('pages')
const ids = set === 'short' ? SHORT : PAGES.map((p) => p.id)

function Sheet({ id, n, total }: { id: string; n: number; total: number }) {
  const page = PAGES.find((p) => p.id === id)!
  return <div className="sheet">{page.render({ n, total })}</div>
}

/** A page scaled to its frame's width, so the 1600px layout stays intact at any screen size. */
function Scaled({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 1600))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={ref} className="frame">
      <div style={{ transform: `scale(${scale})`, transformOrigin: '0 0', width: 1600 }}>{children}</div>
    </div>
  )
}

function App() {
  if (one) return <Sheet id={ids[one - 1]} n={one} total={ids.length} />
  if (set) return <>{ids.map((id, i) => <Sheet key={id} id={id} n={i + 1} total={ids.length} />)}</>
  return (
    <div className="viewer">
      {ids.map((id, i) => (
        <Scaled key={id}>
          <Sheet id={id} n={i + 1} total={ids.length} />
        </Scaled>
      ))}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Lets the render script wait until the web fonts have loaded.
document.fonts.ready.then(() => document.documentElement.setAttribute('data-ready', ''))
