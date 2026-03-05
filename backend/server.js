import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from './config/database.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'

dotenv.config()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Статические файлы для загруженных фото
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' })
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

// Start server
const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()')
    console.log('✅ Database connected')

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📍 API: http://localhost:${PORT}/api`)
    })
  } catch (err) {
    console.error('❌ Database connection error:', err)
    process.exit(1)
  }
}

startServer()
