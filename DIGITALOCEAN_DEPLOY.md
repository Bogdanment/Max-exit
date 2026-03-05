# 🚀 Деплой на DigitalOcean VPS - Пошаговая инструкция

**VPS IP:** `159.223.20.99`

## 📋 Содержание
1. [Подготовка VPS](#подготовка-vps)
2. [Подключение к VPS](#подключение-к-vps)
3. [Установка Docker](#установка-docker)
4. [Загрузка проекта](#загрузка-проекта)
5. [Настройка окружения](#настройка-окружения)
6. [Запуск приложения](#запуск-приложения)
7. [Настройка Nginx + SSL](#настройка-nginx--ssl)
8. [Автозагрузка при перезагрузке](#автозагрузка-при-перезагрузке)

---

## 📡 Подготовка VPS

### Шаг 1: Первый вход на сервер

Откройте PowerShell и подключитесь к серверу:

```powershell
# Замените root_password на пароль от вашего сервера
ssh root@159.223.20.99
```

Введите пароль когда будет предложено.

### Шаг 2: Обновление системы

```bash
# Обновите список пакетов
apt update && apt upgrade -y

# Установите необходимые утилиты
apt install -y curl wget git nano
```

---

## 🔗 Подключение к VPS

### Вариант 1: Через пароль (текущий способ)

```powershell
ssh root@159.223.20.99
```

### Вариант 2: Через SSH ключи (более безопасно)

```powershell
# На вашей машине (Windows):
ssh-keygen -t rsa -b 4096 -f $env:USERPROFILE\.ssh\exit_vps -N ""

# Скопируйте публичный ключ на сервер:
$key = Get-Content $env:USERPROFILE\.ssh\exit_vps.pub
ssh root@159.223.20.99 "mkdir -p ~/.ssh && echo '$key' >> ~/.ssh/authorized_keys"
```

---

## 🐳 Установка Docker

### Шаг 3: Установите Docker Engine

```bash
# Установите Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Добавьте текущего пользователя в группу docker
usermod -aG docker root

# Установите Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Проверьте установку
docker --version
docker-compose --version
```

---

## 📦 Загрузка проекта

### Вариант 1: Через Git (рекомендуется)

```bash
# Перейдите в домашнюю папку
cd /root

# Клонируйте репозиторий (если есть GitHub)
git clone https://github.com/YOUR_USERNAME/exit-accessories.git exit
cd exit

# Если репозиторий приватный, используйте GitHub token:
git clone https://YOUR_TOKEN@github.com/YOUR_USERNAME/exit-accessories.git exit
```

### Вариант 2: Через SCP (копирование файлов)

```powershell
# На вашей машине (Windows PowerShell)
# Скопируйте весь проект на сервер:
scp -r "D:\IT\exit\*" root@159.223.20.99:/root/exit/

# Или используйте WinSCP (GUI)
```

---

## ⚙️ Настройка окружения

### Шаг 4: Создайте файл .env

**На VPS в папке `/root/exit`:**

```bash
nano .env
```

Вставьте этот текст (новые строки):

```env
# Database
DB_USER=postgres
DB_PASSWORD=your_secure_password_here
DB_NAME=exit_db
DB_PORT=5432

# Backend
PORT=5000
NODE_ENV=production
JWT_SECRET=generate-with-command-below

# Frontend
VITE_API_URL=http://159.223.20.99:5000/api
# или если будет домен:
# VITE_API_URL=https://your-domain.com/api
```

**Генерируйте безопасный JWT_SECRET:**

```bash
# На VPS выполните:
openssl rand -hex 32

# Скопируйте результат и вставьте в файл .env вместо generate-with-command-below
```

**Сохраните файл:** Ctrl+X → Y → Enter

### Шаг 5: Проверьте .env файл

```bash
cat .env
```

---

## 🚀 Запуск приложения

### Шаг 6: Запустите Docker Compose

```bash
# Убедитесь, что вы в папке /root/exit
pwd

# Если нужно перейти:
cd /root/exit

# Запустите сервисы в production режиме:
docker-compose -f docker-compose.prod.yml up -d

# Проверьте что контейнеры запустились:
docker-compose -f docker-compose.prod.yml ps
```

**Ожидаемый результат:**

```
NAME                    STATUS
exit_postgres_prod      Up (healthy)
exit_api_prod           Up
exit_frontend_prod      Up
```

### Шаг 7: Проверьте приложение

```bash
# Проверьте backend
curl http://localhost:5000/api

# Проверьте frontend
curl http://localhost:3000
```

Если видите ответы - приложение запущено! ✅

---

## 🌐 Настройка Nginx + SSL

### Шаг 8: Установите Nginx

```bash
apt install -y nginx certbot python3-certbot-nginx
```

### Шаг 9: Создайте конфигурацию Nginx

```bash
nano /etc/nginx/sites-available/exit
```

Вставьте конфигурацию:

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name 159.223.20.99;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name 159.223.20.99;
    
    # SSL сертификаты (после генерации)
    ssl_certificate /etc/letsencrypt/live/159.223.20.99/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/159.223.20.99/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api {
        proxy_pass http://localhost:5000/api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Сохраните:** Ctrl+X → Y → Enter

### Шаг 10: Активируйте конфигурацию

```bash
# Создайте символическую ссылку
ln -s /etc/nginx/sites-available/exit /etc/nginx/sites-enabled/

# Проверьте синтаксис
nginx -t

# Перезагрузите Nginx
systemctl restart nginx
```

### Шаг 11: Генерируйте SSL сертификат (Let's Encrypt)

```bash
# Если используете IP адрес без домена:
certbot certonly --standalone -d 159.223.20.99

# Если у вас есть домен:
certbot certonly --nginx -d your-domain.com -d www.your-domain.com
```

Следуйте инструкциям certbot.

### Шаг 12: Автоматическое обновление сертификата

```bash
# Проверьте автообновление
systemctl enable certbot.timer
systemctl start certbot.timer

# Проверьте статус
systemctl status certbot.timer
```

---

## ♻️ Автозагрузка при перезагрузке

### Шаг 13: Создайте Systemd сервис

```bash
nano /etc/systemd/system/docker-exit.service
```

Вставьте:

```ini
[Unit]
Description=Docker Exit Accessories Service
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/root/exit
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
Restart=no

[Install]
WantedBy=multi-user.target
```

**Сохраните:** Ctrl+X → Y → Enter

### Шаг 14: Включите автозагрузку

```bash
systemctl daemon-reload
systemctl enable docker-exit.service

# Проверьте статус
systemctl status docker-exit.service

# После перезагрузки проверьте:
systemctl status docker-exit.service
```

---

## 🔍 Полезные команды

```bash
# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f

# Просмотр логов конкретного сервиса
docker-compose -f docker-compose.prod.yml logs -f api
docker-compose -f docker-compose.prod.yml logs -f frontend

# Перезагрузка контейнеров
docker-compose -f docker-compose.prod.yml restart

# Обновление кода из Git
cd /root/exit && git pull && docker-compose -f docker-compose.prod.yml up -d

# Очистка старых образов
docker system prune -a

# Проверка использования диска
df -h

# Проверка использования памяти
free -h
```

---

## 🐛 Цифровое выбранное?

### Проблема: Контейнер не запускается

```bash
# Проверьте детальные логи
docker-compose -f docker-compose.prod.yml logs api
docker-compose -f docker-compose.prod.yml logs postgres

# Пересоберите образы
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Проблема: Nginx выдаёт ошибку 502

```bash
# Проверьте что backend доступен
curl http://localhost:5000/api

# Проверьте синтаксис Nginx
nginx -t

# Перезагрузите Nginx
systemctl restart nginx
```

### Проблема: База данных не инициализируется

```bash
# Проверьте логи PostgreSQL
docker-compose -f docker-compose.prod.yml logs postgres

# Удалите томы и заново инициализируйте
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📝 Финальная проверка

После завершения всех шагов:

1. **Проверьте доступность:**
   ```powershell
   # На вашей машине
   curl http://159.223.20.99
   ```

2. **Проверьте HTTPS:**
   ```powershell
   curl https://159.223.20.99
   ```

3. **Проверьте API:**
   ```powershell
   curl http://159.223.20.99:5000/api
   ```

4. **Проверьте логи на VPS:**
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f
   ```

---

## ✅ Готово!

Ваше приложение успешно развернуто на DigitalOcean VPS! 🎉

**Адрес:** `http://159.223.20.99` или `https://159.223.20.99`

**API:** `http://159.223.20.99:5000/api`

---

## 🔒 Рекомендации безопасности

1. **Измените пароль root:**
   ```bash
   passwd
   ```

2. **Установите Firewall:**
   ```bash
   apt install -y ufw
   ufw allow 22/tcp    # SSH
   ufw allow 80/tcp    # HTTP
   ufw allow 443/tcp   # HTTPS
   ufw enable
   ```

3. **Используйте SSH ключи вместо пароля**

4. **Регулярно обновляйте систему:**
   ```bash
   apt update && apt upgrade -y
   ```

5. **Используйте сложный JWT_SECRET** (минимум 32 символа)

---

## 📞 Контакты и помощь

Если возникнут проблемы, проверьте:
- Логи приложения: `docker-compose logs -f`
- Статус контейнеров: `docker-compose ps`
- Настройки Nginx: `nginx -t`
- Let's Encrypt сертификат: `certbot certificates`
