import { useCallback, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import Alumni from './components/sections/Alumni'
import Capabilities from './components/sections/Capabilities'
import Contact from './components/sections/Contact'
import Faq from './components/sections/Faq'
import Hero from './components/sections/Hero'
import Joki from './components/sections/Joki'
import Pricing from './components/sections/Pricing'
import Psychology from './components/sections/Psychology'
import Services from './components/sections/Services'
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
            <Services />
            {/* <Work /> disembunyikan sementara, lihat components/sections/Work.tsx */}
            <Capabilities />
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
