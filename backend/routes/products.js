import express from 'express'
import pool from '../config/database.js'
import { verifyToken, isAdmin } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()

// Получить все товары
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id')
    const products = result.rows.map(p => ({
      ...p,
      price: parseFloat(p.price)
    }))
    res.json(products)
  } catch (err) {
    console.error('Get products error:', err)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// Получить товар по ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id])
    const product = result.rows[0]

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({ ...product, price: parseFloat(product.price) })
  } catch (err) {
    console.error('Get product error:', err)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// Добавить товар (только админ)
router.post('/', verifyToken, isAdmin, upload.single('photo'), async (req, res) => {
  try {
    const { name, price, icon, desc } = req.body
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null

    if (!name || !price || !desc) {
      return res.status(400).json({ error: 'Name, price and description required' })
    }

    const result = await pool.query(
      'INSERT INTO products (name, price, icon, description, photo_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, parseFloat(price), icon || '📦', desc, photoUrl]
    )

    res.status(201).json({ ...result.rows[0], price: parseFloat(result.rows[0].price) })
  } catch (err) {
    console.error('Add product error:', err)
    res.status(500).json({ error: 'Failed to add product' })
  }
})

// Обновить товар (только админ)
router.put('/:id', verifyToken, isAdmin, upload.single('photo'), async (req, res) => {
  try {
    const { name, price, icon, desc } = req.body
    const productId = req.params.id

    // Получить текущий товар
    const current = await pool.query('SELECT * FROM products WHERE id = $1', [productId])
    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : current.rows[0].photo_url

    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, icon = $3, description = $4, photo_url = $5 WHERE id = $6 RETURNING *',
      [name || current.rows[0].name, price !== undefined ? parseFloat(price) : current.rows[0].price, icon || current.rows[0].icon, desc || current.rows[0].description, photoUrl, productId]
    )

    res.json({ ...result.rows[0], price: parseFloat(result.rows[0].price) })
  } catch (err) {
    console.error('Update product error:', err)
    res.status(500).json({ error: 'Failed to update product' })
  }
})

// Удалить товар (только админ)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [req.params.id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({ message: 'Product deleted successfully' })
  } catch (err) {
    console.error('Delete product error:', err)
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

export default router
