import React, { createContext, useState, useEffect, useContext } from 'react'
import { api } from '../services/api'

export const ProductContext = createContext()

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Загрузить товары при монтировании
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setError(null)
        const data = await api.products.getAll()
        setProducts(data)
      } catch (err) {
        console.error('Failed to load products:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  const addProduct = async (product) => {
    try {
      setError(null)
      const newProduct = await api.products.create(product)
      setProducts([...products, newProduct])
      return newProduct
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateProduct = async (id, updatedProduct) => {
    try {
      setError(null)
      const updated = await api.products.update(id, updatedProduct)
      setProducts(products.map(p => p.id === id ? updated : p))
      return updated
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteProduct = async (id) => {
    try {
      setError(null)
      await api.products.delete(id)
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const getProductById = (id) => {
    return products.find(p => p.id === id)
  }

  const value = {
    products,
    isLoading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider')
  }
  return context
}
