// Brosur Pixelan Studio → folder brosur/ (tidak di-commit):
//   brosur/pixelan-studio-brosur.pdf          semua halaman (PDF vektor, teks tetap tajam)
//   brosur/pixelan-studio-brosur-ringkas.pdf  versi singkat
//   brosur/halaman/01-sampul.png …            tiap halaman sebagai gambar 2400×1800
//
//   npm run brosur          (butuh Google Chrome atau Microsoft Edge; atau set CHROME_PATH)
//
// Isi & desain: brochure/pages.tsx. Lihat langsung di browser: npm run brosur:dev
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { build, createServer, preview } from 'vite'

const root = path.resolve(import.meta.dirname, '..')
const out = path.join(root, 'brosur')
const pagesDir = path.join(out, 'halaman')
const SCALE = 1.5

// Kept in step with brochure/pages.tsx (PAGES / SHORT).
const PAGES = ['sampul', 'tentang', 'layanan', 'sesi-psikologi', 'joki-game', 'harga', 'cara-kerja', 'faq', 'kontak']
const SHORT_COUNT = 5

function chrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean)
  const found = candidates.find((p) => fs.existsSync(p))
  if (!found) throw new Error('Chrome/Edge tidak ditemukan. Set CHROME_PATH ke chrome.exe.')
  return found
}

const vite = {
  root: path.join(root, 'brochure'),
  configFile: false,
  publicDir: path.join(root, 'public'),
  plugins: [react()],
  logLevel: 'error',
}

// npm run brosur:dev — just serve the brochure to look at (responsive viewer), no files written.
if (process.argv.includes('--dev')) {
  const dev = await createServer({ ...vite, server: { port: 4180, fs: { allow: [root] } } })
  await dev.listen()
  console.log(`Brosur: ${dev.resolvedUrls.local[0]}   (satu halaman: ?page=1 · Ctrl+C untuk berhenti)`)
  await new Promise(() => {})
}

// A static build, served without the dev server's live-reload socket (which keeps headless Chrome waiting).
const dist = path.join(root, 'node_modules', '.cache', 'brochure')
await build({ ...vite, base: './', build: { outDir: dist, emptyOutDir: true } })
const server = await preview({ ...vite, build: { outDir: dist }, preview: { port: 4181 } })
const base = server.resolvedUrls.local[0]

const browser = chrome()
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'pixelan-brosur-'))
/** Runs headless Chrome once. Async on purpose: a sync call would block the preview server in this same process. */
const run = (args, url) =>
  new Promise((resolve, reject) => {
    const child = spawn(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', `--user-data-dir=${profile}`, '--virtual-time-budget=8000', ...args, url], { stdio: 'ignore' })
    const timer = setTimeout(() => {
      child.kill()
      reject(new Error(`Chrome tidak selesai dalam 90 detik: ${url}`))
    }, 90_000)
    child.on('error', reject)
    child.on('exit', (code) => {
      clearTimeout(timer)
      if (code === 0) resolve()
      else reject(new Error(`Chrome keluar dengan kode ${code}: ${url}`))
    })
  })

try {
  fs.rmSync(out, { recursive: true, force: true })
  fs.mkdirSync(pagesDir, { recursive: true })

  for (const [i, id] of PAGES.entries()) {
    const file = path.join(pagesDir, `${String(i + 1).padStart(2, '0')}-${id}.png`)
    await run(['--window-size=1600,1200', `--force-device-scale-factor=${SCALE}`, `--screenshot=${file}`], `${base}?page=${i + 1}`)
    if (!fs.existsSync(file)) throw new Error(`Gagal membuat ${file}`)
    console.log(`✓ halaman ${i + 1}/${PAGES.length} · ${id}`)
  }

  for (const [set, name] of [
    ['all', 'pixelan-studio-brosur'],
    ['short', 'pixelan-studio-brosur-ringkas'],
  ]) {
    const file = path.join(out, `${name}.pdf`)
    await run(['--no-pdf-header-footer', '--generate-pdf-document-outline', `--print-to-pdf=${file}`], `${base}?pages=${set}`)
    if (!fs.existsSync(file)) throw new Error(`Gagal membuat ${file}`)
    console.log(`✓ ${path.relative(root, file)} · ${(fs.statSync(file).size / 1e6).toFixed(1)} MB`)
  }

  const rows = PAGES.map((id, i) => `| ${i + 1} | \`halaman/${String(i + 1).padStart(2, '0')}-${id}.png\` |`).join('\n')
  fs.writeFileSync(
    path.join(out, 'README.md'),
    `# Brosur Pixelan Studio\n\nDibuat oleh \`npm run brosur\`; ubah isinya di \`brochure/pages.tsx\`, lalu jalankan ulang.\n\n` +
      `- \`pixelan-studio-brosur.pdf\` — ${PAGES.length} halaman, 4:3 mendatar (PDF vektor)\n` +
      `- \`pixelan-studio-brosur-ringkas.pdf\` — ${SHORT_COUNT} halaman\n` +
      `- \`halaman/\` — tiap halaman sebagai PNG ${1600 * SCALE}×${1200 * SCALE}\n\n| # | Gambar |\n| --- | --- |\n${rows}\n`
  )
  console.log(`✓ selesai → ${out}`)
} finally {
  await server.close()
  fs.rmSync(profile, { recursive: true, force: true })
}
