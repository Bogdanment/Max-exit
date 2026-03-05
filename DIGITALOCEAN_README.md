# 🚀 DigitalOcean VPS Deployment - Готово к деплою!

**Status:** ✅ Приложение готово к деплою на DigitalOcean VPS

**VPS IP:** `159.223.20.99`

---

## 📁 Созданные файлы для деплоя

| Файл | Назначение |
|------|-----------|
| **DIGITALOCEAN_DEPLOY.md** | 📖 Подробная инструкция (45+ шагов) |
| **DIGITALOCEAN_DEPLOY_CHECKLIST.md** | ✅ Быстрый чек-лист (8 этапов) |
| **deploy-digitalocean.sh** | 🤖 Автоматизированный скрипт для VPS |
| **deploy-digitalocean.ps1** | 🪟 Скрипт для запуска с Windows |

---

## ⚡ БЫСТРЫЙ СТАРТ (3 минуты)

### Вариант 1️⃣: Полностью автоматический (РЕКОМЕНДУЕТСЯ)

**Шаг 1:** Откройте PowerShell и перейдите в папку проекта:

```powershell
cd "D:\IT\exit"
```

**Шаг 2:** Запустите скрипт деплоя:

```powershell
powershell -ExecutionPolicy Bypass -File deploy-digitalocean.ps1
```

**Шаг 3:** Скрипт:
- ✅ Проверит SSH доступ к VPS
- ✅ Загрузит весь проект на сервер
- ✅ Установит Docker и Docker Compose
- ✅ Создаст конфигурацию (.env)
- ✅ Запустит приложение
- ✅ Настроит Nginx
- ✅ Включит автозагрузку при перезагрузке

**Шаг 4:** Дождитесь завершения (~5-10 минут)

**Готово! 🎉** Приложение доступно на `http://159.223.20.99`

---

### Вариант 2️⃣: Ручной деплой по чек-листу

Если скрипт не подходит, используйте файл **DIGITALOCEAN_DEPLOY_CHECKLIST.md**:

```bash
# На VPS выполняйте комманды из чек-листа
ssh root@159.223.20.99

# Затем следуйте инструкциям в DIGITALOCEAN_DEPLOY_CHECKLIST.md
```

---

### Вариант 3️⃣: Полная документация

Для глубокого понимания всех деталей читайте **DIGITALOCEAN_DEPLOY.md** (60+ страниц)

---

## 🔑 Критические параметры

Скрипты автоматически:
- ✅ Генерируют безопасный **JWT_SECRET** (32+ символа)
- ✅ Создают безопасный **DB_PASSWORD**
- ✅ Устанавливают правильный **VITE_API_URL**
- ✅ Настраивают все переменные окружения

**Вы не должны ничего менять!** Скрипты всё сделают за вас.

---

## 📊 Что произойдет после деплоя

```
DigitalOcean VPS (159.223.20.99)
├── Docker Container: PostgreSQL
│   └── Database: exit_db
├── Docker Container: Node.js API
│   └── URL: http://159.223.20.99:5000/api
├── Docker Container: React Frontend
│   └── URL: http://159.223.20.99
└── Nginx Reverse Proxy (порты 80, 443)
```

---

## ✅ Проверка после деплоя

**На вашей машине (Windows):**

```powershell
# Проверка доступности приложения
curl http://159.223.20.99

# Проверка API
curl http://159.223.20.99:5000/api

# Соединение с VPS (если нужно)
ssh root@159.223.20.99
```

**На VPS:**

```bash
# Просмотр статуса контейнеров
docker-compose -f /root/exit/docker-compose.prod.yml ps

# Просмотр логов в реальном времени
docker-compose -f /root/exit/docker-compose.prod.yml logs -f

# Просмотр логов конкретного сервиса
docker-compose -f /root/exit/docker-compose.prod.yml logs -f api
docker-compose -f /root/exit/docker-compose.prod.yml logs -f postgres
```

---

## 🆘 Что делать если что-то не работает

### ❌ Проблема: PowerShell скрипт не запускается

```powershell
# Убедитесь что вы находитесь в папке проекта
cd "D:\IT\exit"

# Разрешите выполнение скриптов (одноразово)
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# Затем запустите скрипт
.\deploy-digitalocean.ps1
```

### ❌ Проблема: SSH не подключается

```powershell
# Проверьте что VPS включен и доступен
ping 159.223.20.99

# Попробуйте подключиться с явным указанием пользователя
ssh -l root 159.223.20.99

# Введите пароль от VPS
```

### ❌ Проблема: Контейнеры не запускаются

```bash
# На VPS проверьте логи
docker-compose -f /root/exit/docker-compose.prod.yml logs

# Проверьте .env файл
cat /root/exit/.env

# Перезагрузите контейнеры
docker-compose -f /root/exit/docker-compose.prod.yml down
docker-compose -f /root/exit/docker-compose.prod.yml up -d
```

### ❌ Проблема: API не доступен

```bash
# На VPS проверьте что сервис запущен
docker-compose -f /root/exit/docker-compose.prod.yml ps api

# Проверьте логи API
docker-compose -f /root/exit/docker-compose.prod.yml logs api

# Проверьте что порт открыт
netstat -tlnp | grep 5000
```

---

## 📞 Полезные команды на VPS

```bash
# Подключение к VPS
ssh root@159.223.20.99

# Перейти в папку проекта
cd /root/exit

# Просмотр статуса контейнеров
docker-compose -f docker-compose.prod.yml ps

# Просмотр логов в реальном времени
docker-compose -f docker-compose.prod.yml logs -f

# Перезагрузка приложения
docker-compose -f docker-compose.prod.yml restart

# Остановка приложения
docker-compose -f docker-compose.prod.yml down

# Запуск приложения
docker-compose -f docker-compose.prod.yml up -d

# Обновление кода из Git
git pull
docker-compose -f docker-compose.prod.yml up -d --build

# Просмотр использования дискового пространства
df -h

# Просмотр использования памяти и CPU
top

# Просмотр IP адреса сервера
hostname -I

# Просмотр версии Docker
docker --version && docker-compose --version
```

---

## 🔒 Рекомендации безопасности

**После первого деплоя:**

1. ✅ Измените пароль root:
```bash
passwd
```

2. ✅ Включите Firewall:
```bash
apt install -y ufw
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

3. ✅ Установите SSL сертификат:
```bash
certbot certonly --standalone -d 159.223.20.99
# или если у вас есть домен
certbot certonly --nginx -d your-domain.com
```

4. ✅ Настройте автообновление сертификата:
```bash
systemctl enable certbot.timer
systemctl start certbot.timer
```

5. ✅ Используйте SSH ключи вместо пароля

---

## 📈 Мониторинг приложения

### Просмотр логов в реальном времени:

```bash
docker-compose -f /root/exit/docker-compose.prod.yml logs -f
```

### Периодическая проверка здоровья:

```bash
# На VPS
/root/exit/health-check.sh

# Или вручную
curl http://localhost:5000/api
curl http://localhost:3000
```

### Использование дискового пространства:

```bash
# Полный анализ
du -sh /root/exit/*

# Размер контейнеров
docker system df

# Очистка старых образов
docker system prune -a
```

---

## 🔄 Обновление приложения

Когда вы обновите код в локальном репозитории:

```bash
# На VPS
cd /root/exit

# Скачайте новый код
git pull

# Пересоберите и запустите
docker-compose -f docker-compose.prod.yml up -d --build

# Проверьте статус
docker-compose -f docker-compose.prod.yml ps

# Просмотрите логи
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 📱 Доступ к приложению

После успешного деплоя:

| Что | URL |
|-----|-----|
| **Frontend** | http://159.223.20.99 |
| **API** | http://159.223.20.99:5000/api |
| **Admin Panel** | http://159.223.20.99/admin |

---

## 💾 Резервное копирование БД

```bash
# Экспорт БД
docker-compose -f /root/exit/docker-compose.prod.yml exec postgres pg_dump -U postgres exit_db > /root/backup.sql

# Импорт БД
docker-compose -f /root/exit/docker-compose.prod.yml exec -T postgres psql -U postgres exit_db < /root/backup.sql

# Скачать резервную копию на локальную машину (PowerShell)
scp root@159.223.20.99:/root/backup.sql $env:USERPROFILE\Desktop\
```

---

## 📚 Дополнительные ресурсы

- **[DIGITALOCEAN_DEPLOY.md](./DIGITALOCEAN_DEPLOY.md)** - Подробная инструкция
- **[DIGITALOCEAN_DEPLOY_CHECKLIST.md](./DIGITALOCEAN_DEPLOY_CHECKLIST.md)** - Быстрый чек-лист
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Другие варианты деплоя
- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Быстрые варианты

---

## 🎯 Статус деплоя

✅ **Готово к деплою на DigitalOcean VPS**

**IP:** `159.223.20.99`

**Вариант деплоя:** Docker + Docker Compose + Nginx + PostgreSQL

**Время развертывания:** ~10 минут (автоматилось 95%)

**Поддерживаемые ОС на VPS:** Ubuntu 20.04+, Debian 11+

---

## 🚀 Начните деплой прямо сейчас!

### Windows PowerShell:
```powershell
cd "D:\IT\exit"
powershell -ExecutionPolicy Bypass -File deploy-digitalocean.ps1
```

### Linux / Mac:
```bash
cd /path/to/exit
chmod +x deploy-digitalocean.sh
ssh root@159.223.20.99 "curl -sSL https://raw.githubusercontent.com/YOUR_REPO/deploy-digitalocean.sh | bash"
```

---

**Удачи с деплоем! 🎉**

Если есть вопросы, смотрите полную документацию в DIGITALOCEAN_DEPLOY.md или обращайтесь в поддержку.
