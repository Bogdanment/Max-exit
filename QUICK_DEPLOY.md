# 🚀 Quick Deploy Guide

## Выбор платформы (за 1 минуту)

### 🎯 ЛУЧШИЙ ВЫБОР: Railway

```bash
1. Создайте аккаунт: https://railway.app
2. Нажмите "New Project"
3. Выберите "Deploy from GitHub"
4. Подключите этот репозиторий
5. Добавьте PostgreSQL (в "Add Service")
6. Установите JWT_SECRET в переменных
7. git push - всё готово!
```

**Результат:** Backend + Frontend + PostgreSQL на railway.app ✅

---

## Альтернативные варианты

### Render.com (Free & Easy)
```
1. https://render.com
2. Создайте PostgreSQL
3. Деплойте backend отдельно
4. Деплойте frontend отдельно
5. Свяжите через VITE_API_URL
```
Смотрите: [RENDER_DEPLOY.md](./RENDER_DEPLOY.md)

### Heroku (Classic)
```
1. https://heroku.com
2. heroku create my-app
3. heroku addons:create heroku-postgresql:hobby-dev
4. git push heroku main
```
Смотрите: [HEROKU_DEPLOY.md](./HEROKU_DEPLOY.md)

### Docker VPS (Контроль)
```
1. Возьмите VPS (DigitalOcean, AWS, Linode)
2. Установите Docker
3. docker-compose -f docker-compose.prod.yml up
4. Настройте Nginx + SSL
```
Смотрите: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## Критические переменные

### 🔑 Генерируйте JWT_SECRET

```bash
# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object {[byte](Get-Random -Max 256)}))

# Linux/Mac
openssl rand -hex 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Скопируйте результат и используйте в JWT_SECRET!

### 📍 DATABASE_URL

На большинстве платформ她会автоматически установлена при добавлении PostgreSQL.

Формат: `postgresql://user:password@host:port/dbname`

### 🌐 VITE_API_URL

После деплоя backend установите это значение в frontend:

```
VITE_API_URL=https://ВАШ-BACKEND-URL/api
```

---

## Проверка перед деплоем

```bash
# 1. Все файлы на месте?
ls -la backend/
ls -la src/
ls docker-compose.yml
ls DEPLOYMENT.md

# 2. Dependencies установлены?
npm install
cd backend && npm install && cd ..

# 3. Локальный тест (кроме Docker)?
npm run build      # Frontend
cd backend && npm start  # Backend в отдельном терминале

# 4. Git готов?
git add .
git commit -m "Production ready"
git push origin main
```

---

## Статус готовности ✅

| Папка | Файлы | Статус |
|-------|-------|--------|
| `/src` | React компоненты | ✅ Готово |
| `/backend` | Node.js API | ✅ Готово |
| `/backend/config` | Database конфиг | ✅ Готово |
| `/backend/routes` | API endpoints | ✅ Готово |
| `/backend/middleware` | Authentication | ✅ Готово |
| `/` | Docker конфиги | ✅ Готово |
| `/` | Документация | ✅ Готово |

**ПРОЕКТ ГОТОВ К PRODUCTION! 🎉**

---

## После деплоя

1. ✅ Проверьте сайт работает
2. ✅ Авторизуйтесь (admin@example.com / admin123)
3. ✅ Создайте новый товар в админ-панели
4. ✅ Проверьте что товар отображается на главной
5. ✅ Проверьте загрузку фото (если добавили)

---

## Экстренная помощь

### ❌ API не подключается
- Проверьте VITE_API_URL
- Проверьте что backend работает
- Проверьте CORS в backend

### ❌ Ошибка БД
- Проверьте DATABASE_URL
- Проверьте что PostgreSQL доступна
- Проверьте init.sql выполнился

### ❌ JWT ошибка
- Убедитесь JWT_SECRET одинаков везде
- Смотрите логи backend

### ❌ 404 ошибка на frontend
- Убедитесь dist папка создана (`npm run build`)
- Проверьте что настроен redirect на index.html

---

## Дальнейшие улучшения

После успешного деплоя можно:

1. Добавить email уведомления
2. Добавить платежную систему (Stripe)
3. Добавить real фото товаров
4. Добавить поиск и фильтры
5. Добавить рейтинги товаров
6. Добавить уведомления в админ-панели
7. Добавить Analytics (Google Analytics)

---

## 📞 Контакты поддержки

Если что-то не работает:

1. Проверьте [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Проверьте [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
3. Посмотрите логи платформы (в Dashboard)
4. Прочитайте ошибку и гуглите :)

**Welcome to production! 🚀**
