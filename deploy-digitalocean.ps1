# 🚀 Deploy to DigitalOcean VPS - Windows PowerShell Script
# Этот скрипт автоматизирует деплой из Windows

$ErrorActionPreference = "Stop"

# Цвета
$colors = @{
    'info'    = 'Cyan'
    'success' = 'Green'
    'warning' = 'Yellow'
    'error'   = 'Red'
}

function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor $colors['info'] }
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor $colors['success'] }
function Write-Warning { param($msg) Write-Host "⚠️  $msg" -ForegroundColor $colors['warning'] }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor $colors['error'] }

# ==========================================
# КОНФИГУРАЦИЯ
# ==========================================

$VPS_IP = "159.223.20.99"
$VPS_USER = "root"
$PROJECT_SOURCE = "D:\IT\exit"
$VPS_DEST = "/root/exit"

Write-Info "==============================================="
Write-Info "Exit Accessories - Deploy to DigitalOcean VPS"
Write-Info "==============================================="
Write-Info "VPS IP: $VPS_IP"
Write-Info "Источник проекта: $PROJECT_SOURCE"
Write-Info ""

# ==========================================
# Шаг 1: Проверка SSH доступа
# ==========================================

Write-Info "Шаг 1/4: Проверка SSH доступа..."

try {
    ssh -o ConnectTimeout=5 "$VPS_USER@$VPS_IP" "echo 'SSH доступ OK'" | Out-Null
    Write-Success "SSH подключение работает"
} catch {
    Write-Error "Не удаётся подключиться к VPS. Проверьте:"
    Write-Info "  - IP адрес правильный"
    Write-Info "  - VPS запущен"
    Write-Info "  - SSH доступ разрешен (порт 22)"
    Write-Info "  - У вас есть правильный пароль/ключ"
    exit 1
}

# ==========================================
# Шаг 2: Проверка проекта
# ==========================================

Write-Info "Шаг 2/4: Проверка проекта на локальной машине..."

if (!(Test-Path "$PROJECT_SOURCE\docker-compose.prod.yml")) {
    Write-Error "Файл docker-compose.prod.yml не найден в $PROJECT_SOURCE"
    exit 1
}

if (!(Test-Path "$PROJECT_SOURCE\package.json")) {
    Write-Error "Файл package.json не найден в $PROJECT_SOURCE"
    exit 1
}

Write-Success "Проект найден и проверен"
Get-ChildItem -Path $PROJECT_SOURCE -File | Where-Object { $_.Name -match "docker|compose|package|Dockerfile" } | ForEach-Object { Write-Info "  ✓ $_" }

# ==========================================
# Шаг 3: Загрузка файлов на VPS
# ==========================================

Write-Info "Шаг 3/4: Загрузка проекта на VPS (может занять время)..."

# Создание директории на VPS
ssh "$VPS_USER@$VPS_IP" "mkdir -p $VPS_DEST" | Out-Null
Write-Info "  Директория на VPS создана"

# Список исключаемых файлов/папок (не загружаем)
$exclude = @(
    '.git',
    'node_modules',
    'dist',
    '.env',
    'uploads',
    '*.log',
    '.DS_Store'
)

# Загрузка файлов
Write-Info "  Загрузка файлов..."

$excludeArgs = $exclude | ForEach-Object { "--exclude='$_'" }
$cmd = "scp -r $excludeArgs `"$PROJECT_SOURCE\*`" `"$VPS_USER@$VPS_IP``:$VPS_DEST/`""

Invoke-Expression $cmd | Out-Null

Write-Success "Файлы загружены на VPS"

# ==========================================
# Шаг 4: Запуск скрипта развертывания на VPS
# ==========================================

Write-Info "Шаг 4/4: Запуск скрипта развертывания на VPS..."
Write-Warning "Это может занять несколько минут (~5-10 мин), не закрывайте окно!"
Write-Info ""

# Убедимся что скрипт имеет правильные права
ssh "$VPS_USER@$VPS_IP" "chmod +x $VPS_DEST/deploy-digitalocean.sh" | Out-Null

# Запуск скрипта
ssh "$VPS_USER@$VPS_IP" "cd $VPS_DEST && bash deploy-digitalocean.sh"

# Проверка результата
if ($LASTEXITCODE -eq 0) {
    Write-Success "Скрипт развертывания выполнен успешно"
} else {
    Write-Warning "Скрипт завершился с кодом '$LASTEXITCODE'. Проверьте логи на VPS"
}

# ==========================================
# Финальная информация
# ==========================================

Write-Info "================================================"
Write-Success "ДЕПЛОЙ ЗАВЕРШЁН"
Write-Info "================================================"
Write-Info ""

Write-Info "🌐 ВЫ МОЖЕТЕ ЗАЙТИ НА ПРИЛОЖЕНИЕ:"
Write-Info "  URL:        http://$VPS_IP"
Write-Info "  API:        http://$VPS_IP`:5000/api"
Write-Info "  Admin:      http://$VPS_IP/admin"
Write-Info ""

Write-Info "📞 КОМАНДЫ НА VPS (выполняйте через SSH):"
Write-Info "  ssh $VPS_USER@$VPS_IP"
Write-Info ""
Write-Info "  Логи приложения:"
Write-Info "    docker-compose -f /root/exit/docker-compose.prod.yml logs -f"
Write-Info ""
Write-Info "  Статус контейнеров:"
Write-Info "    docker-compose -f /root/exit/docker-compose.prod.yml ps"
Write-Info ""
Write-Info "  Перезагрузка приложения:"
Write-Info "    docker-compose -f /root/exit/docker-compose.prod.yml restart"
Write-Info ""

Write-Warning "⚠️  ПЕРЕД ИСПОЛЬЗОВАНИЕМ:"
Write-Info "  1. Проверьте приложение в браузере"
Write-Info "  2. Проверьте логи на VPS (docker logs)"
Write-Info "  3. Если есть ошибки, проверьте .env соответствует настройкам"
Write-Info "  4. Для SSL сертификата: certbot certonly --nginx -d your-domain.com"
Write-Info ""

Write-Success "Готово! Приложение развернуто на $VPS_IP 🚀"

# Опция для прямого подключения
$connect = Read-Host "Подключиться к VPS сейчас? (y/n)"
if ($connect -eq 'y' -or $connect -eq 'Y') {
    ssh "$VPS_USER@$VPS_IP"
}
