import { useCallback, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import Alumni from './components/sections/Alumni'
import Clients from './components/sections/Clients'
import Contact from './components/sections/Contact'
import Faq from './components/sections/Faq'
import Hero from './components/sections/Hero'
import Joki from './components/sections/Joki'
import Pricing from './components/sections/Pricing'
import Psychology from './components/sections/Psychology'
import Services from './components/sections/Services'
import Work from './components/sections/Work'
import LangProvider from './i18n/LangProvider'
import { useHashNavigation } from './lib/hashNavigation'
import { ReadyContext } from './lib/ready'

export default function App() {
  const [ready, setReady] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const handleReveal = useCallback(() => setReady(true), [])
  const handleDone = useCallback(() => setLoaded(true), [])

  useHashNavigation(ready)

  return (
    <LangProvider>
      <ReadyContext.Provider value={ready}>
        <MotionConfig reducedMotion="user">
          {!loaded && <Preloader onReveal={handleReveal} onDone={handleDone} />}
          <Navbar />
          <main>
            <Hero />
            <Clients />
            <Services />
            <Work />
            <Alumni />
            <Psychology />
            <Joki />
            <Pricing />
            <Faq />
          </main>
          <Contact />
        </MotionConfig>
      </ReadyContext.Provider>
    </LangProvider>
  )
}
