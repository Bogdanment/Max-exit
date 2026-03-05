export default function Newsletter() {
  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thanks for subscribing!')
  }

  return (
    <section id="newsletter" className="newsletter">
      <div className="container">
        <h2>Join Our Community</h2>
        <p>Get exclusive offers and updates directly to your inbox</p>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            required 
          />
          <button type="submit" className="btn-primary">Subscribe</button>
        </form>
      </div>
    </section>
  )
}
