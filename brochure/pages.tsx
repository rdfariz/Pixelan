/**
 * Brosur Pixelan Studio — tentang studionya saja (tanpa portofolio).
 * Isi diambil dari teks website (`src/data/copy.ts`, bahasa Indonesia);
 * warna, huruf, dan wordmark pixel sama dengan website.
 */
/* eslint-disable react-refresh/only-export-components -- printed pages, not hot-reloaded UI */
import type { CSSProperties, ReactNode } from 'react'
import QRCode from 'qrcode'
import { copy } from '../src/data/copy'
import { site } from '../src/data/site'
import { bitmap } from '../src/lib/glyphs'

/** "1-on-1" never breaks across lines (non-breaking hyphens), anywhere in the copy. */
const unbreak = <T,>(v: T): T =>
  typeof v === 'string' ? (v.replace(/1-on-1/g, '1‑on‑1') as T)
  : Array.isArray(v) ? (v.map(unbreak) as T)
  : v && typeof v === 'object' ? (Object.fromEntries(Object.entries(v).map(([k, x]) => [k, unbreak(x)])) as T)
  : v
const t = unbreak(copy.id)

const C = {
  ink: '#0C0C0E',
  ink800: '#17171B',
  ink700: '#232329',
  paper: '#EEEDE7',
  paper50: '#F7F6F2',
  accent: '#3A2BFF',
  lime: '#C8FF2E',
  line: 'rgba(12,12,14,0.14)',
  muted: 'rgba(12,12,14,0.58)',
}
/**
 * Print type with more character than the site's Geist: Bricolage Grotesque for
 * titles, Manrope for text, Space Mono for labels; Jersey 10 stays for the pixel numbers.
 */
const F = {
  display: '"Bricolage Grotesque", system-ui, sans-serif',
  sans: 'Manrope, system-ui, sans-serif',
  mono: '"Space Mono", ui-monospace, monospace',
  pixel: '"Jersey 10", ui-monospace, monospace',
}
const PAD = 88
const FOOT = 96
const DOMAIN = site.url.replace(/^https?:\/\//, '').replace(/\/$/, '')

// The brochure points to the website only (no phone number): these lines of the site copy name WhatsApp.
t.pricing.cta = `Minta penawaran di ${DOMAIN}`
t.psych.steps[0] = { title: 'Sapa kami', description: `Lewat ${DOMAIN} — ceritakan sedikit apa yang sedang kamu pikirkan, tanpa tekanan.` }
t.joki.points = t.joki.points.map((p) => (/whatsapp/i.test(p) ? 'Kabar progres rutin' : p))

export interface PageProps {
  n: number
  total: number
}

/* ------------------------------------------------------------------ parts */

/** The PIXELAN bitmap wordmark, as on the site's footer and preloader. */
function PixelMark({ text = 'PIXELAN', cell, gap, on, off = 'transparent' }: { text?: string; cell: number; gap: number; on: string; off?: string }) {
  const { cells, cols } = bitmap(text)
  return (
    <div role="img" aria-label={text} style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gap }}>
      {cells.map((lit, i) => (
        <span key={i} style={{ width: cell, height: cell, background: lit ? on : off }} />
      ))}
    </div>
  )
}

/** Small mono label, e.g. "■ (02) Layanan" — the site's SectionLabel. */
function Label({ index, children, color = C.muted }: { index?: string; children: ReactNode; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: F.mono, fontSize: 18, letterSpacing: '0.14em', textTransform: 'uppercase', color }}>
      <span style={{ width: 9, height: 9, background: 'currentColor' }} />
      {index && <span style={{ opacity: 0.5 }}>({index})</span>}
      <span>{children}</span>
    </div>
  )
}

/** A big two-line title: the second line quieter, like the site's section titles. */
function Title({ lines, size = 86, color = C.ink, quiet = 'rgba(12,12,14,0.42)', align = 'left' }: { lines: string[]; size?: number; color?: string; quiet?: string; align?: CSSProperties['textAlign'] }) {
  return (
    <h1 style={{ margin: 0, fontFamily: F.display, fontSize: size, fontWeight: 600, lineHeight: 0.96, letterSpacing: '-0.03em', textAlign: align }}>
      {lines.map((l, i) => (
        <span key={l} style={{ display: 'block', color: i === lines.length - 1 && lines.length > 1 ? quiet : color }}>
          {l}
        </span>
      ))}
    </h1>
  )
}

const Box = ({ children, style, dark = false }: { children: ReactNode; style?: CSSProperties; dark?: boolean }) => (
  <div style={{ background: dark ? C.ink : C.paper50, color: dark ? C.paper : C.ink, border: `1.5px solid ${dark ? C.ink : C.line}`, padding: '30px 32px', ...style }}>{children}</div>
)

/** A square bullet list. */
function Bullets({ items, color = C.accent, size = 22, textColor }: { items: string[]; color?: string; size?: number; textColor?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((it) => (
        <div key={it} style={{ display: 'flex', gap: 14, alignItems: 'baseline', fontSize: size, lineHeight: 1.35, color: textColor }}>
          <span style={{ width: 9, height: 9, background: color, flexShrink: 0, transform: 'translateY(-3px)' }} />
          {it}
        </div>
      ))}
    </div>
  )
}

/** Faint pixel grid for the dark pages. */
const GRID = `linear-gradient(${C.ink800} 1px, transparent 1px), linear-gradient(90deg, ${C.ink800} 1px, transparent 1px)`

function Footer({ n, total, dark = false }: PageProps & { dark?: boolean }) {
  const fg = dark ? 'rgba(238,237,231,0.6)' : C.muted
  return (
    <div style={{ position: 'absolute', left: PAD, right: PAD, bottom: 0, height: FOOT, borderTop: `1.5px solid ${dark ? 'rgba(238,237,231,0.16)' : C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: F.mono, fontSize: 17, letterSpacing: '0.14em', textTransform: 'uppercase', color: fg }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <PixelMark cell={4} gap={1} on={dark ? C.lime : C.ink} />
        <span>Pixelan Studio</span>
      </div>
      <div style={{ display: 'flex', gap: 32 }}>
        <span>{DOMAIN}</span>
        <span style={{ color: dark ? C.paper : C.ink }}>
          {String(n).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

/** An inner page: label, title, optional lead, then the body fills what is left (titles never collide with it). */
function Page({ n, total, index, label, title, lead, children }: PageProps & { index: string; label: string; title: string[]; lead?: string; children: ReactNode }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.paper, fontFamily: F.sans, color: C.ink }}>
      <div style={{ position: 'absolute', left: PAD, right: PAD, top: PAD - 16, bottom: FOOT + 40, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 60 }}>
          <div>
            <Label index={index}>{label}</Label>
            <div style={{ marginTop: 26 }}>
              <Title lines={title} />
            </div>
          </div>
          {lead && <p style={{ margin: 0, maxWidth: 520, fontSize: 23, lineHeight: 1.45, color: C.muted }}>{lead}</p>}
        </div>
        <div style={{ flex: 1, minHeight: 0, marginTop: 48, position: 'relative' }}>{children}</div>
      </div>
      <Footer n={n} total={total} />
    </div>
  )
}

/* ------------------------------------------------------------------ 01 */

function Cover() {
  const pillars = t.services.list.map((s) => [s.title, s.subtitle] as const)
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.ink, color: C.paper, fontFamily: F.sans }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: GRID, backgroundSize: '40px 40px', opacity: 0.55 }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, transparent 0%, ${C.ink} 72%)` }} />
      <div style={{ position: 'absolute', inset: `0 ${PAD}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <PixelMark cell={22} gap={4} on={C.lime} off={C.ink800} />
        <div style={{ marginTop: 56 }}>
          <Label color={C.lime}>{t.hero.badge}</Label>
        </div>
        <div style={{ marginTop: 26 }}>
          <Title lines={['Kami bikin yang berkesan.']} size={92} color={C.paper} align="center" />
        </div>
        <p style={{ margin: '28px 0 0', maxWidth: 900, fontSize: 26, lineHeight: 1.5, color: 'rgba(238,237,231,0.7)' }}>{t.hero.body}</p>
        <div style={{ display: 'flex', gap: 16, marginTop: 48 }}>
          {pillars.map(([title, sub], i) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', border: '1.5px solid rgba(238,237,231,0.2)', background: C.ink800 }}>
              <span style={{ fontFamily: F.pixel, fontSize: 34, lineHeight: 1, color: C.lime }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 22, fontWeight: 600 }}>{title}</span>
              <span style={{ fontSize: 20, color: 'rgba(238,237,231,0.6)' }}>{sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ 02 */

function About({ n, total }: PageProps) {
  const stats: [string, string, boolean][] = [
    ['5-in-1', 'Layanan, satu studio', true],
    ['1–2 mgg', 'Rata-rata website selesai', false],
    ['Gratis', 'Konsultasi pertama', false],
    ['ID · EN', 'Bahasa Indonesia & English', false],
  ]
  return (
    <Page n={n} total={total} index="01" label="Tentang kami" title={['Satu studio kecil,', 'banyak masalah beres.']}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, height: '100%' }}>
        <p style={{ margin: 0, fontSize: 30, lineHeight: 1.45, maxWidth: 1180, letterSpacing: '-0.01em' }}>
          Pixelan Studio adalah studio digital serba bisa dari Indonesia. Kami membantu membangun produk digital, membuatnya dilihat orang, dan membimbing kamu yang ingin belajar membuatnya sendiri — dengan harga yang menyesuaikan kebutuhanmu.
        </p>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {stats.map(([v, l, dark]) => (
            <Box key={v} dark={dark} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', boxShadow: dark ? `8px 8px 0 ${C.accent}` : 'none' }}>
              <div style={{ fontFamily: F.pixel, fontSize: 92, lineHeight: 0.9, color: dark ? C.lime : C.accent }}>{v}</div>
              <div style={{ fontFamily: F.mono, fontSize: 17, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 16, opacity: 0.7 }}>{l}</div>
            </Box>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 22px', fontSize: 22, fontWeight: 500 }}>
          {t.hero.marquee.map((m, i) => (
            <span key={m} style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              {i > 0 && <span style={{ width: 8, height: 8, background: C.accent }} />}
              {m}
            </span>
          ))}
        </div>
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------------ 03 */

function Services({ n, total }: PageProps) {
  return (
    <Page n={n} total={total} index="02" label={t.services.label} title={t.services.title} lead={t.services.body}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, height: '100%' }}>
        {t.services.list.map((s, i) => {
          const dark = i === 1
          return (
            <Box key={s.id} dark={dark} style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '34px 34px', boxShadow: dark ? `10px 10px 0 ${C.accent}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: F.pixel, fontSize: 48, lineHeight: 1, color: dark ? C.lime : C.accent }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontFamily: F.mono, fontSize: 16, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6 }}>{s.subtitle}</span>
              </div>
              <div style={{ fontFamily: F.display, fontSize: 60, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.title}</div>
              <div style={{ fontSize: 21, lineHeight: 1.45, opacity: 0.72 }}>{s.description}</div>
              <div style={{ marginTop: 'auto', paddingTop: 22, borderTop: `1.5px solid ${dark ? 'rgba(238,237,231,0.16)' : C.line}` }}>
                <Bullets items={s.items} color={dark ? C.lime : C.accent} size={20} />
              </div>
            </Box>
          )
        })}
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------------ 04 */

function Psych({ n, total }: PageProps) {
  const p = t.psych
  return (
    <Page n={n} total={total} index="03" label={p.label} title={p.title}>
      <div style={{ display: 'flex', gap: 32, height: '100%' }}>
        <Box dark style={{ width: 470, display: 'flex', flexDirection: 'column', padding: '36px 36px', boxShadow: `10px 10px 0 ${C.accent}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 76, height: 76, background: C.lime, color: C.ink, display: 'grid', placeItems: 'center', fontFamily: F.pixel, fontSize: 52, lineHeight: 1 }}>R</div>
            <div>
              <div style={{ fontFamily: F.display, fontSize: 40, fontWeight: 600, letterSpacing: '-0.03em' }}>{p.name}</div>
              <div style={{ fontFamily: F.mono, fontSize: 16, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6 }}>{p.role}</div>
            </div>
          </div>
          <p style={{ margin: '28px 0 0', fontSize: 21, lineHeight: 1.5, opacity: 0.75 }}>{p.body}</p>
          <p style={{ margin: 'auto 0 0', fontSize: 30, lineHeight: 1.25, letterSpacing: '-0.02em', color: C.lime }}>{p.quote}</p>
        </Box>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto 1fr', gap: 24 }}>
          <Box>
            <Label>{p.promisesLabel}</Label>
            <div style={{ marginTop: 20 }}>
              <Bullets items={p.promises} size={21} />
            </div>
          </Box>
          <Box>
            <Label>{p.topicsLabel}</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
              {p.topics.map((x) => (
                <span key={x} style={{ padding: '8px 14px', border: `1.5px solid ${C.line}`, background: C.paper, fontSize: 19 }}>
                  {x}
                </span>
              ))}
            </div>
          </Box>
          <Box style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}>
            <Label>{p.stepsLabel}</Label>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'center', marginTop: 16 }}>
              {p.steps.map((s, i) => (
                <div key={s.title}>
                  <div style={{ fontFamily: F.pixel, fontSize: 52, lineHeight: 1, color: C.accent }}>{String(i + 1).padStart(2, '0')}</div>
                  <div style={{ fontSize: 25, fontWeight: 600, marginTop: 10 }}>{s.title}</div>
                  <div style={{ fontSize: 19, lineHeight: 1.45, color: C.muted, marginTop: 6 }}>{s.description}</div>
                </div>
              ))}
            </div>
          </Box>
        </div>
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------------ 05 */

function Joki({ n, total }: PageProps) {
  const j = t.joki
  return (
    <Page n={n} total={total} index="04" label={j.label} title={j.title} lead={j.body}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
          {j.games.map((g, i) => (
            <Box key={g.id} style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 10, background: g.color }} />
              <div style={{ padding: '22px 22px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                <div style={{ fontFamily: F.pixel, fontSize: 72, lineHeight: 0.9, color: g.color, WebkitTextStroke: g.id === 'other' ? `1px ${C.ink}` : undefined }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ marginTop: 'auto', fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{g.name}</div>
                <div style={{ fontFamily: F.mono, fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted }}>{g.tag}</div>
                <div style={{ paddingTop: 16, marginTop: 8, borderTop: `1.5px solid ${C.line}`, height: 170 }}>
                  <Bullets items={g.tasks.slice(0, 4)} size={17} color={g.id === 'other' ? C.ink : g.color} />
                </div>
              </div>
            </Box>
          ))}
        </div>
        <Box dark style={{ display: 'flex', alignItems: 'center', gap: 40, padding: '24px 32px' }}>
          {j.points.map((pt) => (
            <div key={pt} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 21, flex: 1 }}>
              <span style={{ width: 12, height: 12, background: C.lime, flexShrink: 0 }} />
              {pt}
            </div>
          ))}
        </Box>
        <div style={{ fontFamily: F.mono, fontSize: 16, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted }}>{j.note}</div>
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------------ 06 */

function Pricing({ n, total }: PageProps) {
  const p = t.pricing
  return (
    <Page n={n} total={total} index="05" label={p.label} title={p.title}>
      <div style={{ display: 'flex', gap: 32, height: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {p.points.map((pt, i) => (
            <Box key={pt.title} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 28 }}>
              <span style={{ fontFamily: F.pixel, fontSize: 64, lineHeight: 1, color: C.accent, width: 70 }}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em' }}>{pt.title}</div>
                <div style={{ fontSize: 21, lineHeight: 1.45, color: C.muted, marginTop: 6 }}>{pt.description}</div>
              </div>
            </Box>
          ))}
        </div>
        <Box dark style={{ width: 600, display: 'flex', flexDirection: 'column', gap: 22, padding: '34px 36px', boxShadow: `10px 10px 0 ${C.accent}` }}>
          <Label color={C.lime}>{p.card}</Label>
          <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.02em' }}>{p.step1}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {p.needs.map((x, i) => (
              <span key={x} style={{ padding: '9px 15px', fontSize: 19, border: `1.5px solid ${i < 2 ? C.lime : 'rgba(238,237,231,0.22)'}`, background: i < 2 ? C.lime : 'transparent', color: i < 2 ? C.ink : C.paper }}>
                {x}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 'auto', padding: '20px 0', background: C.lime, color: C.ink, textAlign: 'center', fontSize: 23, fontWeight: 600 }}>{p.cta}</div>
          <div style={{ fontFamily: F.mono, fontSize: 15, letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'center', opacity: 0.6 }}>{p.note}</div>
        </Box>
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------------ 07 */

function Process({ n, total }: PageProps) {
  const steps: [string, string][] = [
    ['Ngobrol dulu', `Ceritakan ide atau masalahmu lewat ${DOMAIN}. Konsultasi pertama gratis.`],
    ['Penawaran jelas', 'Rincian harga dan timeline kami kirim sebelum pengerjaan dimulai. Tanpa kejutan.'],
    ['Dikerjakan', 'Kami kerjakan sesuai scope, dengan kabar progres yang rutin.'],
    ['Serah terima', 'Siap dipakai. Untuk website, kami bantu hosting dan setup custom domain.'],
  ]
  const info: [string, string][] = [
    [t.contact.studio, t.contact.location],
    ['Jam kerja', `${t.contact.hours} WIB`],
    ['Bahasa', 'Indonesia & English'],
  ]
  return (
    <Page n={n} total={total} index="06" label="Cara kerja" title={['Dari obrolan', 'sampai jadi.']}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {steps.map(([title, d], i) => (
            <Box key={title} dark={i === 0} style={{ display: 'flex', flexDirection: 'column', boxShadow: i === 0 ? `8px 8px 0 ${C.accent}` : 'none' }}>
              <span style={{ fontFamily: F.pixel, fontSize: 96, lineHeight: 0.85, color: i === 0 ? C.lime : C.accent }}>{String(i + 1).padStart(2, '0')}</span>
              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em' }}>{title}</div>
                <div style={{ fontSize: 20, lineHeight: 1.45, opacity: 0.7, marginTop: 10 }}>{d}</div>
              </div>
            </Box>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: `1.5px solid ${C.line}`, paddingTop: 22 }}>
          {info.map(([k, v]) => (
            <div key={k}>
              <Label>{k}</Label>
              <div style={{ fontSize: 23, marginTop: 8 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------------ 08 */

function Faq({ n, total }: PageProps) {
  // The general questions (the joki one is on its own page already).
  const items = t.faq.items.filter((_, i) => i !== 3).slice(0, 6)
  return (
    <Page n={n} total={total} index="07" label={t.faq.label} title={t.faq.title}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3, 1fr)', gap: 18, height: '100%' }}>
        {items.map((it, i) => (
          <Box key={it.q} style={{ display: 'flex', gap: 20, padding: '24px 28px' }}>
            <span style={{ fontFamily: F.pixel, fontSize: 40, lineHeight: 1, color: C.accent, width: 40, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
            <div>
              <div style={{ fontSize: 23, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.25 }}>{it.q}</div>
              <div style={{ fontSize: 17.5, lineHeight: 1.45, color: C.muted, marginTop: 8 }}>{it.a}</div>
            </div>
          </Box>
        ))}
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------------ 09 */

const QR = (() => {
  const m = QRCode.create(site.url, { errorCorrectionLevel: 'M' }).modules
  return { size: m.size, on: (r: number, c: number) => Boolean(m.get(r, c)) }
})()

function Qr({ size }: { size: number }) {
  const pad = size * 0.06
  const cell = (size - pad * 2) / QR.size
  const rects: ReactNode[] = []
  for (let r = 0; r < QR.size; r++) for (let c = 0; c < QR.size; c++) if (QR.on(r, c)) rects.push(<rect key={`${r}-${c}`} x={pad + c * cell} y={pad + r * cell} width={cell + 0.4} height={cell + 0.4} fill={C.ink} />)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', background: C.paper50 }}>
      {rects}
    </svg>
  )
}

function Contact({ n, total }: PageProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.ink, color: C.paper, fontFamily: F.sans }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: GRID, backgroundSize: '40px 40px', opacity: 0.55 }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, transparent 0%, ${C.ink} 72%)` }} />
      <div style={{ position: 'absolute', left: PAD, right: PAD, top: 0, bottom: FOOT, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 110 }}>
        <div>
          <Label color={C.lime} index="08">
            {t.contact.label}
          </Label>
          <div style={{ marginTop: 28 }}>
            <Title lines={['Punya project?', 'Yuk ngobrol.']} size={110} color={C.paper} quiet={C.lime} />
          </div>
          <p style={{ margin: '30px 0 0', maxWidth: 580, fontSize: 24, lineHeight: 1.5, color: 'rgba(238,237,231,0.7)' }}>
            Ceritakan idemu — konsultasi pertama gratis dan tanpa komitmen. Semua layanan dan cara menghubungi kami ada di website.
          </p>
          <div style={{ marginTop: 40 }}>
            <div style={{ fontFamily: F.mono, fontSize: 17, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(238,237,231,0.55)' }}>Website</div>
            <div style={{ fontFamily: F.display, fontSize: 52, fontWeight: 600, letterSpacing: '-0.03em', marginTop: 6 }}>{DOMAIN}</div>
          </div>
        </div>
        <div style={{ padding: 26, background: C.paper50, color: C.ink, boxShadow: `12px 12px 0 ${C.accent}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Qr size={330} />
          <div style={{ fontFamily: F.mono, fontSize: 16, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 18, color: C.muted }}>Pindai untuk berkunjung</div>
          <div style={{ marginTop: 14, width: '100%', padding: '16px 0', background: C.lime, textAlign: 'center', fontSize: 22, fontWeight: 700 }}>Kunjungi {DOMAIN}</div>
        </div>
      </div>
      <Footer n={n} total={total} dark />
    </div>
  )
}

/** Every page, in order. */
export const PAGES: { id: string; title: string; render: (p: PageProps) => ReactNode }[] = [
  { id: 'sampul', title: 'Sampul', render: Cover },
  { id: 'tentang', title: 'Tentang kami', render: About },
  { id: 'layanan', title: 'Layanan', render: Services },
  { id: 'sesi-psikologi', title: 'Sesi psikologi', render: Psych },
  { id: 'joki-game', title: 'Joki game', render: Joki },
  { id: 'harga', title: 'Harga', render: Pricing },
  { id: 'cara-kerja', title: 'Cara kerja', render: Process },
  { id: 'faq', title: 'FAQ', render: Faq },
  { id: 'kontak', title: 'Kontak', render: Contact },
]

/** The short version. */
export const SHORT = ['sampul', 'tentang', 'layanan', 'harga', 'kontak']
