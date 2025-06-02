# 🚀 Deployment Guide / Руководство по развертыванию

## 🌐 Production URLs / Продакшн адреса

- **Frontend**: https://helpdesk-admin-three.vercel.app/
- **Backend API**: https://helpdesk-backend-ycoo.onrender.com/api
- **WebSocket**: wss://helpdesk-backend-ycoo.onrender.com/ws

## 📋 Шаги для развертывания / Deployment Steps

### Frontend (Vercel)

1. **Подключите репозиторий к Vercel**
   - Зайдите на https://vercel.com
   - Импортируйте проект из GitHub
   - Выберите папку `helpdesk-admin`

2. **Установите переменные окружения в Vercel Dashboard**:
   ```
   REACT_APP_API_URL=https://helpdesk-backend-ycoo.onrender.com/api
   REACT_APP_WS_URL=wss://helpdesk-backend-ycoo.onrender.com/ws
   REACT_APP_ENV=production
   SKIP_PREFLIGHT_CHECK=true
   DISABLE_ESLINT_PLUGIN=true
   GENERATE_SOURCEMAP=false
   ```

3. **Build настройки**:
   - Build Command: `npm run build:vercel`
   - Output Directory: `build`
   - Install Command: `npm install --legacy-peer-deps`

### Backend (Render)

1. **Переменные окружения для Backend**:
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_jwt_secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

2. **Убедитесь что CORS настроен правильно в backend**:
   - Frontend URL добавлен в whitelist
   - Credentials: true
   - Все необходимые методы разрешены

## 🔧 Локальная разработка / Local Development

### Запуск Frontend:
```bash
cd helpdesk-admin
npm install --legacy-peer-deps
npm start
```

### Запуск Backend:
```bash
cd helpdesk-backend
npm install
npm start
```

## 🛠️ Troubleshooting / Решение проблем

### CORS ошибки:
1. Проверьте что frontend URL добавлен в whitelist backend
2. Убедитесь что credentials: true в CORS настройках
3. Проверьте что API_URL правильный в .env файле

### Build ошибки:
1. Используйте `npm install --legacy-peer-deps`
2. Проверьте что все переменные окружения установлены
3. Убедитесь что используется Node.js версия >=18

### WebSocket ошибки:
1. Проверьте что WSS URL правильный
2. Убедитесь что backend поддерживает WebSocket соединения
3. Проверьте настройки прокси если используете

## 📱 Мобильная версия / Mobile Version

Сайт полностью адаптивен и работает на всех устройствах:
- 📱 Мобильные телефоны
- 📱 Планшеты
- 💻 Ноутбуки
- 🖥️ Десктопы

## 🌍 Поддерживаемые языки / Supported Languages

- 🇷🇺 Русский
- 🇬🇧 English
- 🇰🇿 Қазақша

## 🔐 Безопасность / Security

1. Все API запросы проходят через HTTPS
2. JWT токены для аутентификации
3. CORS защита от неавторизованных доменов
4. XSS и CSRF защита включена

## 📧 Контакты для поддержки / Support Contacts

- WhatsApp: +7 777 013 1838
- Email: support@helpdesk.com

## 🎯 Функциональность / Features

### Для сотрудников:
- ✅ Создание заявок через Email или WhatsApp
- ✅ Отслеживание статуса заявок
- ✅ Коммуникация с поддержкой
- ✅ Загрузка файлов

### Для администраторов:
- ✅ Управление всеми заявками
- ✅ Назначение ответственных
- ✅ Изменение статусов и приоритетов
- ✅ Внутренние заметки
- ✅ Статистика и отчеты

## 🔄 Обновление / Updates

### Frontend обновление:
1. Push изменения в GitHub
2. Vercel автоматически задеплоит новую версию

### Backend обновление:
1. Push изменения в GitHub
2. Render автоматически перезапустит сервис

## ⚡ Оптимизация производительности / Performance

1. Включено кеширование статических файлов
2. Сжатие изображений и ресурсов
3. Lazy loading для компонентов
4. Service Worker для offline режима