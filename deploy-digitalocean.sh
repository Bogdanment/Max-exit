#!/bin/bash

# 🚀 Exit Accessories - DigitalOcean VPS Auto Deploy Script
# Этот скрипт автоматизирует деплой приложения на VPS

set -e  # Выход при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для печати с цветом
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# ==========================================
# КОНФИГУРАЦИЯ
# ==========================================

REPO_DIR="/root/exit"
PROJECT_NAME="exit"
DB_USER="postgres"
DB_DEFAULT_PASSWORD="postgres"

print_info "==================================="
print_info "Exit Accessories - Auto Deploy"
print_info "==================================="

# ==========================================
# Шаг 1: Проверка и обновление системы
# ==========================================

print_info "Шаг 1/8: Обновление системы..."

if ! command -v curl &> /dev/null; then
    apt update
    apt upgrade -y
    apt install -y curl wget git nano ufw
    print_success "Система обновлена"
else
    print_warning "Система уже обновлена"
fi

# ==========================================
# Шаг 2: Установка Docker
# ==========================================

print_info "Шаг 2/8: Проверка Docker..."

if ! command -v docker &> /dev/null; then
    print_info "Установка Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    
    print_info "Установка Docker Compose..."
    COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d'"' -f4)
    curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    print_success "Docker и Docker Compose установлены"
    docker --version
    docker-compose --version
else
    print_success "Docker уже установлен"
    docker --version
fi

# ==========================================
# Шаг 3: Проверка проекта
# ==========================================

print_info "Шаг 3/8: Проверка проекта..."

if [ -d "$REPO_DIR" ]; then
    cd "$REPO_DIR"
    
    if [ -f "docker-compose.prod.yml" ]; then
        print_success "Проект найден в $REPO_DIR"
        ls -la | grep -E "docker-compose|init.sql|package.json"
    else
        print_error "Файл docker-compose.prod.yml не найден!"
        exit 1
    fi
else
    print_warning "Директория $REPO_DIR не найдена. Создание..."
    mkdir -p "$REPO_DIR"
    cd "$REPO_DIR"
fi

# ==========================================
# Шаг 4: Создание .env файла
# ==========================================

print_info "Шаг 4/8: Проверка конфигурации окружения..."

if [ -f ".env" ]; then
    print_warning ".env файл уже существует, пропуск создания"
    cat .env | grep -E "DB_|JWT_|PORT"
else
    print_info "Создание .env файла..."
    
    # Генерируем безопасные пароли
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=" | cut -c1-20)
    JWT_SECRET=$(openssl rand -hex 32)
    
    cat > .env << EOF
# Database Configuration
DB_USER=postgres
DB_PASSWORD=$DB_PASSWORD
DB_NAME=exit_db
DB_PORT=5432

# Backend Configuration
PORT=5000
NODE_ENV=production
JWT_SECRET=$JWT_SECRET

# Frontend Configuration
VITE_API_URL=http://$(hostname -I | awk '{print $1}'):5000/api
EOF
    
    print_success ".env файл создан с безопасными параметрами"
    echo "DB_PASSWORD: $DB_PASSWORD"
    echo "JWT_SECRET: $JWT_SECRET"
fi

# ==========================================
# Шаг 5: Остановка старых контейнеров
# ==========================================

print_info "Шаг 5/8: Проверка старых контейнеров..."

if docker ps -a --format '{{.Names}}' | grep -q 'exit_'; then
    print_warning "Найдены старые контейнеры, остановка..."
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    sleep 2
else
    print_success "Старых контейнеров не найдено"
fi

# ==========================================
# Шаг 6: Запуск приложения
# ==========================================

print_info "Шаг 6/8: Запуск приложения (Docker Compose)..."

docker-compose -f docker-compose.prod.yml build --no-cache 2>&1 | tail -10
docker-compose -f docker-compose.prod.yml up -d

print_info "Ожидание инициализации сервисов (30 сек)..."
sleep 30

print_info "Статус контейнеров:"
docker-compose -f docker-compose.prod.yml ps

# Проверка что контейнеры запущены
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    print_success "Контейнеры запущены успешно"
else
    print_error "Контейнеры не запустились! Проверяйте логи:"
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi

# ==========================================
# Шаг 7: Установка Nginx + SSL
# ==========================================

print_info "Шаг 7/8: Установка Nginx..."

if ! command -v nginx &> /dev/null; then
    apt install -y nginx certbot python3-certbot-nginx
    print_success "Nginx установлен"
else
    print_success "Nginx уже установлен"
fi

# Создание конфигурации Nginx
SERVER_IP=$(hostname -I | awk '{print $1}')

cat > /etc/nginx/sites-available/exit << EOF
server {
    listen 80;
    server_name $SERVER_IP;
    
    client_max_body_size 50M;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location /api {
        proxy_pass http://localhost:5000/api;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    location /uploads {
        proxy_pass http://localhost:5000/uploads;
        expires 30d;
    }
}
EOF

# Активация конфигурации
ln -sf /etc/nginx/sites-available/exit /etc/nginx/sites-enabled/exit
rm -f /etc/nginx/sites-enabled/default

# Проверка синтаксиса и перезагрузка
if nginx -t 2>/dev/null; then
    systemctl restart nginx
    print_success "Nginx настроен и перезагружен"
else
    print_error "Ошибка в конфигурации Nginx!"
    nginx -t
fi

# ==========================================
# Шаг 8: Автозагрузка при перезагрузке
# ==========================================

print_info "Шаг 8/8: Настройка автозагрузки..."

cat > /etc/systemd/system/docker-exit.service << EOF
[Unit]
Description=Docker Exit Accessories Service
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$REPO_DIR
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
Restart=no

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable docker-exit.service
print_success "Системный сервис настроен"

# ==========================================
# Финальные проверки
# ==========================================

print_info "================================================"
print_info "Финальные проверки..."
print_info "================================================"

# Проверка API
print_info "Проверка API..."
if curl -s http://localhost:5000/api | grep -q .; then
    print_success "API доступен ✅"
else
    print_warning "API может быть недоступен (проверьте логи)"
fi

# Проверка Frontend
print_info "Проверка Frontend..."
if curl -s http://localhost:3000 | grep -q "<!DOCTYPE"; then
    print_success "Frontend доступен ✅"
else
    print_warning "Frontend может быть недоступен"
fi

# Информация о логах
print_info "================================================"
print_success "🎉 ДЕПЛОЙ ЗАВЕРШЁН УСПЕШНО!"
print_info "================================================"

echo ""
print_info "📊 ИНФОРМАЦИЯ О СИСТЕМЕ:"
echo "   Приложение:    Exit Accessories"
echo "   Директория:    $REPO_DIR"
echo "   IP адрес:      $SERVER_IP"
echo ""

print_info "🌐 ДОСТУПНЫЕ АДРЕСА:"
echo "   Frontend:      http://$SERVER_IP"
echo "   API:           http://$SERVER_IP:5000/api"
echo "   Admin Panel:   http://$SERVER_IP/admin"
echo ""

print_info "📋 ПОЛЕЗНЫЕ КОМАНДЫ:"
echo "   Логи:          docker-compose -f docker-compose.prod.yml logs -f"
echo "   Перезагрузка:  docker-compose -f docker-compose.prod.yml restart"
echo "   Статус:        docker-compose -f docker-compose.prod.yml ps"
echo "   Обновление:    cd $REPO_DIR && git pull && docker-compose -f docker-compose.prod.yml up -d --build"
echo ""

print_info "🔍 СЛЕДУЮЩИЕ ШАГИ:"
echo "   1. Проверьте приложение в браузере: http://$SERVER_IP"
echo "   2. Проверьте логи: docker-compose -f docker-compose.prod.yml logs -f"
echo "   3. Если есть домен, настройте SSL с помощью: certbot certonly --nginx -d your-domain.com"
echo "   4. Включите firewall: ufw enable"
echo ""

print_success "Готово к использованию! 🚀"
