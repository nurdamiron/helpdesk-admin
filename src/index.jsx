// src/index.js for Admin Panel
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import i18n from './i18n.js';

// Initialize the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Получаем тексты для уведомлений в зависимости от языка
const getUpdateMessages = () => {
  const lang = i18n.language?.substring(0, 2) || 'kk';
  
  const messages = {
    kk: {
      updateAvailable: 'Жаңа нұсқа қол жетімді. Жаңарту керек пе?',
      refreshing: 'Жаңартылуда...'
    },
    ru: {
      updateAvailable: 'Доступно новое обновление. Обновить?',
      refreshing: 'Обновление...'
    }
  };
  
  return messages[lang] || messages.kk;
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate: registration => {
    const waitingServiceWorker = registration.waiting;
    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener("statechange", event => {
        if (event.target.state === "activated") {
          const messages = getUpdateMessages();
          if (window.confirm(messages.updateAvailable)) {
            console.log(messages.refreshing);
            window.location.reload();
          }
        }
      });
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
    }
  },
  onSuccess: registration => {
    console.log('ServiceWorker registered successfully');
  }
});

// Обновляем сообщения при изменении языка
i18n.on('languageChanged', () => {
  // При изменении языка просто обновляем доступные сообщения
  // Реальное обновление будет использовать getUpdateMessages при необходимости
  console.log('Language changed, update messages updated');
});
