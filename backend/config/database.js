import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// Для production используем DATABASE_URL, для локального - отдельные переменные
const isProduction = process.env.NODE_ENV === 'production'

const pool = isProduction
  ? new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : new pg.Pool({
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'exit_db'
    })

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

export default pool
