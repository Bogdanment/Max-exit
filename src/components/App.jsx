import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Header from './Header'
import Hero from './Hero'
import Products from './Products'
import Features from './Features'
import Testimonials from './Testimonials'
import Newsletter from './Newsletter'
import Footer from './Footer'
import Login from './Login'
import Register from './Register'
import Cart from './Cart'
import AdminPanel from './AdminPanel'
import './App.css'

export default function App() {
  const { user, logout, isAdmin } = useAuth()
  const [currentPage, setCurrentPage] = useState('home')
  const [authMode, setAuthMode] = useState('login') // 'login' or 'register'

  const handleLogout = () => {
    logout()
    setCurrentPage('home')
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const handleSwitchAuthMode = (mode) => {
    setAuthMode(mode)
  }

  // Show admin panel if admin is logged in and on admin page
  if (currentPage === 'admin' && user && isAdmin) {
    return (
      <>
        <Header 
          onLoginClick={() => setCurrentPage('login')}
          onLogout={handleLogout}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
        <AdminPanel />
        <Footer />
      </>
    )
  }

  // Redirect non-admin users from admin page
  if (currentPage === 'admin' && (!user || !isAdmin)) {
    setCurrentPage('home')
  }

  // Show auth page if not logged in and trying to access protected routes
  if (currentPage === 'login' && !user) {
    return (
      <>
        <Header 
          onLoginClick={() => setCurrentPage('login')}
          onLogout={handleLogout}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
        {authMode === 'login' ? (
          <Login onSwitchToRegister={() => handleSwitchAuthMode('register')} />
        ) : (
          <Register onSwitchToLogin={() => handleSwitchAuthMode('login')} />
        )}
        <Footer />
      </>
    )
  }

  // Show cart page if user is logged in
  if (currentPage === 'cart' && user) {
    return (
      <>
        <Header 
          onLoginClick={() => setCurrentPage('login')}
          onLogout={handleLogout}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
        <Cart />
        <Footer />
      </>
    )
  }

  // Default: show home page
  return (
    <div className="app">
      <Header 
        onLoginClick={() => handleNavigate('login')}
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      <Hero />
      <Products onAddToCart={() => {}} />
      <Features />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  )
}
