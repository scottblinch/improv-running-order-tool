import i18n from 'i18next';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.json';

void i18n
  .use(ICU)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
export { useTranslation } from 'react-i18next';
