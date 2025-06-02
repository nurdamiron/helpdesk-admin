# API Configuration Guide

## Настройка API для локальной разработки

### Автоматическое определение API URL

Система автоматически определяет, какой API URL использовать:

1. **Localhost (127.0.0.1, localhost)** → `http://localhost:5002/api`
2. **Локальные IP (192.168.x.x, 10.x.x.x)** → `http://YOUR_IP:5002/api`
3. **Production (vercel.app, onrender.com)** → `https://helpdesk-backend-ycoo.onrender.com/api`

### Переменные окружения

#### Для принудительного указания API URL:

**Локальная разработка** (создайте `.env.local`):
```bash
REACT_APP_API_URL=http://localhost:5002/api
REACT_APP_WS_URL=ws://localhost:5002/ws
REACT_APP_ENV=development
```

**Production** (используется `.env`):
```bash
REACT_APP_API_URL=https://helpdesk-backend-ycoo.onrender.com/api
REACT_APP_WS_URL=wss://helpdesk-backend-ycoo.onrender.com/ws
REACT_APP_ENV=production
```

### Запуск с разными настройками

```bash
# Обычный запуск (автоопределение)
npm start

# Принудительно с localhost API
npm run start:local

# Запуск в сети (доступ с других устройств)
npm run start:network

# Production режим
npm run start:prod
```

### Сборка с разными настройками

```bash
# Обычная сборка
npm run build

# Сборка для localhost
npm run build:local

# Development сборка
npm run build:dev
```

### Отладка

В консоли браузера вы увидите:
```
🔧 API Configuration: {
  hostname: "localhost",
  protocol: "http:",
  nodeEnv: "development",
  envApiUrl: "http://localhost:5002/api",
  calculatedApiUrl: "http://localhost:5002/api"
}
```

### Проверка подключения

1. Откройте DevTools → Console
2. Найдите сообщение "🔧 API Configuration"
3. Убедитесь что `calculatedApiUrl` указывает на правильный адрес

### Troubleshooting

**Проблема**: API все еще указывает на onrender.com  
**Решение**: 
1. Создайте файл `.env.local` с локальными настройками
2. Перезапустите сервер разработки
3. Проверьте консоль на наличие правильного API URL

**Проблема**: CORS ошибки  
**Решение**: Убедитесь что backend запущен на порту 5002 и настроен для CORS

**Проблема**: WebSocket не подключается  
**Решение**: Проверьте что `REACT_APP_WS_URL` указывает на правильный WebSocket endpoint