import { useState, useEffect } from 'react';
import { FaCamera, FaUserEdit, FaTimes, FaCheck, FaUserFriends, FaEnvelope, FaSpinner, FaImage } from 'react-icons/fa';
import { FiUploadCloud, FiX, FiEdit2 } from 'react-icons/fi';
import { MdOutlinePhotoSizeSelectActual } from 'react-icons/md';
import { RiImageEditLine } from 'react-icons/ri';
import 'bootstrap/dist/css/bootstrap.min.css';

const ImageUpload = () => {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const BACKEND_API = import.meta.env.VITE_BACKEND_API;

  const [user, setUser] = useState<any>(null);
  const [coverPhoto, setCoverPhoto] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<'cover' | 'profile' | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          const response = await fetch(`${BACKEND_API}/users/${parsedUser.id}`);
          
          if (!response.ok) throw new Error('Failed to fetch user data');
          
          const userWithPhotos = await response.json();
          
          setUser(userWithPhotos);
          setCoverPhoto(userWithPhotos.coverPhoto || '');
          setProfilePhoto(userWithPhotos.profilePicture || '');
          localStorage.setItem('user', JSON.stringify(userWithPhotos));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    fetchUserData();
  }, [BACKEND_API]);

  const getDefaultProfilePhoto = () => {
    return user?.gender === 'female' 
      ? '/src/assets/womenprofile.png' 
      : '/src/assets/manprofile.png';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const selectedFile = e.target.files[0];
    
    if (!selectedFile.type.match('image.*')) {
      setError('Seuls les fichiers JPG, PNG ou GIF sont acceptés');
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('La taille maximale est de 10MB');
      return;
    }

    setFile(selectedFile);
    setError('');
    
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (!e.dataTransfer.files?.[0]) return;
    
    const droppedFile = e.dataTransfer.files[0];
    
    if (!droppedFile.type.match('image.*')) {
      setError('Seuls les fichiers JPG, PNG ou GIF sont acceptés');
      return;
    }
    
    if (droppedFile.size > 10 * 1024 * 1024) {
      setError('La taille maximale est de 10MB');
      return;
    }

    setFile(droppedFile);
    setError('');
    
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(droppedFile);
  };

  const uploadImage = async (type: 'cover' | 'profile') => {
    if (!file || !user?.id) {
      setError('Veuillez sélectionner une image valide');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!cloudinaryResponse.ok) {
        const errorData = await cloudinaryResponse.json();
        throw new Error(errorData.error?.message || 'Échec de l\'upload');
      }

      const { secure_url } = await cloudinaryResponse.json();

      const endpoint = `${BACKEND_API}/users/${user.id}/${type === 'cover' ? 'cover-photo' : 'profile-picture'}`;
      
      const body =
        type === 'cover'
          ? { coverPhoto: secure_url }
          : { profilePicture: secure_url };

      const backendResponse = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!backendResponse.ok) {
        throw new Error('Échec de la mise à jour du profil');
      }

      const updatedUser = await backendResponse.json();

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      if (type === 'cover') {
        setCoverPhoto(secure_url);
      } else {
        setProfilePhoto(secure_url);
      }

      setEditing(null);
      setFile(null);
      setPreviewUrl('');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setUploading(false);
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setFile(null);
    setPreviewUrl('');
    setError('');
    setDragOver(false);
  };

  if (!user) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-gradient-primary">
        <div className="spinner-border text-primary mb-4" style={{ width: '5rem', height: '5rem' }} role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <h3 className="text-primary fw-normal">Chargement de votre profil...</h3>
        <p className="text-muted mt-2">Préparez vos plus belles photos !</p>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid p-0">
        {/* Background Gradient */}
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-gradient-primary" style={{ zIndex: -1 }}></div>

        <div className="container py-5 px-3 px-lg-5">
          {/* Carte de profil principale */}
          <div className="card border-0 shadow-xxl rounded-4 overflow-hidden mb-5 bg-white">
            
            {/* Photo de couverture */}
            <div 
              className="position-relative cover-section"
              style={{
                height: '320px',
                background: coverPhoto 
                  ? `url(${coverPhoto}) center/cover no-repeat`
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
              }}
            >
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-30"></div>
              
              {!coverPhoto && (
                <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
                  <FaImage className="display-4 mb-3 opacity-75" />
                  <h4 className="fw-light">Aucune photo de couverture</h4>
                  <p className="text-white-50 mb-0">Ajoutez une belle photo pour personnaliser votre profil</p>
                </div>
              )}
              
              {/* Bouton modifier couverture */}
              <button 
                onClick={() => setEditing('cover')}
                className="btn btn-light position-absolute bottom-0 end-0 m-4 d-flex align-items-center gap-2 px-4 py-3 rounded-pill shadow-lg"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <RiImageEditLine className="fs-5 text-primary" />
                <span className="fw-semibold">Modifier la couverture</span>
              </button>
            </div>

            {/* Section photo de profil et informations */}
            <div className="position-relative px-4 px-lg-5 pb-5" style={{ marginTop: '-120px' }}>
              <div className="row g-4">
                
                {/* Photo de profil */}
                <div className="col-12 col-lg-auto">
                  <div className="position-relative">
                    <div 
                      className="rounded-circle overflow-hidden border-5 border-white shadow-xxl"
                      style={{
                        width: '240px',
                        height: '240px',
                        background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)'
                      }}
                    >
                      <img 
                        src={profilePhoto || getDefaultProfilePhoto()} 
                        alt="Profil" 
                        className="w-100 h-100 object-cover"
                        onError={(e) => (e.target as HTMLImageElement).src = getDefaultProfilePhoto()}
                      />
                    </div>
                    
                    {/* Badge d'état en ligne */}
                    <div className="position-absolute top-0 end-0 m-3">
                      <div className="bg-success rounded-circle" style={{ width: '20px', height: '20px' }}></div>
                    </div>
                    
                    {/* Bouton modifier photo */}
                    <button 
                      onClick={() => setEditing('profile')}
                      className="btn btn-primary position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center shadow-lg"
                      style={{
                        width: '60px',
                        height: '60px',
                        transform: 'translate(25%, 25%)'
                      }}
                    >
                      <FiEdit2 className="fs-5" />
                    </button>
                  </div>
                </div>
                
                {/* Informations utilisateur */}
                <div className="col-12 col-lg">
                  <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start mb-4">
                    <div>
                      <h1 className="display-5 fw-bold text-gradient mb-3">
                        {user.name}
                      </h1>
                      <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 fs-6 fw-medium rounded-pill">
                        {user.role || 'Membre'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="row g-4 mb-4">
                    <div className="col-12 col-md-6">
                      <div className="d-flex align-items-center bg-primary bg-opacity-10 p-3 rounded-3">
                        <div className="bg-primary p-3 rounded-3 me-3">
                          <FaUserFriends className="text-white fs-5" />
                        </div>
                        <div>
                          <div className="fs-4 fw-bold">{user.friendsCount || 0}</div>
                          <div className="text-muted">Amis</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-12 col-md-6">
                      <div className="d-flex align-items-center bg-info bg-opacity-10 p-3 rounded-3">
                        <div className="bg-info p-3 rounded-3 me-3">
                          <FaEnvelope className="text-white fs-5" />
                        </div>
                        <div>
                          <div className="fw-bold">{user.email}</div>
                          <div className="text-muted">Email</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bio */}
                  <div className="card border-0 shadow-sm bg-light bg-opacity-50 p-4 mb-4">
                    <p className="mb-0 text-dark fs-5">
                      {user.bio || "Partagez vos moments préférés avec vos amis !"}
                    </p>
                  </div>
                  
                  {/* Stats supplémentaires */}
                  <div className="row g-4 mb-4">
                    <div className="col-6 col-md-3">
                      <div className="text-center p-4 bg-white rounded-3 shadow-sm">
                        <div className="display-6 fw-bold text-primary">42</div>
                        <div className="text-muted">Publications</div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="text-center p-4 bg-white rounded-3 shadow-sm">
                        <div className="display-6 fw-bold text-danger">128</div>
                        <div className="text-muted">Photos</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bouton supplémentaire */}
                  <button 
                    onClick={() => setEditing('profile')}
                    className="btn btn-primary d-flex align-items-center justify-content-center gap-3 px-5 py-3 w-100 w-lg-auto"
                  >
                    <FaUserEdit />
                    <span className="fw-semibold">Modifier ma photo de profil</span>
                    <FaCamera className="ms-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'édition */}
      {editing && (
        <div 
          className="modal fade show d-block" 
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 overflow-hidden" style={{ borderRadius: '1.5rem' }}>
              {/* En-tête du modal */}
              <div 
                className="modal-header border-0 text-white p-4 p-lg-5"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}
              >
                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h3 className="modal-title fw-bold mb-2">
                        {editing === 'cover' ? '🖼️ Photo de couverture' : '👤 Photo de profil'}
                      </h3>
                      <p className="mb-0 opacity-75">
                        {previewUrl ? '✨ Vérifiez votre sélection' : '📤 Téléchargez votre meilleure photo'}
                      </p>
                    </div>
                    <button
                      onClick={cancelEdit}
                      className="btn btn-close btn-close-white opacity-100"
                      disabled={uploading}
                    />
                  </div>
                  
                  {/* Indicateur de progression */}
                  <div className="mt-4">
                    <div className="progress" style={{ height: '4px' }}>
                      <div 
                        className="progress-bar bg-success"
                        style={{ width: previewUrl ? '66%' : '33%' }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between mt-2 text-white-75">
                      <small>1. Sélection</small>
                      <small>2. Prévisualisation</small>
                      <small>3. Confirmation</small>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-body p-4 p-lg-5">
                {previewUrl ? (
                  <>
                    <div className="mb-5 text-center">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="img-fluid rounded-3 shadow-lg mb-4"
                        style={{ maxHeight: '400px' }}
                      />
                      
                      <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                        <button
                          onClick={cancelEdit}
                          disabled={uploading}
                          className="btn btn-lg btn-outline-secondary px-5 py-3 d-flex align-items-center justify-content-center gap-2"
                        >
                          <FaTimes />
                          Changer de photo
                        </button>
                        <button
                          onClick={() => uploadImage(editing)}
                          disabled={uploading}
                          className="btn btn-lg btn-success px-5 py-3 d-flex align-items-center justify-content-center gap-3 shadow-lg"
                        >
                          {uploading ? (
                            <>
                              <FaSpinner className="fa-spin" />
                              <span>Envoi en cours...</span>
                            </>
                          ) : (
                            <>
                              <FaCheck />
                              <span className="fw-semibold">Confirmer cette photo</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-5 text-center">
                      <p className="text-muted fs-5 mb-4">
                        Choisissez une belle photo {editing === 'cover' ? 'pour votre couverture' : 'pour votre profil'}
                      </p>
                      
                      {/* Infos techniques */}
                      <div className="row g-4 mb-4">
                        <div className="col-md-4">
                          <div className="card border-0 bg-primary bg-opacity-10 p-4 text-center">
                            <MdOutlinePhotoSizeSelectActual className="text-primary fs-1 mb-3" />
                            <h6 className="fw-bold text-primary mb-2">Dimensions</h6>
                            <p className="text-primary mb-0">
                              {editing === 'cover' ? '1920×640 px' : '800×800 px'}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card border-0 bg-danger bg-opacity-10 p-4 text-center">
                            <FaImage className="text-danger fs-1 mb-3" />
                            <h6 className="fw-bold text-danger mb-2">Formats</h6>
                            <p className="text-danger mb-0">JPG, PNG, WebP</p>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card border-0 bg-success bg-opacity-10 p-4 text-center">
                            <FiUploadCloud className="text-success fs-1 mb-3" />
                            <h6 className="fw-bold text-success mb-2">Taille max</h6>
                            <p className="text-success mb-0">10 MB</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Zone de dépôt */}
                      <div
                        className={`border-4 border-dashed rounded-3 p-5 text-center mb-4 ${
                          dragOver 
                            ? 'border-primary bg-primary bg-opacity-10' 
                            : 'border-light-subtle bg-light bg-opacity-50'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        style={{ cursor: 'pointer' }}
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <div className="my-4">
                          <div className="mb-4">
                            <div className="mx-auto bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                                 style={{ width: '120px', height: '120px' }}>
                              <FiUploadCloud className="text-primary fs-1" />
                            </div>
                          </div>
                          
                          <h4 className="fw-bold text-dark mb-3">
                            {dragOver ? '🎉 Lâchez votre image ici !' : '📁 Glissez-déposez votre image'}
                          </h4>
                          <p className="text-muted mb-4">ou cliquez pour parcourir vos fichiers</p>
                          
                          <button className="btn btn-primary btn-lg px-5 py-3 shadow">
                            Parcourir mes fichiers
                          </button>
                          
                          <input 
                            id="file-upload"
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="d-none"
                          />
                        </div>
                      </div>
                      
                      <button
                        onClick={cancelEdit}
                        className="btn btn-outline-secondary px-5 py-3"
                      >
                        Retour au profil
                      </button>
                    </div>
                  </>
                )}
                
                {/* Message d'erreur */}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mt-4 border-0 shadow-sm rounded-3">
                    <FaTimes className="me-3" />
                    <div className="fw-medium">{error}</div>
                    <button 
                      onClick={() => setError('')}
                      className="btn-close ms-auto"
                    />
                  </div>
                )}
                
                {/* Conseils */}
                {!error && !previewUrl && (
                  <div className="card border-0 bg-info bg-opacity-10 p-4 mt-4">
                    <h6 className="fw-semibold text-info mb-3">
                      💡 Conseils pour une belle photo :
                    </h6>
                    <ul className="text-info mb-0 ps-3">
                      <li className="mb-2">Utilisez une image lumineuse et de bonne qualité</li>
                      <li className="mb-2">Évitez les photos floues ou pixelisées</li>
                      <li className="mb-2">
                        {editing === 'cover' 
                          ? 'Choisissez une photo panoramique pour un meilleur effet' 
                          : 'Privilégiez un portrait où votre visage est bien visible'}
                      </li>
                      <li>Les couleurs vives attirent plus l'attention</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .cover-section {
          position: relative;
          overflow: hidden;
        }
        
        .shadow-xxl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        }
        
        .border-5 {
          border-width: 5px !important;
        }
        
        .progress {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .btn-close-white {
          filter: invert(1) grayscale(100%) brightness(200%);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        /* Hover effects */
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
        }
        
        .btn {
          transition: all 0.3s ease !important;
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-2px) !important;
        }
        
        .btn:active:not(:disabled) {
          transform: translateY(0) !important;
        }
        
        /* Custom modal backdrop */
        .modal-backdrop {
          backdrop-filter: blur(10px);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .cover-section {
            height: 200px !important;
          }
          
          .modal-dialog {
            margin: 1rem;
          }
          
          .display-5 {
            font-size: 2.5rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default ImageUpload;