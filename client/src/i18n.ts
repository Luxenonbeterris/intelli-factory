// client/src/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en/translation.json'
import ru from './locales/ru/translation.json'
import zh from './locales/zh/translation.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    zh: { translation: zh },
  },
  lng: 'en',
  fallbackLng: ['en'],
  supportedLngs: ['en', 'ru', 'zh'],
  nonExplicitSupportedLngs: true,
  interpolation: { escapeValue: false },
})
export default i18n
