# Render.com Deployment Guide

## Быстрый деплой на Render.com

### 1. Создайте аккаунт на [render.com](https://render.com)

### 2. Создайте PostgreSQL Database:
- Нажмите "New" → "PostgreSQL"
- Выберите тариф (Free или Paid)
- Скопируйте DATABASE_URL

### 3. Деплой Backend:
- Нажмите "New" → "Web Service"
- Подключите GitHub репозиторий
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && npm start`
- Добавьте Environment Variables:
  ```
  NODE_ENV=production
  JWT_SECRET=your-secure-random-key
  DATABASE_URL=from-postgresql-instance
  ```

### 4. Деплой Frontend:
- Нажмите "New" → "Web Service" (или используйте Netlify)
- Build Command: `npm run build`
- Start Command: `npm run serve`
- Добавьте:
  ```
  VITE_API_URL=https://your-backend-url.onrender.com/api
  ```

### 5. Обновите API URL в frontend:
После деплоя обновите `VITE_API_URL` на реальный URL backend.

## Команды via Render CLI:

```bash
# Установка
npm install -g render

# Деплой
render deploy

# Просмотр логов
render logs --service=your-service-name
```

## Auto-Deploy:
Render автоматически деплоит при push в main branch!
