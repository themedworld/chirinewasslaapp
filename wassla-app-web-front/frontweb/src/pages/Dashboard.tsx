import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaEnvelope, FaCalendarAlt, FaMapMarkerAlt, FaCamera, FaSignOutAlt, FaEdit, FaCog } from 'react-icons/fa'
import { FiUsers, FiMessageSquare, FiBell, FiActivity } from 'react-icons/fi'
import SocialHeader from '../components/headers'
import type { User } from '../types/authTypes'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../Styles/Dashboard.css'

interface DashboardProps {
  setIsAuthenticated: (value: boolean) => void
}

const Dashboard = ({ setIsAuthenticated }: DashboardProps) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState({
    posts: 42,
    friends: 128,
    likes: 1024,
    comments: 256
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      navigate('/login')
    } else {
      const userData = JSON.parse(storedUser)
      setUser(userData)
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    navigate('/login')
  }

  const getDefaultProfilePhoto = () => {
    return user?.gender === 'female' 
      ? '/src/assets/womenprofile.png' 
      : '/src/assets/manprofile.png'
  }

  if (!user) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <h4 className="text-muted">Chargement du tableau de bord...</h4>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <SocialHeader />
      
      {/* Main Content */}
      <main className="container-fluid py-4">
        <div className="row g-4">
          
          {/* Left Sidebar - Profil */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                {/* Photo de profil avec overlay */}
                <div className="position-relative mb-4">
                  <div className="rounded-circle overflow-hidden mx-auto" style={{ width: '150px', height: '150px' }}>
                    <img 
                      src={user.profilePicture || getDefaultProfilePhoto()} 
                      alt="Profil" 
                      className="w-100 h-100 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getDefaultProfilePhoto();
                      }}
                    />
                  </div>
                  
                  {/* Bouton modifier photo */}
                  <button 
                    className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ 
                      width: '40px', 
                      height: '40px',
                      transform: 'translate(-25%, -25%)'
                    }}
                    onClick={() => navigate('/upload')}
                  >
                    <FaCamera />
                  </button>
                </div>
                
                {/* Infos utilisateur */}
                <div className="text-center mb-4">
                  <h3 className="fw-bold mb-2">{user.name}</h3>
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                    {user.role || 'Membre Premium'}
                  </span>
                </div>
                
                {/* Infos détaillées */}
                <div className="list-group list-group-flush">
                  <div className="list-group-item border-0 bg-transparent px-0 py-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                        <FaEnvelope className="text-primary" />
                      </div>
                      <div>
                        <small className="text-muted">Email</small>
                        <div className="fw-medium">{user.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  {user.gender && (
                    <div className="list-group-item border-0 bg-transparent px-0 py-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                          <FaUser className="text-primary" />
                        </div>
                        <div>
                          <small className="text-muted">Genre</small>
                          <div className="fw-medium">
                            {user.gender === 'male' ? 'Homme' : 'Femme'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Ajouter plus d'informations si disponibles */}
                  <div className="list-group-item border-0 bg-transparent px-0 py-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                        <FaCalendarAlt className="text-primary" />
                      </div>
                      <div>
                        <small className="text-muted">Membre depuis</small>
                        <div className="fw-medium">Janvier 2024</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Boutons d'action */}
                <div className="d-grid gap-2 mt-4">
                  <button 
                    className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2"
                    onClick={() => navigate('/profile/edit')}
                  >
                    <FaEdit />
                    Modifier le profil
                  </button>
                  
                  <button 
                    className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
                    onClick={() => navigate('/settings')}
                  >
                    <FaCog />
                    Paramètres
                  </button>
                  
                  <button 
                    className="btn btn-danger d-flex align-items-center justify-content-center gap-2 mt-3"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />
                    Se déconnecter
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="col-lg-6">
            {/* Statistiques */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <FiActivity className="text-primary fs-4" />
                  </div>
                  <h4 className="fw-bold">{stats.posts}</h4>
                  <p className="text-muted mb-0">Publications</p>
                </div>
              </div>
              
              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm text-center p-4">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <FiUsers className="text-success fs-4" />
                  </div>
                  <h4 className="fw-bold">{stats.friends}</h4>
                  <p className="text-muted mb-0">Amis</p>
                </div>
              </div>
              
              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm text-center p-4">
                  <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <FiMessageSquare className="text-warning fs-4" />
                  </div>
                  <h4 className="fw-bold">{stats.likes}</h4>
                  <p className="text-muted mb-0">J'aimes</p>
                </div>
              </div>
              
              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm text-center p-4">
                  <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <FiBell className="text-info fs-4" />
                  </div>
                  <h4 className="fw-bold">{stats.comments}</h4>
                  <p className="text-muted mb-0">Commentaires</p>
                </div>
              </div>
            </div>
            
            {/* Zone de création */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle overflow-hidden me-3" style={{ width: '50px', height: '50px' }}>
                    <img 
                      src={user.profilePicture || getDefaultProfilePhoto()} 
                      alt="Profil" 
                      className="w-100 h-100 object-cover"
                    />
                  </div>
                  <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    placeholder="Quoi de neuf, {user.name} ?"
                    style={{ borderRadius: '50px' }}
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm rounded-pill">
                      <FaCamera className="me-2" />
                      Photo
                    </button>
                    <button className="btn btn-outline-success btn-sm rounded-pill">
                      <FiUsers className="me-2" />
                      Amis
                    </button>
                  </div>
                  <button className="btn btn-primary rounded-pill px-4">
                    Publier
                  </button>
                </div>
              </div>
            </div>
            
            {/* Activités récentes */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="fw-bold mb-0">Activités récentes</h5>
              </div>
              <div className="card-body">
                <div className="timeline">
                  {[
                    { 
                      id: 1, 
                      user: 'Marie Dupont', 
                      action: 'a aimé votre photo', 
                      time: 'Il y a 2 heures',
                      type: 'like'
                    },
                    { 
                      id: 2, 
                      user: 'Jean Martin', 
                      action: 'a commenté votre publication', 
                      time: 'Il y a 4 heures',
                      type: 'comment'
                    },
                    { 
                      id: 3, 
                      user: 'Sarah Chen', 
                      action: 'vous a envoyé une demande d\'ami', 
                      time: 'Il y a 1 jour',
                      type: 'friend'
                    },
                    { 
                      id: 4, 
                      user: 'Alexandre Leroy', 
                      action: 'a partagé votre publication', 
                      time: 'Il y a 2 jours',
                      type: 'share'
                    }
                  ].map(activity => (
                    <div key={activity.id} className="timeline-item d-flex mb-4">
                      <div className="timeline-icon bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{ width: '40px', height: '40px' }}>
                        {activity.type === 'like' && <FiActivity className="text-primary" />}
                        {activity.type === 'comment' && <FiMessageSquare className="text-success" />}
                        {activity.type === 'friend' && <FiUsers className="text-warning" />}
                        {activity.type === 'share' && <FaUser className="text-info" />}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong>{activity.user}</strong> {activity.action}
                          </div>
                          <small className="text-muted">{activity.time}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - Suggestions */}
          <div className="col-lg-3">
            {/* Suggestions d'amis */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="fw-bold mb-0">Suggestions d'amis</h5>
              </div>
              <div className="card-body p-0">
                {[
                  { id: 1, name: 'Thomas Moreau', mutualFriends: 12 },
                  { id: 2, name: 'Julie Petit', mutualFriends: 8 },
                  { id: 3, name: 'Kevin Bernard', mutualFriends: 15 },
                  { id: 4, name: 'Sophie Lambert', mutualFriends: 5 }
                ].map(friend => (
                  <div key={friend.id} className="d-flex align-items-center p-3 border-bottom">
                    <div className="rounded-circle overflow-hidden me-3" style={{ width: '50px', height: '50px' }}>
                      <div className="w-100 h-100 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center">
                        <FaUser className="text-primary" />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-medium">{friend.name}</div>
                      <small className="text-muted">{friend.mutualFriends} amis en commun</small>
                    </div>
                    <button className="btn btn-primary btn-sm rounded-pill">
                      Ajouter
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Événements */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="fw-bold mb-0">Événements à venir</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <div className="bg-primary text-white rounded-2 text-center me-3" 
                         style={{ width: '50px', height: '50px', padding: '10px' }}>
                      <div className="fw-bold">15</div>
                      <small>DEC</small>
                    </div>
                    <div>
                      <div className="fw-medium">Soirée réseau</div>
                      <small className="text-muted">Paris, 18h00</small>
                    </div>
                  </div>
                  <button className="btn btn-outline-primary btn-sm w-100">
                    Participer
                  </button>
                </div>
                
                <div>
                  <div className="d-flex align-items-center mb-2">
                    <div className="bg-success text-white rounded-2 text-center me-3" 
                         style={{ width: '50px', height: '50px', padding: '10px' }}>
                      <div className="fw-bold">20</div>
                      <small>DEC</small>
                    </div>
                    <div>
                      <div className="fw-medium">Conférence Tech</div>
                      <small className="text-muted">En ligne, 14h00</small>
                    </div>
                  </div>
                  <button className="btn btn-outline-success btn-sm w-100">
                    Participer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-top py-4 mt-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0 text-muted">
                © 2024 Social Network. Tous droits réservés.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <a href="/privacy" className="text-muted me-3 text-decoration-none">Confidentialité</a>
              <a href="/terms" className="text-muted me-3 text-decoration-none">Conditions</a>
              <a href="/help" className="text-muted text-decoration-none">Aide</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS */}
      <style>{`
        .dashboard-container {
          min-height: 100vh;
        }
        
        .card {
          border-radius: 1rem !important;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
        }
        
        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 20px;
          top: 60px;
          bottom: -20px;
          width: 2px;
          background-color: #e9ecef;
        }
        
        .btn {
          transition: all 0.3s ease !important;
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-2px) !important;
        }
        
        .rounded-circle img {
          object-fit: cover;
        }
        
        /* Custom colors */
        .bg-primary-light {
          background-color: rgba(13, 110, 253, 0.1) !important;
        }
        
        .bg-success-light {
          background-color: rgba(25, 135, 84, 0.1) !important;
        }
        
        .bg-warning-light {
          background-color: rgba(255, 193, 7, 0.1) !important;
        }
        
        .bg-info-light {
          background-color: rgba(13, 202, 240, 0.1) !important;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .card-body {
            padding: 1.5rem !important;
          }
          
          .display-4 {
            font-size: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Dashboard