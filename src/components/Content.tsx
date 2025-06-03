/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import {
  Check,
  X,
  ArrowRight,
  MessageCircle,
  PenTool,
  CheckCircle,
  Rocket,
  Sparkles,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PricingFeature {
  name: string
  included: boolean
}

interface ProcessStep {
  title: string
  description: string
}

interface PricingType {
  id: 'indonesia' | 'international'
  label: string
  price: string
  description: string
  features: PricingFeature[]
  note: string
  steps: ProcessStep[]
}

const pricingTypes: PricingType[] = [
  {
    id: 'indonesia',
    label: 'Indonesia',
    price: 'Rp 1.200.000',
    description: 'Waktu pengerjaan 1-2 minggu. Termasuk hosting & domain gratis via Vercel.',
    features: [
      { name: 'Hosting & domain gratis (Vercel)', included: true },
      { name: 'Custom domain via Hostinger', included: true },
      { name: 'Akun Hostinger (+250rb/tahun jika kami yang urus)', included: true },
      { name: 'Responsive website', included: true },
      { name: 'Asset dari client (logo, foto, video, dll)', included: true },
      { name: 'Integrasi Google Maps & Social Media', included: true },
      { name: 'Call to Action link', included: true },
      { name: 'FAQ & Privacy Policy', included: true },
    ],
    note: 'Custom domain tersedia jika ada di hostinger.com',
    steps: [
      {
        title: 'Diskusi & Brief',
        description:
          'Kita ngobrol dulu soal kebutuhan website kamu, mulai dari konsep, referensi, dan fitur yang diinginkan.',
      },
      {
        title: 'Desain & Persetujuan',
        description: 'Tim kami akan buatkan desain awal dan kamu bisa review. Revisi gratis sampai fix!',
      },
      {
        title: 'Development',
        description:
          'Website mulai kami develop sesuai desain yang disepakati, plus optimasi responsive & speed.',
      },
      {
        title: 'Final Testing & Publish',
        description:
          'Website dites di berbagai device & browser, setelah oke langsung kita publish ke hosting & domain kamu.',
      },
    ],
  },
  {
    id: 'international',
    label: 'International',
    price: '$299',
    description: '1-2 weeks delivery. Includes free hosting & domain via Vercel.',
    features: [
      { name: 'Free hosting & domain (Vercel)', included: true },
      { name: 'Custom domain via Hostinger', included: true },
      { name: 'Hostinger account (+$59/year if managed by us)', included: true },
      { name: 'Responsive website', included: true },
      { name: 'Assets provided by client (logo, photos, videos, etc)', included: true },
      { name: 'Google Maps & Social Media Integration', included: true },
      { name: 'Call to Action link', included: true },
      { name: 'FAQ & Privacy Policy pages', included: true },
    ],
    note: 'Custom domains available via hostinger.com',
    steps: [
      {
        title: 'Discussion & Briefing',
        description:
          'We discuss your website needs, concepts, references, and desired features.',
      },
      {
        title: 'Design & Approval',
        description:
          'Our team will create an initial design for your review. Free revisions until it’s finalized!',
      },
      {
        title: 'Development',
        description:
          'We’ll develop the website according to the approved design, with responsive and speed optimization.',
      },
      {
        title: 'Final Testing & Publish',
        description:
          'The site is tested across devices & browsers. Once approved, we’ll publish it to your hosting & domain.',
      },
    ],
  },
]

const workflowIcons = [
  <MessageCircle className="w-6 h-6 text-pink-600 shrink-0" />,
  <PenTool className="w-6 h-6 text-pink-600 shrink-0" />,
  <CheckCircle className="w-6 h-6 text-pink-600 shrink-0" />,
  <Rocket className="w-6 h-6 text-pink-600 shrink-0" />,
]

const Pricing: React.FC = () => {
  const [activeType, setActiveType] = useState<PricingType>(pricingTypes[0])
  const processRef = useRef<HTMLDivElement>(null)

  const linkContact = "https://wa.me/6285155494320?text=Hello%20Pixelan%2C%20I%E2%80%99m%20interested%20in%20your%20website%20development%20services.%20Could%20you%20please%20provide%20more%20details%20and%20how%20the%20process%20works%3F%20Thank%20you%21"
  const words = [
    'Digital',
    'Creative',
    'Modern',
    'Smart',
    'Fast',
    'Sleek',
    'Reliable',
    'Flexible',
    'Innovative',
  ]
  const typingSpeed = 150
  const pauseBetweenWords = 1000

  const [displayedText, setDisplayedText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    let timeoutId: any

    const typeWord = () => {
      const currentWord = words[wordIndex]
      let index = 0

      const type = () => {
        if (index <= currentWord.length) {
          setDisplayedText(currentWord.substring(0, index))
          index++
          timeoutId = setTimeout(type, typingSpeed)
        } else {
          timeoutId = setTimeout(() => {
            setWordIndex((prev) => (prev + 1) % words.length)
          }, pauseBetweenWords)
        }
      }

      type()
    }

    typeWord()

    return () => clearTimeout(timeoutId)
  }, [wordIndex])

  useEffect(() => {
    if (processRef.current) {
      const cards = processRef.current.querySelectorAll('.process-card')
      gsap.fromTo(
        cards,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
        }
      )
    }
  }, [])

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="relative text-gray-800 font-sans rounded-none py-4 md:py-12">
      <div id="hero" className="max-w-screen-md px-4 md:px-8 mx-auto text-center mb-4">
        <motion.div
          className="w-full flex items-center justify-center py-4 md:py-8 relative"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <section
            id="hero"
            className="h-full flex-1 flex items-center py-16 md:py-0 relative z-10 mx-auto"
          >
            <div className="text-center mx-auto w-full">
              <h1 className="text-title-logo text-8xl">PIXELAN</h1>
              <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] font-bold mb-6 leading-tight">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block font-bold text-4xl md:text-5xl"
                >
                  Build your{' '}
                  <span className="text-blue-600 border-r-2 border-blue-600 text-title-logo text-5xl md:text-7xl">
                    {displayedText}
                  </span>{' '}
                  <br className="md:hidden"/>
                  Website
                </motion.span>

              </h1>
              <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-gray-600 mb-8">
                Quality websites delivered quickly to boost your online presence
              </p>

              {/* Tombol berjejer dengan ukuran sama */}
              <div className="flex justify-center flex-wrap gap-4 mb-12 relative z-10">
                {pricingTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setActiveType(type)}
                    className={`px-6 py-3 border-4 transition-all duration-200 text-base font-bold shadow-[4px_4px_0px_#000] active:translate-y-[2px] select-none ${
                      activeType.id === type.id
                        ? 'bg-pink-600 text-white border-black'
                        : 'bg-white text-black border-black hover:bg-gray-100'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <div className="hero-element flex flex-wrap justify-center gap-3 md:gap-4 text-[clamp(0.75rem,1.5vw,1rem)] text-gray-500 text-xs md:text-sm lg:text-base">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Professional Design</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Mobile Responsive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </div>

      <div id="pricing" className="max-w-screen-md px-4 md:px-8 mb-8 mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeType.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="border-4 border-black p-4 md:p-10 rounded-none bg-white shadow-[6px_6px_0px_#000] text-center relative z-10 mx-auto"
          >
            <h3 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              {activeType.label}
              <Sparkles className="text-pink-500 w-6 h-6 animate-pulse" />
            </h3>
            <p className="mb-6 text-gray-600 text-base">{activeType.description}</p>

            <div className="text-4xl md:text-5xl font-extrabold mb-8">{activeType.price}</div>

            <ul className="mb-8 text-left space-y-3">
              {activeType.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  {feature.included ? (
                    <Check className="text-green-600 w-5 h-5" />
                  ) : (
                    <X className="text-gray-400 w-5 h-5" />
                  )}
                  <span
                    className={
                      feature.included
                        ? 'text-base'
                        : 'line-through text-gray-400 text-base'
                    }
                  >
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={linkContact}
              className="inline-flex items-center gap-2 border-4 border-black px-6 py-3 bg-pink-600 text-white font-bold shadow-[4px_4px_0px_#000] transition-all duration-200 active:translate-y-[2px]"
              target='_blank'
              rel="noopener noreferrer"
            >
              {activeType.id === 'indonesia' ? 'Mulai Sekarang' : 'Get Started'}
              <ArrowRight className="w-5 h-5" />
            </a>

            <p className="mt-6 text-gray-500 text-sm">{activeType.note}</p>

            <div className="mt-12 text-left">
              <h4 className="text-xl font-semibold mb-5">Workflow</h4>
              <ol className="space-y-6">
                {activeType.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <div className="hidden  md:flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full shrink-0 text-pink-600 font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h5 className="font-bold mb-1 flex items-center gap-2">
                        {workflowIcons[idx]}
                        {step.title}
                      </h5>
                      <p className="text-gray-600 text-sm md:text-base">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Pricing
