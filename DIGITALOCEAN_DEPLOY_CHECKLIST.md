# ✅ Быстрый чек-лист деплоя на DigitalOcean VPS

**Статус:** Начало деплоя на IP `159.223.20.99`

---

## 📋 Предварительные проверки

- [ ] SSH доступ к серверу активирован
- [ ] Получен пароль/ключ доступа к VPS
- [ ] PowerShell / Terminal открыт и готов
- [ ] Git репозиторий содержит все необходимые файлы

---

## 🔧 Этап 1: Подготовка VPS (15 мин)

```bash
# Команды выполнять на VPS сервере

ssh root@159.223.20.99

# Обновление системы
apt update && apt upgrade -y && apt install -y curl wget git nano
```

- [ ] Система обновлена
- [ ] Утилиты установлены

---

## 🐳 Этап 2: Установка Docker (10 мин)

```bash
# На VPS

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

# Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose

# Проверка
docker --version && docker-compose --version
```

- [ ] Docker установлен (`docker --version`)
- [ ] Docker Compose установлен (`docker-compose --version`)

---

## 📦 Этап 3: Загрузка проекта (5 мин)

**Вариант A: Через Git (если есть GitHub)**

```bash
cd /root
git clone https://github.com/YOUR_USERNAME/exit-accessories.git exit
cd exit
```

**Вариант B: Через SCP (если нет GitHub)**

```powershell
# На вашей машине (Windows PowerShell)
scp -r "D:\IT\exit\*" root@159.223.20.99:/root/exit/
```

- [ ] Проект загружен на VPS
- [ ] Проверка: `ls -la /root/exit/` (должны быть docker-compose.prod.yml и т.д.)

---

## ⚙️ Этап 4: Настройка окружения (5 мин)

**На VPS:**

```bash
cd /root/exit

# Создайте .env файл
cat > .env << 'EOF'
DB_USER=postgres
DB_PASSWORD=ExitAccessories123!
DB_NAME=exit_db
DB_PORT=5432

PORT=5000
NODE_ENV=production
JWT_SECRET=generated-secret-here

VITE_API_URL=http://159.223.20.99:5000/api
EOF

# Генерируйте безопасный JWT_SECRET
openssl rand -hex 32

# Отредактируйте .env и вставьте результат
nano .env
```

- [ ] Файл `.env` создан
- [ ] JWT_SECRET вставлен (min 32 символа)
- [ ] DB_PASSWORD изменён на безопасный

---

## 🚀 Этап 5: Запуск приложения (10 мин)

**На VPS:**

```bash
cd /root/exit

# Запуск Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Ждите 30-60 сек инициализации БД

# Проверка статуса контейнеров
docker-compose -f docker-compose.prod.yml ps

# Проверка логов
  docker-compose -f docker-compose.prod.yml logs -f
```

**Ожидаемый результат:**

```
NAME                    STATUS
exit_postgres_prod      Up (healthy)  ✅
exit_api_prod           Up            ✅
exit_frontend_prod      Up            ✅
```

- [ ] Все три контейнера запущены (`ps` покажет "Up")
- [ ] База данных инициализирована (`logs` покажет инициализацию)
- [ ] API доступен: `curl http://localhost:5000/api`

---

## 🌐 Этап 6: Настройка Nginx + SSL (20 мин)

**На VPS:**

```bash
# Установка Nginx и Certbot
apt install -y nginx certbot python3-certbot-nginx

# Создание конфигурации
sudo cat > /etc/nginx/sites-available/exit << 'EOF'
server {
    listen 80;
    server_name 159.223.20.99;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:5000/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Активация
ln -s /etc/nginx/sites-available/exit /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

- [ ] Nginx установлен
- [ ] Конфигурация создана
- [ ] Nginx перезагружен (`nginx -t` без ошибок)

**Генерирование SSL (если нужен HTTPS):**

```bash
# Let's Encrypt сертификат
certbot certonly --standalone -d 159.223.20.99

# Или если есть домен
certbot certonly --nginx -d your-domain.com
```

- [ ] SSL сертификат сгенерирован (опционально)

---

## ♻️ Этап 7: Автозагрузка при перезагрузке (5 мин)

**На VPS:**

```bash
cat > /etc/systemd/system/docker-exit.service << 'EOF'
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
EOF

systemctl daemon-reload
systemctl enable docker-exit.service
systemctl status docker-exit.service
```

- [ ] Systemd сервис создан
- [ ] Автозагрузка включена

---

## 🔒 Этап 8: Безопасность (10 мин)

**На VPS:**

```bash
# Измените пароль root
passwd

# Firewall
apt install -y ufw
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable

# Проверка
ufw status
```

- [ ] Пароль root изменён
- [ ] Firewall включен (открыты 22, 80, 443)

---

## ✅ Итоговая проверка

**На вашей машине (Windows PowerShell):**

```powershell
# Проверка доступности
curl http://159.223.20.99
# Должна вернуть HTML

# Проверка API
curl http://159.223.20.99:5000/api
# Должна вернуть JSON ответ
```

**На VPS:**

```bash
# Финальная проверка статуса
docker-compose -f docker-compose.prod.yml ps

# Проверка логов
docker-compose -f docker-compose.prod.yml logs -f
```

- [ ] Frontend доступен на `http://159.223.20.99`
- [ ] API доступен на `http://159.223.20.99:5000/api`
- [ ] Все контейнеры в статусе "Up"
- [ ] Логи не содержат ошибок

---

## 🎉 Готово!

✅ **Приложение успешно развернуто на DigitalOcean VPS!**

- **URL приложения:** http://159.223.20.99 
- **API:** http://159.223.20.99:5000/api
- **Admin панель:** http://159.223.20.99/admin

---

## 🆘 Если что-то пошло не так

### Контейнер не запускается?
```bash
docker-compose -f docker-compose.prod.yml logs api
docker-compose -f docker-compose.prod.yml logs postgres
```

### Nginx выдаёт 502?
```bash
curl http://localhost:3000
curl http://localhost:5000/api
nginx -t
systemctl restart nginx
```

### БД не инициализируется?
```bash
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📞 Дополнительные команды

```bash
# Просмотр логов в реальном времени
docker-compose -f docker-compose.prod.yml logs -f

# Перезагрузка контейнеров
docker-compose -f docker-compose.prod.yml restart

# Обновление из Git
cd /root/exit && git pull && docker-compose -f docker-compose.prod.yml up -d --build

# Использование диска
df -h

# Использование памяти
free -h

# Список образов
docker images

# Удаление старых образов
docker system prune -a
```

---

**Документация:** Полные инструкции в [DIGITALOCEAN_DEPLOY.md](./DIGITALOCEAN_DEPLOY.md)
