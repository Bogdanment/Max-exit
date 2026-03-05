export default function Testimonials() {
  const testimonials = [
    { content: 'Exceptional quality and attention to detail. Worth every penny!', author: 'Sarah Johnson', title: 'Fashion Designer' },
    { content: 'The best accessories I\'ve ever owned. Highly recommend to everyone.', author: 'Michael Chen', title: 'Business Executive' },
    { content: 'Outstanding customer service and premium products. Perfect!', author: 'Emma Rodriguez', title: 'Travel Blogger' },
  ]

  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        <h2>What Our Customers Say</h2>
        <div className="grid grid-3">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="testimonial-content">"{testimonial.content}"</div>
              <div className="testimonial-author">— {testimonial.author}</div>
              <div className="testimonial-title">{testimonial.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
