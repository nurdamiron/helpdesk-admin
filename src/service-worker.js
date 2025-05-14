/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';

// Захватываем контроль над всеми клиентами сразу после активации
clientsClaim();

// Предварительно кешируем все активы, сгенерированные в процессе сборки.
// Их URL-адреса вставляются в переменную манифеста ниже.
// Эта переменная должна быть где-то в вашем файле service worker,
// даже если вы решите не использовать предварительное кеширование.
precacheAndRoute(self.__WB_MANIFEST);

// Предварительно кешируем страницу offline.html
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('offline-html').then((cache) => {
      return cache.add('/offline.html');
    })
  );
});

// Настраиваем роутинг в стиле App Shell, чтобы все запросы навигации
// выполнялись с вашим файлом index.html.
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Возвращаем false, чтобы исключить запросы из обработки index.html
  ({ request, url }) => {
    // Если это не навигация, пропускаем
    if (request.mode !== 'navigate') {
      return false;
    } 

    // Если это URL, который начинается с /_, пропускаем
    if (url.pathname.startsWith('/_')) {
      return false;
    } 

    // Если это похоже на URL для ресурса, потому что содержит расширение файла, пропускаем
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } 

    // Возвращаем true, чтобы сигнализировать, что мы хотим использовать обработчик
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// Кешируем файлы локализации с помощью стратегии StaleWhileRevalidate
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.includes('/locales/'),
  new StaleWhileRevalidate({
    cacheName: 'localization-files',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60, // 1 день
      }),
    ],
  })
);

// Кешируем ответы API с помощью стратегии NetworkFirst для важных данных
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-responses',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 10 * 60, // 10 минут
      }),
    ],
  })
);

// Кешируем изображения с помощью стратегии CacheFirst
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
      }),
    ],
  })
);

// Кешируем стили и скрипты с помощью StaleWhileRevalidate
registerRoute(
  ({ request }) => 
    request.destination === 'style' || 
    request.destination === 'script' || 
    request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 24 * 60 * 60, // 1 день
      }),
    ],
  })
);

// Кешируем шрифты Google с помощью стратегии CacheFirst
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com' || 
               url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 год
      }),
    ],
  })
);

// Обработчик для запросов навигации, который будет использовать offline.html, когда нет сети
self.addEventListener('fetch', (event) => {
  // Обрабатываем только запросы GET для навигации
  if (event.request.mode === 'navigate' && event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/offline.html');
        })
    );
    return;
  }
});

// Этот код позволяет веб-приложению запускать skipWaiting через
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.
// For example, handle offline fallbacks or background sync 