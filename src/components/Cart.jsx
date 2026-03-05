import { useCart } from '../context/CartContext'
import './Cart.css'

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart()

  if (cartItems.length === 0) {
    return (
      <section className="cart-section">
        <div className="container">
          <h2>Корзина</h2>
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h3>Ваша корзина пуста</h3>
            <p>Начните добавлять товары и вернитесь сюда</p>
            <a href="#products" className="btn-primary">Перейти в магазин</a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="cart-section">
      <div className="container">
        <h2>Корзина ({getTotalItems()} товаров)</h2>
        
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">{item.icon}</div>
                
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-description">{item.desc}</p>
                  <div className="item-price">{item.price}</div>
                </div>

                <div className="item-quantity">
                  <label>Кол-во:</label>
                  <div className="quantity-control">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="qty-btn"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                  title="Удалить товар"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-box">
              <h3>Итого</h3>
              
              <div className="summary-row">
                <span>Товаров:</span>
                <span>{getTotalItems()}</span>
              </div>
              
              <div className="summary-row">
                <span>Подитог:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Доставка:</span>
                <span>FREE</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Всего к оплате:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>

              <button className="btn-primary checkout-btn">
                Оформить заказ
              </button>

              <button 
                onClick={clearCart}
                className="btn-secondary clear-btn"
              >
                Очистить корзину
              </button>

              <a href="#products" className="continue-shopping">
                ← Продолжить покупки
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
