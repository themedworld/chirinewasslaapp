import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ImageUpload from './pages/ImageUpload'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Register />} 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <Dashboard setIsAuthenticated={setIsAuthenticated} /> : 
            <Navigate to="/login" replace />} 
        />
        <Route 
          path="/ImageUpload" 
          element={
            isAuthenticated ? 
            <ImageUpload /> : 
            <Navigate to="/ImageUpload" replace />} 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Route pour la réinitialisation du mot de passe */}
        <Route path="/forgot-password" element={<div>Page de réinitialisation du mot de passe</div>} />
        
        {/* Route pour les conditions d'utilisation */}
        <Route path="/terms" element={<div>Conditions d'utilisation</div>} />
        
        {/* Route pour la politique de confidentialité */}
        <Route path="/privacy" element={<div>Politique de confidentialité</div>} />
      </Routes>
    </Router>
  )
}

export default App