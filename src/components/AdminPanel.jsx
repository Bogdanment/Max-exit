import { useState } from 'react'
import { useProducts } from '../context/ProductContext'
import '../styles/AdminPanel.css'

export default function AdminPanel() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const [activeTab, setActiveTab] = useState('list')
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    icon: '📦',
    desc: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    }))
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.desc) {
      alert('Пожалуйста, заполните все поля')
      return
    }
    try {
      await addProduct({
        name: formData.name,
        price: parseFloat(formData.price),
        icon: formData.icon,
        description: formData.desc
      })
      setFormData({ name: '', price: '', icon: '📦', desc: '' })
      setActiveTab('list')
      alert('Товар успешно добавлен!')
    } catch (err) {
      alert('Ошибка при добавлении товара: ' + err.message)
    }
  }

  const handleEditProduct = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.desc) {
      alert('Пожалуйста, заполните все поля')
      return
    }
    try {
      await updateProduct(editingId, {
        name: formData.name,
        price: parseFloat(formData.price),
        icon: formData.icon,
        description: formData.desc
      })
      setEditingId(null)
      setFormData({ name: '', price: '', icon: '📦', desc: '' })
      setActiveTab('list')
      alert('Товар успешно обновлён!')
    } catch (err) {
      alert('Ошибка при обновлении товара: ' + err.message)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await deleteProduct(id)
        alert('Товар успешно удалён!')
      } catch (err) {
        alert('Ошибка при удалении товара: ' + err.message)
      }
    }
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setFormData({
      name: product.name,
      price: product.price,
      icon: product.icon,
      desc: product.description
    })
    setActiveTab('form')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setFormData({ name: '', price: '', icon: '📦', desc: '' })
  }

  const emojiList = ['📦', '🎒', '⌚', '🕶️', '💼', '🎧', '🔑', '✒️', '👜', '🧥', '👓', '⛑️']

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Админ-Панель</h1>
          <p>Управление товарами</p>
        </div>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            📋 Список товаров
          </button>
          <button
            className={`admin-tab ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => {
              if (editingId) {
                handleCancelEdit()
              }
              setActiveTab('form')
            }}
          >
            ➕ {editingId ? 'Редактировать' : 'Добавить товар'}
          </button>
        </div>

        {activeTab === 'list' && (
          <div className="admin-products-list">
            <h2>Товары ({products.length})</h2>
            {products.length === 0 ? (
              <p>Нет товаров. Добавьте первый товар!</p>
            ) : (
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Иконка</th>
                    <th>Название</th>
                    <th>Цена</th>
                    <th>Описание</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td className="icon-cell">{product.icon}</td>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>{product.description}</td>
                      <td className="actions-cell">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(product)}
                          title="Редактировать"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Удалить"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'form' && (
          <div className="admin-form-container">
            <h2>{editingId ? 'Редактировать товар' : 'Добавить новый товар'}</h2>
            <form onSubmit={editingId ? handleEditProduct : handleAddProduct} className="admin-form">
              <div className="form-group">
                <label htmlFor="name">Название товара *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Напр. Premium Backpack"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Цена ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Напр. 199"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="icon">Иконка/Emoji</label>
                <div className="emoji-grid">
                  {emojiList.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      className={`emoji-btn ${formData.icon === emoji ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder="Или введите любой emoji"
                  maxLength="2"
                  className="icon-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="desc">Описание *</label>
                <textarea
                  id="desc"
                  name="desc"
                  value={formData.desc}
                  onChange={handleInputChange}
                  placeholder="Описание товара"
                  rows="4"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingId ? '💾 Сохранить изменения' : '➕ Добавить товар'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    ❌ Отмена
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
