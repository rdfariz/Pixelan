/**
 * Konfigurasi umum. Semua teks yang tampil (dua bahasa) ada di `src/data/copy.ts`.
 * Untuk project & client, edit `src/data/projects.ts`.
 */

export const site = {
  name: 'Pixelan Studio',
  url: 'https://pixelan.my.id/',
  whatsapp: '6285183113700',
  timezone: 'Asia/Jakarta',
  timezoneLabel: 'WIB',
}

export const waLink = (message: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`

export const sectionIds = ['services', 'work', 'joki', 'pricing', 'faq', 'contact'] as const
