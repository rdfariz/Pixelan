import React, { useState } from 'react';
import { Check, X, ArrowRight, MessageCircle, PenTool, CheckCircle, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PricingFeature {
  name: string;
  included: boolean;
}

interface ProcessStep {
  title: string;
  description: string;
}

interface PricingType {
  id: 'indonesia' | 'international';
  label: string;
  price: string;
  description: string;
  features: PricingFeature[];
  note: string;
  steps: ProcessStep[];
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
        title: '1. Diskusi & Brief',
        description: 'Kita ngobrol dulu soal kebutuhan website kamu, mulai dari konsep, referensi, dan fitur yang diinginkan.',
      },
      {
        title: '2. Desain & Persetujuan',
        description: 'Tim kami akan buatkan desain awal dan kamu bisa review. Revisi gratis sampai fix!',
      },
      {
        title: '3. Development',
        description: 'Website mulai kami develop sesuai desain yang disepakati, plus optimasi responsive & speed.',
      },
      {
        title: '4. Final Testing & Publish',
        description: 'Website dites di berbagai device & browser, setelah oke langsung kita publish ke hosting & domain kamu.',
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
        title: '1. Discussion & Briefing',
        description: 'We discuss your website needs, concepts, references, and desired features.',
      },
      {
        title: '2. Design & Approval',
        description: 'Our team will create an initial design for your review. Free revisions until it’s finalized!',
      },
      {
        title: '3. Development',
        description: 'We’ll develop the website according to the approved design, with responsive and speed optimization.',
      },
      {
        title: '4. Final Testing & Publish',
        description: 'The site is tested across devices & browsers. Once approved, we’ll publish it to your hosting & domain.',
      },
    ],
  },
];

const workflowIcons = [
  <MessageCircle className="w-6 h-6 text-primary-600 shrink-0" />,
  <PenTool className="w-6 h-6 text-primary-600 shrink-0" />,
  <CheckCircle className="w-6 h-6 text-primary-600 shrink-0" />,
  <Rocket className="w-6 h-6 text-primary-600 shrink-0" />,
];

const Pricing: React.FC = () => {
  const [activeType, setActiveType] = useState<PricingType>(pricingTypes[0]);

  return (
    <section
      id="pricing"
      className="mt-0 lg:mt-8 py-12 sm:py-16 lg:py-24 w-full relative overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-screen-lg mx-auto relative z-10">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm">
            {activeType.id === 'indonesia' ? 'Harga' : 'Pricing'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {activeType.id === 'indonesia'
              ? 'Harga Sederhana & Transparan'
              : 'Simple & Transparent Pricing'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            {activeType.id === 'indonesia'
              ? 'Pilih harga sesuai kebutuhanmu — Indonesia atau International.'
              : 'Choose the price that fits your needs — Indonesia or International.'}
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          {pricingTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type)}
              className={`px-6 py-2 rounded-full border text-sm sm:text-base font-semibold transition-all ${
                activeType.id === type.id
                  ? 'bg-primary-600 text-white'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeType.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="rounded-2xl border border-gray-200 bg-white shadow-lg p-6 sm:p-10 md:p-14 flex flex-col"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{activeType.label}</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base md:text-lg">{activeType.description}</p>

            <div className="flex items-end gap-2 mb-8">
              <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">{activeType.price}</span>
              <span className="text-gray-500 text-sm md:text-base">
                {activeType.id === 'indonesia' ? '/project' : '/project'}
              </span>
            </div>

            <ul className="space-y-4 mb-10">
              {activeType.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  {feature.included ? (
                    <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" />
                  )}
                  <span
                    className={`${
                      feature.included ? 'text-gray-800' : 'text-gray-400 line-through'
                    } text-sm md:text-base`}
                  >
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href=""
              className="mt-auto flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-center text-base font-semibold transition-all bg-primary-600 text-white hover:bg-primary-700"
              target='_blank'
            >
              {activeType.id === 'indonesia' ? 'Mulai Sekarang' : 'Get Started'}
              <ArrowRight className="h-4 w-4" />
            </a>

            <p className="text-xs sm:text-sm text-gray-500 mt-6">{activeType.note}</p>
          </motion.div>
        </AnimatePresence>

        {/* Workflow section */}
        <div className="mt-20 py-16 rounded-3xl">
          <div className="text-center mb-10 px-4 sm:px-0">
            <span className="inline-block px-4 py-1 mb-4 rounded-full text-primary-700 font-semibold text-sm md:text-base">
              {activeType.id === 'indonesia' ? 'Alur Pengerjaan' : 'Workflow'}
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {activeType.id === 'indonesia' ? 'Alur Kerja Pembuatan Website' : 'Website Development Workflow'}
            </h3>
          </div>

          <div className="max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-10 px-4 sm:px-0">
            {activeType.steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="flex flex-col items-center text-center space-y-3 px-6 py-6 bg-white rounded-xl shadow-md"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 text-primary-600 shadow-md">
                  {workflowIcons[i]}
                </div>
                <h4 className="mt-2 text-lg font-semibold text-gray-900">{step.title}</h4>
                <p className="text-base md:text-lg text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
