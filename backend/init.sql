-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы товаров
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  icon VARCHAR(10),
  description TEXT,
  photo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы корзины
CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- Создание таблицы заказов
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы элементов заказа
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_id ON products(id);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Вставка демо админа
INSERT INTO users (email, password_hash, name, role) 
VALUES ('admin@example.com', '$2b$10$n9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWDeT1CDEtP6lLPG', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Вставка демо пользователя
INSERT INTO users (email, password_hash, name, role) 
VALUES ('test@example.com', '$2b$10$n9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWDeT1CDEtP6lLPG', 'Test User', 'user')
ON CONFLICT (email) DO NOTHING;

-- Вставка товаров по умолчанию
INSERT INTO products (name, price, icon, description) 
VALUES 
('Premium Backpack', 199.00, '🎒', 'Water-resistant explorer pack'),
('Leather Belt', 89.00, '⌚', 'Italian leather craftsmanship'),
('Sunglasses', 299.00, '🕶️', 'UV protection with style'),
('Watch', 449.00, '⌚', 'Swiss precision timepiece'),
('Wallet', 129.00, '💼', 'RFID protected leather'),
('Headphones', 399.00, '🎧', 'Noise-canceling audio'),
('Keychain', 49.00, '🔑', 'Titanium alloy design'),
('Pen Set', 169.00, '✒️', 'Premium writing instruments')
ON CONFLICT DO NOTHING;
