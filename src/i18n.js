import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // загружаем переводы через http
  .use(Backend)
  // определяем язык пользователя
  .use(LanguageDetector)
  // передаем i18n в react-i18next
  .use(initReactI18next)
  // инициализируем i18next
  .init({
    fallbackLng: ['kk', 'ru', 'en'],
    supportedLngs: ['kk', 'ru', 'en'],
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // не нужно для React
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      // указываем казахский как язык по умолчанию
      cookieOptions: { path: '/', sameSite: 'strict' }
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // общие пространства имен для админского интерфейса
    ns: ['common', 'dashboard', 'tickets', 'settings', 'auth', 'pages', 'user'],
    defaultNS: 'common',
  });

// Определяем язык по умолчанию, если он еще не выбран
if (!localStorage.getItem('i18nextLng')) {
  const browserLang = navigator.language?.substring(0, 2);
  const defaultLang = ['kk', 'ru', 'en'].includes(browserLang) ? browserLang : 'kk';
  i18n.changeLanguage(defaultLang);
  localStorage.setItem('i18nextLng', defaultLang);
}

export default i18n; 