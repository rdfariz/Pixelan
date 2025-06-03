import { motion } from 'framer-motion'
import Content from './components/Content'
import BackgroundPattern from './components/BackgroundPattern'

export default function App() {
  return (
    <div className="relative text-gray-800 min-h-screen bg-white">
      <BackgroundPattern />
      <motion.div className="relative">
        <Content />
      </motion.div>
    </div>
  )
}
