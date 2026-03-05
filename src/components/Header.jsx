import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Header({ onLoginClick, onLogout, currentPage, onNavigate }) {
  const { user, isAdmin } = useAuth()
  const { getTotalItems } = useCart()

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => onNavigate('home')}>
            EXIT
          </div>
          <nav className="nav">
            {currentPage !== 'home' && (
              <button 
                onClick={() => onNavigate('home')}
                className="nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '16px', fontWeight: '500' }}
              >
                Home
              </button>
            )}
            {currentPage === 'home' && (
              <>
                <a href="#products">Shop</a>
                <a href="#features">Features</a>
                <a href="#testimonials">Reviews</a>
                <a href="#newsletter">Contact</a>
              </>
            )}
            
            <div className="nav-right">
              {user ? (
                <>
                  <div className="user-info">
                    <span className="user-name">👤 {user.name} {isAdmin && <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>(Admin)</span>}</span>
                  </div>
                  {isAdmin && (
                    <button 
                      onClick={() => onNavigate('admin')}
                      className="admin-btn"
                      style={{ 
                        background: 'var(--accent)', 
                        color: 'white', 
                        border: 'none', 
                        padding: '8px 16px', 
                        borderRadius: '5px', 
                        cursor: 'pointer', 
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      ⚙️ Админ-Панель
                    </button>
                  )}
                  <button 
                    onClick={() => onNavigate('cart')}
                    className="cart-btn"
                  >
                    🛒 {getTotalItems() > 0 && <span className="cart-count">{getTotalItems()}</span>}
                  </button>
                  <button 
                    onClick={onLogout}
                    className="nav-link logout-btn"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)', fontSize: '14px' }}
                  >
                    Выход
                  </button>
                </>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '14px' }}
                >
                  Вход/Регистрация
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
