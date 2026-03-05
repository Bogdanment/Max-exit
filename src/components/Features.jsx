export default function Features() {
  const features = [
    { icon: '✈️', title: 'Fast Shipping', desc: 'Worldwide delivery in 5-7 business days' },
    { icon: '🔒', title: 'Secure Payment', desc: 'SSL encrypted transactions' },
    { icon: '↩️', title: '30-Day Returns', desc: 'Risk-free shopping experience' },
    { icon: '💚', title: 'Premium Quality', desc: 'Luxury materials handpicked' },
    { icon: '👥', title: '24/7 Support', desc: 'Dedicated customer service' },
    { icon: '🌱', title: 'Eco-Friendly', desc: 'Sustainable packaging' },
  ]

  return (
    <section id="features" className="features">
      <div className="container">
        <h2>Why Choose Exit</h2>
        <div className="grid grid-3">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-item">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
