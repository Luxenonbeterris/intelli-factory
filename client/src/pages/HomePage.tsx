import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const { t } = useTranslation()
  return (
    <div className="w-full">
      {/* Hero with background */}
      <div className="relative w-full">
        <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center" />
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mt-16 max-w-5xl w-full">
            {[
              {
                icon: '/global.svg',
                title: t('features.global.title'),
                description: t('features.global.description'),
              },
              {
                icon: '/delivery.svg',
                title: t('features.logistics.title'),
                description: t('features.logistics.description'),
              },
              {
                icon: '/secure.svg',
                title: t('features.secure.title'),
                description: t('features.secure.description'),
              },
            ].map(({ icon, title, description }) => (
              <div
                key={title}
                className="p-6 bg-white/80 backdrop-blur rounded shadow hover:scale-105 hover:shadow-xl transition flex flex-col items-center text-gray-900 border hover:border-blue-600"
              >
                <img src={icon} alt={title} className="w-32 h-24 mb-6" />
                <h3 className="text-xl font-bold mb-2 text-center min-h-[2.5rem]">{title}</h3>
                <p className="text-center text-base sm:text-lg max-w-sm break-words">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Us */}
      <section id="about" className="py-20 bg-white text-gray-900 flex flex-col items-center px-4">
        <img
          src="/team.jpg"
          alt={t('about.title')}
          className="rounded-lg shadow mb-6 w-full max-w-md"
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
          <div className="p-6 bg-white rounded shadow flex flex-col items-center hover:scale-105 transition">
            <img src="/contract.svg" alt={t('how.step1.post')} className="w-32 h-24 mb-6" />
            <h3 className="text-xl font-bold mb-2 text-center min-h-[2.5rem]">
              {t('how.step1.title')}
            </h3>
            <p className="text-center">{t('how.step1.description')}</p>
          </div>
          <div className="p-6 bg-white rounded shadow flex flex-col items-center hover:scale-105 transition">
            <img
              src="/containers.svg"
              alt={t('how.step2.alt')}
              className="w-32 h-24 mb-6 object-cover rounded"
            />
            <h3 className="text-xl font-bold mb-2 text-center min-h-[2.5rem]">
              {t('how.step2.title')}
            </h3>
            <p className="text-center">{t('how.step1.description')}</p>
          </div>
          <div className="p-6 bg-white rounded shadow flex flex-col items-center hover:scale-105 transition">
            <img src="/secure.svg" alt={t('how.step3.alt')} className="w-32 h-24 mb-6" />
            <h3 className="text-xl font-bold mb-2 text-center min-h-[2.5rem]">
              {t('how.step3.title')}
            </h3>
            <p className="text-center">{t('how.step3.description')}</p>
          </div>
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
  )
}
