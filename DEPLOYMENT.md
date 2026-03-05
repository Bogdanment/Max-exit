# 🚀 Deployment Guide - Exit Accessories

## Готовые варианты деплоя

### 📊 Сравнение платформ

| Платформа | Стоимость | Сложность | Рекомендуемость |
|-----------|-----------|-----------|-----------------|
| **Railway** | $5/месяц+ | Простая ✅ | ⭐⭐⭐⭐⭐ Лучший выбор |
| **Render** | Free (с ограничениями) | Средняя | ⭐⭐⭐⭐ Хорош |
| **Heroku** | $7/месяц+ | Средняя | ⭐⭐⭐ Хорошо |
| **Vercel+Render** | Free+Free | Сложная | ⭐⭐⭐⭐ Разделённый |
| **Docker VPS** | $5-20/месяц | Сложная | ⭐⭐⭐⭐ Полный контроль |

---

## 🚂 RAILWAY (РЕКОМЕНДУЕТСЯ)

### ✅ Преимущества:
- Простой деплой через GitHub
- Встроенная PostgreSQL БД
- Бесплатный trial $5/месяц
- Автоматические обновления при push

### 📝 Инструкция:

1. **Создайте аккаунт на [railway.app](https://railway.app)**

2. **Создайте новый проект:**
   - Нажмите "New Project"
   - Выберите "Deploy from GitHub repo"
   - Подключите ваш репозиторий

3. **Добавьте PostgreSQL:**
   - Нажмите "Add Service" → "PostgreSQL"
   - Railway создаст БД автоматически
   - DATABASE_URL будет доступна автоматически

4. **Настройте переменные окружения для Backend:**
   ```
   NODE_ENV=production
   JWT_SECRET=generate-secure-random-string-here
   ```

5. **Добавьте второй проект для Frontend:**
   - Повторите шаги 2-3
   - Build Command: `npm run build`
   - Start Command: `npm run serve`
   - VITE_API_URL: скопируйте URL backend-сервиса

6. **Деплой:**
   ```bash
   git push origin main
   ```
   Railway будет деплоить автоматически!

### 🔗 Backend URL на Railway:
После деплоя вы получите URL типа: `https://your-app.railway.app`

### Используйте его в VITE_API_URL:
```
VITE_API_URL=https://your-app.railway.app/api
```

---

## 🌐 RENDER.COM

Детальная инструкция в файле [RENDER_DEPLOY.md](./RENDER_DEPLOY.md)

### Быстрый старт:
```bash
# 1. Подключите GitHub
# 2. Создайте PostgreSQL service
# 3. Деплойте backend и frontend отдельно
# 4. Установите переменные окружения
```

---

## 🟣 HEROKU

Детальная инструкция в файле [HEROKU_DEPLOY.md](./HEROKU_DEPLOY.md)

### Быстрый старт:
```bash
# 1. Установите Heroku CLI
npm install -g heroku

# 2. Логин
heroku login

# 3. Создайте приложение
heroku create your-app-name

# 4. Добавьте PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# 5. Установите переменные
heroku config:set JWT_SECRET=your-secret
heroku config:set NODE_ENV=production

# 6. Деплой
git push heroku main
```

---

## 🔵 VERCEL (Frontend) + RENDER (Backend)

### Frontend на Vercel:
```bash
# 1. Подключите GitHub на vercel.com
# 2. Выберите этот репозиторий
# 3. Build Command: npm run build
# 4. Output Directory: dist
# 5. Env Var: VITE_API_URL=вашийbackendurl
```

### Backend на Render:
Смотрите выше: RENDER.COM

---

## 🐳 DOCKER VPS (максимальный контроль)

Если хотите развернуть на своем сервере (DigitalOcean, AWS, Linode и т.д.)

### Требования:
- VPS с Docker и Docker Compose
- SSH доступ к серверу
- Домен (опционально)

### Инструкция:

1. **Подключитесь к серверу:**
   ```bash
   ssh root@your-server-ip
   ```

2. **Установите Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

3. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/your-username/exit.git
   cd exit
   ```

4. **Создайте production .env файлы:**
   ```bash
   # Frontend
   echo "VITE_API_URL=https://api.yourdomain.com/api" > .env.production
   
   # Backend
   cd backend
   cp .env.example .env
   # Отредактируйте .env с production значениями
   cd ..
   ```

5. **Запустите с docker-compose.prod.yml:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

6. **Настройте Nginx (reverse proxy):**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
   
       location / {
           proxy_pass http://localhost:3000;
       }
   
       location /api {
           proxy_pass http://localhost:5000;
       }
   }
   ```

7. **Получите SSL сертификат:**
   ```bash
   sudo apt-get install certbot
   sudo certbot certonly --standalone -d yourdomain.com
   ```

---

## 🔑 Важные переменные окружения для Production

### Frontend (.env.production):
```
VITE_API_URL=https://your-api-url.com/api
```

### Backend (.env):
```
NODE_ENV=production
JWT_SECRET=generate-very-long-random-string-min-32-chars
DATABASE_URL=postgresql://user:password@host:port/dbname
PORT=5000
```

---

## ✅ Чек-лист перед деплоем

- [ ] Обновлены все .env файлы для production
- [ ] JWT_SECRET изменён на секретный ключ
- [ ] DATABASE_URL правильно настроена
- [ ] API_URL указывает на production backend
- [ ] Все зависимости установлены (`npm install`)
- [ ] Тесты прошли успешно
- [ ] Initial SQL миграции есть в init.sql
- [ ] Uploads папка существует и доступна для записи
- [ ] CORS настроен для production домена
- [ ] Логирование включено (node.js logs)

---

## 🆘 Решение проблем

### ❌ Ошибка подключения к БД:
```
DATABASE_URL неправильная или БД недоступна
```
**Решение:** Проверьте DATABASE_URL в переменных окружения

### ❌ JWT ошибка:
```
Invalid token
```
**Решение:** Используйте одинаковый JWT_SECRET на всех инстансах

### ❌ Frontend не загружается:
```
404 Not Found
```
**Решение:** Убедитесь что build прошел успешно (`npm run build`), dist папка существует

### ❌ Загрузка фото не работает:
```
Error uploading file
```
**Решение:** Проверьте что uploads папка доступна для записи

### ❌ Бесконечная переадресация:
1. Очистите cookies браузера
2. Проверьте CORS настройки в backend
3. Убедитесь что JWT_SECRET одинаков

---

## 📞 Команды для отладки

```bash
# Просмотр логов контейнеров
docker-compose -f docker-compose.prod.yml logs -f

# Вход в backend контейнер
docker-compose -f docker-compose.prod.yml exec api sh

# Вход в БД контейнер
docker-compose -f docker-compose.prod.yml exec postgres psql -U postgres

# Проверка статуса сервисов
docker-compose -f docker-compose.prod.yml ps

# Перезагрузка контейнеров
docker-compose -f docker-compose.prod.yml restart
```

---

## 🎉 Поздравляем!

Ваше приложение готово к production! 🚀

Выберите платформу и следуйте инструкциям выше.
