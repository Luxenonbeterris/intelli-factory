// src/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import cn from './locales/cn/translation.json'
import en from './locales/en/translation.json'
import kz from './locales/kz/translation.json'
import ru from './locales/ru/translation.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    kz: { translation: kz },
    cn: { translation: cn },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
