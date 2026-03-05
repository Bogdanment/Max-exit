import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'

export default function Products() {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { products } = useProducts()

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Пожалуйста, войдите в аккаунт чтобы добавлять товары в корзину')
      return
    }
    addToCart(product)
    alert(`${product.name} добавлен в корзину!`)
  }

  return (
    <section id="products" className="products-section">
      <div className="container">
        <div className="products-header">
          <h2>Our Collection</h2>
          <p>Handpicked premium accessories for the modern lifestyle</p>
        </div>
        <div className="grid grid-4">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">{product.icon}</div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-description">{product.description}</div>
                <div className="product-footer">
                  <div className="product-price">${product.price}</div>
                  <button 
                    className="product-add-btn"
                    onClick={() => handleAddToCart(product)}
                    style={{
                      background: user ? 'var(--accent)' : 'var(--text-gray)',
                      cursor: user ? 'pointer' : 'not-allowed',
                      opacity: user ? 1 : 0.6
                    }}
                  >
                    {user ? 'Add' : 'Login'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
