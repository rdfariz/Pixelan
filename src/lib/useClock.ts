import { useEffect, useState } from 'react'
import { site } from '../data/site'

const format = () =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: site.timezone }).format(new Date())

/** Current studio time, e.g. "14:32". Empty during server render to keep hydration identical. */
export function useClock() {
  const [time, setTime] = useState('--:--')
  useEffect(() => {
    setTime(format())
    const id = setInterval(() => setTime(format()), 10_000)
    return () => clearInterval(id)
  }, [])
  return time
}
