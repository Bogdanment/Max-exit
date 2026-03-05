# Heroku Build Configuration

## Backend Deployment

1. **Подключите PostgreSQL на Heroku:**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

2. **Установите переменные окружения:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-super-secret-key-here
   ```

3. **Деплой:**
   ```bash
   git push heroku main
   ```

## Frontend Deployment

Используйте Netlify или Vercel с конфигом в netlify.toml или vercel.json

## Команды для Heroku CLI

```bash
# Установка зависимостей
npm install -g heroku

# Логин
heroku login

# Создание приложения
heroku create your-app-name

# Просмотр логов
heroku logs --tail

# Просмотр переменных окружения
heroku config

# Изменение переменной
heroku config:set KEY=value
```
