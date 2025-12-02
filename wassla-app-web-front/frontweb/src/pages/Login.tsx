import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';



const Login = ({ setIsAuthenticated }: { setIsAuthenticated: (value: boolean) => void }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [dinoEyesClosed, setDinoEyesClosed] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const navigate = useNavigate()

  // Animation du dinosaure
  useEffect(() => {
    if (showPassword) {
      setDinoEyesClosed(false)
    } else {
      const timer = setTimeout(() => {
        setDinoEyesClosed(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [showPassword])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    // Validation des champs
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      throw new Error('Veuillez entrer une adresse email valide');
    }

    if (formData.password.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères');
    }

 
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/users/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Échec de la connexion');
    }

    // Stockage des données de l'utilisateur
    localStorage.setItem('token', data.access_token); // Notez le changement de data.token à data.access_token
    localStorage.setItem('user', JSON.stringify(data.user)); // Stockage des infos utilisateur

    // Mise à jour de l'état d'authentification
    setIsAuthenticated(true);
    navigate('/dashboard', { replace: true });

  } catch (err) {
    setError(err instanceof Error ? err.message : 'Une erreur est survenue');
  } finally {
    setIsLoading(false);
  }
};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }


  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" 
         style={{
           background: 'radial-gradient(circle at 10% 20%, #1a1a2e 0%, #16213e 100%)',
           fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
           overflow: 'hidden'
         }}>
      {/* Particules animées en arrière-plan */}
      <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden" style={{ zIndex: 0 }}>
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="position-absolute rounded-pill"
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              backgroundColor: `rgba(79, 107, 255, ${Math.random() * 0.3 + 0.1})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(1px)',
              animation: `float ${Math.random() * 20 + 10}s infinite ease-in-out`,
              opacity: 0.7,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Grands cercles flous en arrière-plan */}
      <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden" style={{ zIndex: 0 }}>
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="position-absolute rounded-circle"
            style={{
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              backgroundColor: `rgba(79, 107, 255, ${Math.random() * 0.03 + 0.02})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(60px)',
              animation: `pulse ${Math.random() * 30 + 20}s infinite ease-in-out alternate`,
              opacity: 0.4
            }}
          />
        ))}
      </div>

      {/* Dinosaure animé amélioré */}
      <div className="position-absolute d-none d-lg-block" 
           style={{
             bottom: '5%',
             left: '5%',
             width: '200px',
             zIndex: 2,
             transform: 'scaleX(-1)',
             transition: 'transform 0.5s ease',
             transform: isHovering ? 'scaleX(-1.1) translateY(-10px)' : 'scaleX(-1)'
           }}
           onMouseEnter={() => setIsHovering(true)}
           onMouseLeave={() => setIsHovering(false)}>
        <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
          {/* Corps du dinosaure avec dégradé */}
          <path d="M20,50 Q40,30 60,50 Q80,70 100,50 Q120,30 140,50 L160,30 L170,40 L180,30 L190,50 L180,70 L170,60 L160,70 Q150,80 140,70 Q130,60 120,70 Q110,80 100,70 Q90,60 80,70 Q70,80 60,70 Q50,60 40,70 Q30,80 20,70 Z" 
                fill="url(#dinoGradient)" />
          
          {/* Définition du dégradé */}
          <defs>
            <linearGradient id="dinoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f6bff" />
              <stop offset="100%" stopColor="#3a0ca3" />
            </linearGradient>
          </defs>
          
          {/* Yeux avec reflets */}
          <circle cx="140" cy="40" r="6" fill="#fff" />
          <circle cx="150" cy="40" r="6" fill="#fff" />
          
          {/* Pupilles animées */}
          <circle cx={dinoEyesClosed ? "140" : "142"} cy={dinoEyesClosed ? "40" : "38"} r="3" fill="#1a1a2e" />
          <circle cx={dinoEyesClosed ? "150" : "152"} cy={dinoEyesClosed ? "40" : "38"} r="3" fill="#1a1a2e" />
          
          {/* Reflets dans les yeux */}
          <circle cx="141" cy="38" r="1" fill="#fff" />
          <circle cx="151" cy="38" r="1" fill="#fff" />
          
          {/* Paupières pour l'effet de clignement */}
          {dinoEyesClosed && (
            <>
              <path d="M134,40 Q140,34 146,40" stroke="#1a1a2e" strokeWidth="3" fill="none" />
              <path d="M144,40 Q150,34 156,40" stroke="#1a1a2e" strokeWidth="3" fill="none" />
            </>
          )}
          
          {/* Petits bras qui couvrent les yeux avec animation */}
          {!showPassword && (
            <>
              <path d="M130,45 L140,40" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M140,40 L150,40" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M150,40 L160,45" stroke="#1a1a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}
          
          {/* Sourire */}
          <path d="M140,50 Q145,55 150,50" stroke="#1a1a2e" strokeWidth="2" fill="none" 
                strokeLinecap="round" strokeDasharray={showPassword ? "0" : "5,2"} />
        </svg>
      </div>

      {/* Carte principale */}
      <div className="w-100 position-relative" style={{ maxWidth: '500px', zIndex: 1 }}>
        <div className="card shadow-lg overflow-hidden" style={{ 
          borderRadius: '20px',
          border: 'none',
          backgroundColor: 'rgba(26, 26, 46, 0.95)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          transform: 'perspective(1000px)',
          transition: 'transform 0.5s ease, box-shadow 0.5s ease',
          border: '1px solid rgba(79, 107, 255, 0.1)'
        }}>
          {/* Header avec dégradé amélioré */}
          <div className="py-5 px-4 text-center position-relative" 
               style={{
                 background: 'linear-gradient(135deg, rgba(79, 107, 255, 0.9) 0%, rgba(58, 12, 163, 0.9) 100%)',
                 overflow: 'hidden'
               }}>
            {/* Effet de vague subtil */}
            <div className="position-absolute bottom-0 start-0 w-100" style={{ height: '20px', zIndex: 1 }}>
              <svg viewBox="0 0 500 20" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                <path d="M0,20 C150,25 350,15 500,20 L500,0 L0,0 Z" fill="rgba(26, 26, 46, 0.95)" />
              </svg>
            </div>
            
            {/* Points lumineux */}
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i}
                  className="position-absolute rounded-circle"
                  style={{
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    filter: 'blur(1px)',
                    animation: `twinkle ${Math.random() * 5 + 3}s infinite ease-in-out`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                />
              ))}
            </div>
            
            <div className="position-relative z-2">
              <img 
                src={logo} 
                alt="Logo" 
                className="img-fluid mb-3"
                style={{ 
                  height: '70px',
                  filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))',
                  transition: 'transform 0.5s ease, filter 0.5s ease',
                  transform: 'rotate(0deg)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotate(8deg) scale(1.05)';
                  e.currentTarget.style.filter = 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                  e.currentTarget.style.filter = 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))';
                }}
              />
              <h1 className="text-white mb-2 fw-bold" style={{ 
                fontSize: '2rem',
                letterSpacing: '0.5px',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                position: 'relative',
                display: 'inline-block'
              }}>
                Content de vous revoir
                <span className="position-absolute bottom-0 start-0 w-100 h-1 bg-white" 
                      style={{ 
                        transform: 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: 'transform 0.5s ease',
                        opacity: 0.3
                      }}></span>
              </h1>
              <p className="text-white mb-0 mt-2" style={{ 
                opacity: 0.9,
                fontSize: '1rem',
                fontWeight: 300
              }}>Connectez-vous à votre compte</p>
            </div>
          </div>

          {/* Form */}
          <div className="card-body p-4 p-lg-5">
            {error && (
              <div className="alert alert-danger d-flex align-items-center mb-4" style={{ 
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(255, 71, 87, 0.15)',
                color: '#ff6b81',
                animation: 'shake 0.5s ease',
                backdropFilter: 'blur(5px)',
                borderLeft: '4px solid #ff6b81'
              }}>
                <i className="bi bi-exclamation-octagon-fill me-3 fs-4"></i>
                <div className="fw-medium">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="form-label fw-medium" style={{ 
                  color: '#e2e8f0',
                  fontSize: '0.95rem'
                }}>
                  Adresse email <span className="text-danger">*</span>
                </label>
                <div className="input-group" style={{
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}>
                  <span className="input-group-text" style={{ 
                    backgroundColor: 'rgba(26, 26, 46, 0.8)',
                    borderColor: 'rgba(79, 107, 255, 0.3)',
                    color: '#4f6bff',
                    transition: 'all 0.3s ease',
                    borderRight: 'none'
                  }}>
                    <i className="bi bi-envelope-fill"></i>
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="email@exemple.com"
                    style={{ 
                      backgroundColor: 'rgba(26, 26, 46, 0.8)',
                      borderColor: 'rgba(79, 107, 255, 0.3)',
                      color: '#f8fafc',
                      borderLeft: 'none',
                      padding: '0.75rem 1rem'
                    }}
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-medium" style={{ 
                  color: '#e2e8f0',
                  fontSize: '0.95rem'
                }}>
                  Mot de passe <span className="text-danger">*</span>
                </label>
                <div className="input-group" style={{
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}>
                  <span className="input-group-text" style={{ 
                    backgroundColor: 'rgba(26, 26, 46, 0.8)',
                    borderColor: 'rgba(79, 107, 255, 0.3)',
                    color: '#4f6bff',
                    transition: 'all 0.3s ease',
                    borderRight: 'none'
                  }}>
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="••••••••"
                    style={{ 
                      backgroundColor: 'rgba(26, 26, 46, 0.8)',
                      borderColor: 'rgba(79, 107, 255, 0.3)',
                      color: '#f8fafc',
                      borderLeft: 'none',
                      padding: '0.75rem 1rem'
                    }}
                    required
                    minLength={6}
                  />
                <button
  type="button"
  className="input-group-text"
  onClick={togglePasswordVisibility}
  style={{
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderColor: 'rgba(79, 107, 255, 0.3)',
    color: '#4f6bff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderLeft: 'none'
  }}
>
  {showPassword ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709z"/>
      <path d="M7.646 10.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708l-3 3a.5.5 0 0 0 0 .708z"/>
      <path d="M7.893 11.238a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708l-3 3a.5.5 0 0 0 0 .708z"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
  )}
</button>
               
                </div>
                <div className="d-flex justify-content-end mt-2">
                  <Link to="/forgot-password" className="text-decoration-none small" style={{
                    color: '#4f6bff',
                    transition: 'all 0.3s ease'
                  }}>
                    Mot de passe oublié?
                  </Link>
                </div>
              </div>

              {/* Bouton de connexion */}
              <div className="d-grid mb-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-lg fw-bold position-relative overflow-hidden"
                  style={{
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4f6bff 0%, #3a0ca3 100%)',
                    border: 'none',
                    color: '#f8fafc',
                    padding: '0.9rem',
                    letterSpacing: '0.5px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(79, 107, 255, 0.3)',
                    zIndex: 1
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Se connecter
                    </>
                  )}
                  <span className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-0 hover:opacity-10" 
                        style={{ transition: 'opacity 0.3s ease' }}></span>
                  {/* Effet de vague au survol */}
                  <span className="position-absolute top-0 start-0 w-full h-full overflow-hidden" 
                        style={{ zIndex: -1 }}>
                    <span className="position-absolute top-0 start-0 w-full h-full bg-gradient-to-r from-white to-transparent opacity-0 hover:opacity-10" 
                          style={{ transition: 'opacity 0.5s ease' }}></span>
                  </span>
                </button>
              </div>
            </form>

            <div className="position-relative my-4">
              <hr className="my-4" style={{ 
                borderColor: 'rgba(79, 107, 255, 0.3)',
                borderWidth: '1px',
                opacity: 1
              }} />
              <div 
                className="position-absolute top-50 start-50 translate-middle px-3 small" 
                style={{ 
                  backgroundColor: 'rgba(26, 26, 46, 0.95)',
                  color: '#94a3b8',
                  whiteSpace: 'nowrap'
                }}
              >
                Ou continuez avec
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6">
                <button
                  type="button"
                  className="btn w-100 py-2 d-flex align-items-center justify-content-center"
                  style={{ 
                    borderRadius: '10px',
                    border: '1px solid rgba(79, 107, 255, 0.3)',
                    backgroundColor: 'rgba(26, 26, 46, 0.8)',
                    color: '#f8fafc',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className="bi bi-github me-2"></i> GitHub
                </button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  className="btn w-100 py-2 d-flex align-items-center justify-content-center"
                  style={{ 
                    borderRadius: '10px',
                    border: '1px solid rgba(79, 107, 255, 0.3)',
                    backgroundColor: 'rgba(26, 26, 46, 0.8)',
                    color: '#f8fafc',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className="bi bi-google me-2"></i> Google
                </button>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="mb-0" style={{ 
                color: '#94a3b8',
                fontSize: '0.95rem'
              }}>
                Pas encore de compte?{' '}
                <Link 
                  to="/register" 
                  className="text-decoration-none fw-semibold position-relative"
                  style={{ 
                    color: '#4f6bff',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Inscrivez-vous
                  <span className="position-absolute bottom-0 left-0 w-0 h-px bg-blue-400 transition-all duration-300" 
                        style={{ backgroundColor: '#4f6bff', height: '1px' }}></span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.1); opacity: 0.6; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.2; }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .card {
          transition: transform 0.5s ease, box-shadow 0.5s ease;
        }
        
        .card:hover {
          transform: translateY(-8px) perspective(1000px) rotateY(3deg);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5) !important;
        }
        
        .form-control, .form-select {
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        
        .form-control:focus, .form-select:focus {
          border-color: rgba(79, 107, 255, 0.6) !important;
          box-shadow: 0 0 0 0.25rem rgba(79, 107, 255, 0.25) !important;
          background-color: rgba(26, 26, 46, 0.9) !important;
          color: #f8fafc !important;
        }
        
        .btn {
          transition: all 0.3s ease !important;
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-3px) !important;
          box-shadow: 0 8px 25px rgba(79, 107, 255, 0.5) !important;
        }
        
        .btn:active:not(:disabled) {
          transform: translateY(0) !important;
        }
        
        .input-group-text:hover {
          background-color: rgba(79, 107, 255, 0.2) !important;
          color: #4f6bff !important;
        }
        
        /* Animation pour les icônes */
        .bi {
          transition: transform 0.3s ease;
        }
        
        .input-group-text:hover .bi {
          transform: scale(1.2);
        }
        
        /* Animation pour le lien de connexion */
        a:hover span {
          width: 100% !important;
        }
        
        /* Animation pour le titre */
        h1:hover span {
          transform: scaleX(1) !important;
        }
      `}</style>
    </div>
  );
};

export default Login;