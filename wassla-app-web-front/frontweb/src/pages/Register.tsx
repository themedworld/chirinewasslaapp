import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { RegisterFormData } from '../types/authTypes';
import logo from '../assets/logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    name: '',
    numtel: '',
    genre: '',
    birthdate: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dinoEyesClosed, setDinoEyesClosed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  // Animation du dinosaure
  useEffect(() => {
    if (showPassword) {
      setDinoEyesClosed(false);
    } else {
      const timer = setTimeout(() => {
        setDinoEyesClosed(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validation (identique à la version précédente)
      if (!formData.name.trim()) {
        throw new Error('Le nom complet est requis');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Veuillez entrer une adresse email valide');
      }

      if (formData.password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          email: formData.email.toLowerCase().trim(),
          name: formData.name.trim(),
          numtel: formData.numtel.replace(/\D/g, ''),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de l\'inscription');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { 
          state: { registrationSuccess: true, email: formData.email },
          replace: true 
        });
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

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
                Créer votre compte
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
              }}>Rejoignez notre communauté dès maintenant</p>
            </div>
          </div>

          {/* Form */}
          <div className="card-body p-4 p-lg-5">
            {success ? (
              <div className="alert alert-success d-flex align-items-center mb-4" style={{ 
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(46, 204, 113, 0.15)',
                color: '#55efc4',
                animation: 'fadeInUp 0.5s ease',
                backdropFilter: 'blur(5px)',
                borderLeft: '4px solid #55efc4'
              }}>
                <i className="bi bi-check-circle-fill me-3 fs-4"></i>
                <div>
                  <div className="fw-semibold">Inscription réussie!</div>
                  <div className="small opacity-90">Redirection en cours...</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
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

                {/* Nom complet */}
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-medium" style={{ 
                    color: '#e2e8f0',
                    fontSize: '0.95rem'
                  }}>
                    Nom complet <span className="text-danger">*</span>
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
                      <i className="bi bi-person-fill"></i>
                    </span>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Votre nom complet"
                      style={{ 
                        backgroundColor: 'rgba(26, 26, 46, 0.8)',
                        borderColor: 'rgba(79, 107, 255, 0.3)',
                        color: '#f8fafc',
                        borderLeft: 'none',
                        padding: '0.75rem 1rem'
                      }}
                    />
                  </div>
                </div>

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
                      id="email"
                      name="email"
                      type="email"
                      required
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
                      required
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
                      <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                    </button>
                  </div>
                  <small className="text-muted mt-1 d-block" style={{ fontSize: '0.8rem' }}>
                    Minimum 6 caractères
                  </small>
                </div>

                {/* Numéro de téléphone */}
                <div className="mb-4">
                  <label htmlFor="numtel" className="form-label fw-medium" style={{ 
                    color: '#e2e8f0',
                    fontSize: '0.95rem'
                  }}>
                    Numéro de téléphone
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
                      <i className="bi bi-telephone-fill"></i>
                    </span>
                    <input
                      id="numtel"
                      name="numtel"
                      type="tel"
                      value={formData.numtel}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="06 12 34 56 78"
                      style={{ 
                        backgroundColor: 'rgba(26, 26, 46, 0.8)',
                        borderColor: 'rgba(79, 107, 255, 0.3)',
                        color: '#f8fafc',
                        borderLeft: 'none',
                        padding: '0.75rem 1rem'
                      }}
                    />
                  </div>
                </div>

                {/* Genre et Date de naissance */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label htmlFor="genre" className="form-label fw-medium" style={{ 
                      color: '#e2e8f0',
                      fontSize: '0.95rem'
                    }}>
                      Genre
                    </label>
                    <select
                      id="genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      className="form-select"
                      style={{ 
                        backgroundColor: 'rgba(26, 26, 46, 0.8)',
                        borderColor: 'rgba(79, 107, 255, 0.3)',
                        color: '#f8fafc',
                        padding: '0.75rem 1rem',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="birthdate" className="form-label fw-medium" style={{ 
                      color: '#e2e8f0',
                      fontSize: '0.95rem'
                    }}>
                      Date de naissance
                    </label>
                    <input
                      id="birthdate"
                      name="birthdate"
                      type="date"
                      value={formData.birthdate}
                      onChange={handleChange}
                      className="form-control"
                      style={{ 
                        backgroundColor: 'rgba(26, 26, 46, 0.8)',
                        borderColor: 'rgba(79, 107, 255, 0.3)',
                        color: '#f8fafc',
                        padding: '0.75rem 1rem',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </div>
                </div>

                {/* Conditions d'utilisation */}
                <div className="form-check mb-4">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="form-check-input"
                    style={{
                      backgroundColor: 'rgba(26, 26, 46, 0.8)',
                      borderColor: 'rgba(79, 107, 255, 0.5)',
                      width: '1.2em',
                      height: '1.2em',
                      marginTop: '0.1em'
                    }}
                  />
                  <label htmlFor="terms" className="form-check-label ms-2" style={{
                    color: '#cbd5e1',
                    fontSize: '0.9rem'
                  }}>
                    J'accepte les{' '}
                    <Link to="/terms" className="text-decoration-none fw-semibold" style={{ 
                      color: '#4f6bff',
                      transition: 'all 0.3s ease',
                      borderBottom: '1px dashed rgba(79, 107, 255, 0.5)'
                    }}>
                      conditions d'utilisation
                    </Link>
                  </label>
                </div>

                {/* Bouton d'inscription */}
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
                        Inscription en cours...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus-fill me-2"></i>
                        S'inscrire
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
            )}

            <div className="text-center mt-4">
              <p className="mb-0" style={{ 
                color: '#94a3b8',
                fontSize: '0.95rem'
              }}>
                Déjà inscrit?{' '}
                <Link 
                  to="/login" 
                  className="text-decoration-none fw-semibold position-relative"
                  style={{ 
                    color: '#4f6bff',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Connectez-vous
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

export default Register;