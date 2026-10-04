/**
 * ─────────────────────────────────────────────────────────────
 *  PROJECTS & CLIENTS — satu-satunya file yang perlu diedit
 *  untuk menambah showcase project dan daftar client.
 * ─────────────────────────────────────────────────────────────
 *
 *  Ada 4 jenis project (`kind`):
 *  • 'website'  → website / app / profil. Screenshot taruh di /public/projects
 *  • 'video'    → satu video YouTube (biasa / shorts → `vertical: true`)
 *  • 'playlist' → playlist YouTube + daftar videonya
 *  • 'channel'  → channel YouTube (avatar, banner, statistik, video terbaru)
 *
 *  `category` menentukan tab filter: 'website' | 'ads' | 'video' | 'mentoring'.
 *  'mentoring' = karya alumni mentoring → tampil di section "Mentoring alumni"
 *  (terpisah dari carousel project).
 *  Teks yang tampil dua bahasa ditulis sebagai { en: '...', id: '...' }.
 *  ID video YouTube = kode setelah `v=` atau setelah `/shorts/`.
 *
 *  Urutan di array = urutan tampil di carousel (bisa di-swipe).
 */

export type Localized = { en: string; id: string }
export type Category = 'website' | 'ads' | 'video' | 'mentoring'

interface BaseProject {
  slug: string
  category: Category
  title: string
  description: Localized
  tags?: string[]
  /** Link utama (website / YouTube) */
  url: string
}

export interface WebsiteProject extends BaseProject {
  kind: 'website'
  domain: string
  /** Screenshot desktop (1440×900) */
  image: string
  /** Screenshot mobile (390×844), opsional */
  mobileImage?: string
  /** Warna background thumbnail — ambil dari warna brand */
  color: string
}

export interface VideoProject extends BaseProject {
  kind: 'video'
  youtubeId: string
  /** true untuk YouTube Shorts / video 9:16 */
  vertical?: boolean
}

export interface PlaylistProject extends BaseProject {
  kind: 'playlist'
  playlistId: string
  videos: { id: string; title: string }[]
}

export interface ChannelProject extends BaseProject {
  kind: 'channel'
  handle: string
  avatar: string
  banner: string
  subscribers: number
  videoCount: number
  /** Beberapa video terbaru untuk preview */
  videos: { id: string; title: string }[]
  color: string
}

export type Project = WebsiteProject | VideoProject | PlaylistProject | ChannelProject

export const projects: Project[] = [
  {
    kind: 'website',
    slug: 'otsukare',
    category: 'website',
    title: 'Otsukare.me',
    domain: 'otsukare.me',
    url: 'https://otsukare.me/',
    description: {
      en: 'A premium creator workspace and link-in-bio platform. Connect your world and build your digital identity.',
      id: 'Creator workspace premium & platform link-in-bio. Hubungkan semua link kamu dan bangun identitas digitalmu.',
    },
    tags: ['Web app', 'Link in bio', 'Creator tools'],
    image: '/projects/otsukare-desktop.webp',
    mobileImage: '/projects/otsukare-mobile.webp',
    color: '#A3124F',
  },
  {
    kind: 'website',
    slug: 'konconihongo',
    category: 'website',
    title: 'KoncoNihongo',
    domain: 'konconihongo.my.id',
    url: 'https://konconihongo.my.id/',
    description: {
      en: 'Learn Japanese from zero to JLPT N1 — a structured path, animated stroke order, and reviews that bring it back before you forget.',
      id: 'Belajar bahasa Jepang dari nol sampai JLPT N1 — jalur belajar terstruktur, animasi urutan goresan, dan review sebelum kamu lupa.',
    },
    tags: ['PWA', 'Education', 'JLPT N5 — N1'],
    image: '/projects/konconihongo-desktop.webp',
    mobileImage: '/projects/konconihongo-mobile.webp',
    color: '#EF4B2B',
  },
  {
    kind: 'website',
    slug: 'cafeinaja',
    category: 'website',
    title: 'Cafeinaja',
    domain: 'cafeinaja.vercel.app',
    url: 'https://cafeinaja.vercel.app/',
    description: {
      en: 'QR ordering, kitchen display and payments for cafés — guests scan, order and pay from their table.',
      id: 'QR ordering, kitchen display & pembayaran untuk kafe — tamu cukup scan, pesan, dan bayar dari meja.',
    },
    tags: ['SaaS', 'QR ordering', 'F&B'],
    image: '/projects/cafeinaja-desktop.webp',
    mobileImage: '/projects/cafeinaja-mobile.webp',
    color: '#B8763F',
  },
  {
    kind: 'video',
    slug: 'durenji-ads',
    category: 'ads',
    title: 'Durenji Ads',
    youtubeId: 'Ycv8SzqjEf8',
    vertical: true,
    url: 'https://www.youtube.com/shorts/Ycv8SzqjEf8',
    description: {
      en: 'Short-form video ad generated with AI (Google Veo).',
      id: 'Iklan video pendek yang dibuat dengan AI (Google Veo).',
    },
    tags: ['Veo', 'Gen AI', 'Shorts'],
  },
  {
    kind: 'playlist',
    slug: 'vtuber-music-video',
    category: 'video',
    title: 'VTuber — Music Video',
    playlistId: 'PLS8FG4dPpXIw',
    url: 'https://www.youtube.com/playlist?list=PLS8FG4dPpXIw',
    description: {
      en: 'Music videos edited for VTubers and independent artists.',
      id: 'Video musik yang diedit untuk VTuber dan musisi independen.',
    },
    tags: ['Music video', 'VTuber', 'Editing'],
    videos: [
      { id: '9C0eevR09pM', title: 'Allencia Nirvellia — I’m Your Treasure Box' },
      { id: 'LGqOEu2gK8U', title: 'Chaimuwu — Summertime' },
      { id: '5pA2M8a30sA', title: 'ChikIzosaki — FREEZE' },
      { id: 'mOpZIRytSWo', title: 'Vita Urushi — Monitoring (DECO*27)' },
      { id: 'rLbBYdqwnTY', title: 'Yoshimori — Original Song' },
      { id: '550TeGRFnzE', title: 'Juliana Shafira — CJR Eeeaa' },
      { id: 'tEdu-hHdyI4', title: 'ZEYAA — HBD Summer' },
      { id: 'LvzuiK7sGN8', title: 'Xenrani — Gala Bunga Matahari' },
      { id: 'W3aiF7Wgj8U', title: 'Astella — Senses' },
      { id: 'X3928Yha6fM', title: 'Purin Laping — Pray' },
      { id: 'zD0T-8yHEWU', title: 'Altair Aquila — Sebatas Video Call Saja' },
      { id: 'oeLu0zVmiD0', title: 'Retry Now — Homily' },
      { id: '9wq0RFKRajY', title: 'Hozier — Too Sweet' },
      { id: 'HVBtxd7NtTE', title: 'Mcki Robyns' },
      { id: 'YJzU7Hn-KOc', title: 'Distant Future' },
      { id: 'r6o7YiivP6U', title: 'Ava Lamp — This is Halloween' },
      { id: 'yt87XNGKKd4', title: 'Lynnii — Don’t Believe in T assets' },
    ],
  },
  {
    kind: 'website',
    slug: 'yyuuqi-vgen',
    category: 'mentoring',
    title: 'yyuuqi',
    domain: 'vgen.co/yyuuqi/shop',
    url: 'https://vgen.co/yyuuqi/shop',
    description: {
      en: 'Mentoring alumni now running a VGen shop — Carrd templates, VTuber assets and video commissions.',
      id: 'Alumni mentoring yang kini punya toko di VGen — template Carrd, aset VTuber, dan komisi video.',
    },
    tags: ['VGen Shop', 'Carrd templates', 'VTuber assets'],
    image: '/projects/yyuuqi-vgen-desktop.webp',
    mobileImage: '/projects/yyuuqi-vgen-mobile.webp',
    color: '#2B2540',
  },
  {
    kind: 'channel',
    slug: 'gamer-nubi',
    category: 'mentoring',
    title: 'Gamer Nubi',
    handle: '@GamerNubi',
    url: 'https://www.youtube.com/@GamerNubi',
    description: {
      en: 'Mentoring alumni running a gaming channel — games, PCs and anime, with 366 videos and counting.',
      id: 'Alumni mentoring yang mengelola channel gaming — ngobrolin game, PC, dan anime, sudah 366 video.',
    },
    tags: ['YouTube', 'Gaming', 'Content creator'],
    avatar: '/projects/gamernubi-avatar.jpg',
    banner: '/projects/gamernubi-banner.jpg',
    subscribers: 837,
    videoCount: 366,
    color: '#F5D000',
    videos: [
      { id: 'CiJw65heG9Y', title: 'Spiral Mushoku Tensei x Genshin Impact' },
      { id: 'BUmtXwCkXgs', title: 'Genshin Impact Mushoku Tensei Music Opening' },
      { id: 'k9WxEYU2aEg', title: 'Yuuqi Palanya Nyala, Syun Di Doain 3 orang | Valorant' },
      { id: 'wQ7n6FTKmD4', title: 'Apex Legends Indonesia - Ganti Ban Serep, Knoock Terbang, Champion Mode On' },
    ],
  },
]

export interface Client {
  name: string
  logo?: string
  url?: string
}

/** Contoh: { name: 'Kopi Senja', logo: '/clients/kopi-senja.svg', url: 'https://...' } */
export const clients: Client[] = []

/** mq = 320px list thumb, maxres = 1280px, oar = full-res vertical (Shorts) */
export const youtubeThumb = (id: string, quality: 'mq' | 'hq' | 'maxres' | 'oar' = 'hq') =>
  `https://i.ytimg.com/vi/${id}/${quality}default.jpg`
