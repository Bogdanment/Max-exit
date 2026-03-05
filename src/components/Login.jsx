import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Login({ onSwitchToRegister }) {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      login(formData.email, formData.password)
      alert('Вход успешен!')
      setFormData({ email: '', password: '' })
    } catch (err) {
      setError(err.message || 'Ошибка при входе')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Вход в аккаунт</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Загрузка...' : 'Войти'}
          </button>
        </form>

        <div className="auth-switch">
          <p>Нет аккаунта? <button onClick={onSwitchToRegister} className="switch-btn">Зарегистрируйтесь</button></p>
        </div>

        <div className="demo-credentials">
          <p><strong>Тестовый аккаунт:</strong></p>
          <p>Email: test@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  )
}
