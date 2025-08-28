// client/src/pages/homepage/HomePage.tsx
import { Easing, motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { featuresData } from './homepage.data'

const easeInOut: Easing = [0.42, 0, 0.58, 1]

// Simple reusable float animation factory
function float(delay = 0) {
  return {
    animate: { x: [0, 8, 0, -8, 0] },
    transition: { duration: 4, repeat: Infinity, ease: easeInOut, delay },
  }
}

export default function HomePage() {
  const { t } = useTranslation()
  const prefersReducedMotion = useReducedMotion()

  // If user prefers reduced motion, we disable animations globally
  const maybeFloat = (delay = 0) => (prefersReducedMotion ? {} : float(delay))

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="w-full">
        {/* Hero with background */}
        <div className="relative w-full">
          <div className="absolute inset-0 bg-[url('/background.webp')] bg-cover bg-center px-0" />
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative z-10 flex flex-col items-center justify-center text-center py-20 px-4 w-full text-white">
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">{t('hero.title')}</h2>
            <p className="max-w-xl text-lg mb-8">{t('hero.description')}</p>
            <a
              href="/login"
              className="bg-blue-600 text-white px-10 py-4 rounded-full shadow hover:bg-blue-700 transition"
            >
              {t('hero.cta')}
            </a>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 mt-16 max-w-6xl w-full">
              {featuresData.map(({ icon, titleKey, descriptionKey }, index) => (
                <motion.div
                  key={titleKey}
                  className="p-6 bg-white/80 backdrop-blur rounded shadow hover:scale-105 hover:shadow-xl transition flex flex-col items-center text-gray-900 border hover:border-blue-600"
                  // stagger a little per card; same logic for desktop & mobile
                  {...maybeFloat(index * 0.3)}
                  whileHover={{ scale: 1.05 }} // simple hover feedback
                >
                  <img src={icon} alt={t(titleKey)} className="w-32 h-24 mb-6" />
                  <h3 className="text-xl font-bold mb-2 text-center min-h-[2.5rem]">
                    {t(titleKey)}
                  </h3>
                  <p className="text-center text-base sm:text-lg max-w-sm break-words">
                    {t(descriptionKey)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* About Us */}
        <section
          id="about"
          className="py-20 bg-white text-gray-900 flex flex-col items-center px-4"
        >
          <img
            src="/team.webp"
            alt={t('about.title')}
            className="rounded-lg shadow mb-6 w-full max-w-xl"
          />
          <h2 className="text-3xl font-bold mb-6">{t('about.title')}</h2>
          <p className="max-w-2xl text-center text-lg mb-6">{t('about.description')}</p>
          <img src="/factory.svg" alt={t('about.factory')} className="w-48 opacity-80" />
        </section>

        {/* How it works */}
        <section
          id="how"
          className="py-20 bg-[#ffffff] bg-[url('/backgrnd.svg')] bg-repeat bg-center bg-cover text-gray-900 flex flex-col items-center px-4"
        >
          <h2 className="text-3xl text-white font-bold mb-6">{t('how.title')}</h2>
          <img src="/workflow.svg" alt={t('how.workflow')} className="w-64 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl">
            {[
              {
                icon: '/contract.svg',
                alt: t('how.step1.post'),
                title: t('how.step1.title'),
                description: t('how.step1.description'),
              },
              {
                icon: '/containers.svg',
                alt: t('how.step2.alt'),
                title: t('how.step2.title'),
                description: t('how.step2.description'),
              },
              {
                icon: '/secure.svg',
                alt: t('how.step3.alt'),
                title: t('how.step3.title'),
                description: t('how.step3.description'),
              },
            ].map(({ icon, alt, title, description }, i) => (
              <motion.div
                key={title}
                className="p-6 bg-white rounded shadow flex flex-col items-center hover:scale-105 transition text-gray-900 border hover:border-blue-600"
                {...maybeFloat(i * 0.5)}
              >
                <img src={icon} alt={alt} className="w-32 h-24 mb-6 object-cover rounded" />
                <h3 className="text-xl font-bold mb-2 text-center min-h-[2.5rem]">{title}</h3>
                <p className="text-center">{description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contacts */}
        <section
          id="contacts"
          className="py-20 bg-white text-gray-900 flex flex-col items-center px-4"
        >
          <h2 className="text-3xl font-bold mb-6">{t('contacts.title')}</h2>
          <img
            src="/world-map.svg"
            alt={t('contacts.alt')}
            className="w-full max-w-4xl mb-6 opacity-70"
          />
          <p className="max-w-xl text-center mb-4">
            {t('contacts.description')}{' '}
            <a href="mailto:intellifactory@gmail.com" className="text-blue-600 underline">
              intellifactory@gmail.com
            </a>
          </p>
          <a
            href="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-full shadow hover:bg-blue-700 transition"
          >
            {t('contacts.cta')}
          </a>
        </section>
      </div>
    </motion.div>
  )
}
