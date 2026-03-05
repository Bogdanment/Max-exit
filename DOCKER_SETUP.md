# Exit Accessories - Docker Setup

## 🚀 Быстрый старт

### Требования:
- Docker
- Docker Compose

### Запуск приложения:

```bash
docker-compose up
```

Приложение будет доступно по адресам:
- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:5000/api
- **PostgreSQL:** localhost:5432

### Учётные данные по умолчанию:

**Администратор:**
- Email: `admin@example.com`
- Пароль: `admin123`

**Обычный пользователь:**
- Email: `test@example.com`
- Пароль: `password123`

---

## 📁 Структура проекта

```
exit/
├── src/                       # React frontend
│   ├── components/           # React компоненты
│   ├── context/             # Context для состояния
│   ├── services/            # API сервисы
│   └── styles/              # CSS стили
├── backend/                 # Node.js + Express API
│   ├── routes/              # API маршруты
│   ├── middleware/          # Middleware (auth и т.д.)
│   ├── config/              # Конфигурация БД
│   ├── uploads/             # Загруженные фотографии
│   ├── server.js            # Основной сервер
│   ├── package.json
│   ├── Dockerfile
│   └── init.sql             # SQL скрипт инициализации
├── docker-compose.yml       # Docker Compose конфиг
├── Dockerfile.frontend      # Frontend Docker образ
└── .env                     # Переменные окружения
```

---

## 🗄️ База данных

### Таблицы:

1. **users** - Пользователи
   - id (PK)
   - email (UNIQUE)
   - password_hash
   - name
   - role (user / admin)
   - created_at
   - updated_at

2. **products** - Товары
   - id (PK)
   - name
   - price
   - icon
   - description
   - photo_url
   - created_at
   - updated_at

3. **cart_items** - Элементы корзины
   - id (PK)
   - user_id (FK)
   - product_id (FK)
   - quantity

4. **orders** - Заказы
   - id (PK)
   - user_id (FK)
   - total_price
   - status
   - created_at

5. **order_items** - Элементы заказа
   - id (PK)
   - order_id (FK)
   - product_id (FK)
   - quantity
   - price

---

## 🔌 API Endpoints

### Аутентификация

**Регистрация:**
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**Вход:**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Получить текущего пользователя:**
```
GET /api/auth/me
Authorization: Bearer <token>
```

### Товары

**Получить все товары:**
```
GET /api/products
```

**Получить товар по ID:**
```
GET /api/products/:id
```

**Добавить товар (только админ):**
```
POST /api/products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Product Name",
  "price": 99.99,
  "icon": "🎒",
  "description": "Product description"
}
```

**Обновить товар (только админ):**
```
PUT /api/products/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 129.99,
  "icon": "📦",
  "description": "Updated description"
}
```

**Удалить товар (только админ):**
```
DELETE /api/products/:id
Authorization: Bearer <admin-token>
```

---

## 🛠️ Разработка

### Локальный запуск без Docker:

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
npm install
npm run dev
```

### Остановка контейнеров:

```bash
docker-compose down
```

### Полная очистка (включая БД):

```bash
docker-compose down -v
```

---

## 📝 Переменные окружения

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=exit_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

---

## 🔒 Безопасность

⚠️ **ВАЖНО:** Для production:

1. Измените `JWT_SECRET` в `.env`
2. Измените пароль PostgreSQL
3. Используйте HTTPS
4. Установите правильные CORS правила
5. Добавьте rate limiting
6. Используйте переменные окружения для всех чувствительных данных

---

## 📚 Полезные команды

```bash
# Просмотр логов контейнеров
docker-compose logs -f

# Просмотр логов конкретного сервиса
docker-compose logs -f api
docker-compose logs -f postgres

# Вход в контейнер
docker-compose exec api sh
docker-compose exec postgres psql -U postgres exit_db

# Пересборка образов
docker-compose build

# Запуск с пересборкой
docker-compose up --build
```

---

## 🚀 Деплой

### Netlify (Frontend):
```bash
npm run build
```

### Heroku / Railway (Backend):
1. Создайте новый проект
2. Подключите GitHub репозиторий
3. Установите переменные окружения
4. Разверните

### Docker Hub:
```bash
docker build -t your-username/exit-api ./backend
docker push your-username/exit-api
```

---

## ❓ Поиск и исправление проблем

### PostgreSQL не подключается:
```bash
docker-compose logs postgres
```

### API недоступен:
```bash
docker-compose logs api
```

### Очистка данных:
```bash
docker-compose down -v
docker-compose up
```
