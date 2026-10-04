/** A labelled detail line; an array value is rendered as a bulleted list. */
export type Detail = [label: string, value: string | string[]]

interface Template {
  greeting: string
  /** Word used before the highlighted category, e.g. "Service" / "Layanan" */
  service: string
  thanks: string
}

/**
 * Builds WhatsApp messages with WhatsApp's own formatting (*bold*), e.g.
 *
 *   Hi Pixelan Studio! 👋
 *
 *   📌 *Service: GAME JOKI*
 *
 *   I'd like to order game joki.
 *
 *   ▸ *Game:* Mobile Legends
 *   ▸ *Tasks:*
 *      • Rank push
 *
 *   Thank you! 🙏
 */
export const composeMessage =
  ({ greeting, service, thanks }: Template) =>
  (category: string, body: string, details: Detail[] = []) => {
    const lines = [greeting, '', `📌 *${service}: ${category.toUpperCase()}*`, '', body]

    const filled = details.filter(([, value]) => (Array.isArray(value) ? value.length > 0 : value.trim() !== ''))
    if (filled.length) {
      lines.push('')
      for (const [label, value] of filled) {
        if (Array.isArray(value)) {
          lines.push(`▸ *${label}:*`, ...value.map((item) => `   • ${item}`))
        } else {
          lines.push(`▸ *${label}:* ${value}`)
        }
      }
    }

    lines.push('', thanks)
    return lines.join('\n')
  }
