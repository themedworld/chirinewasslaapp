import React from 'react';
import { FaHome, FaFacebookMessenger, FaBell, FaSearch, FaUser } from 'react-icons/fa';
import { Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/headers.css';

const SocialHeader = () => {
  // Données simulées
  const unreadMessages = 3;
  const unreadNotifications = 5;

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-gradient">
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand glow-effect" href="#">
          Social<span className="brand-highlight">Connect</span>
        </a>

        {/* Burger menu pour mobile */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenu du header */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Barre de recherche (centrée) */}
          <div className="d-flex search-container mx-lg-auto my-2 my-lg-0">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <FaSearch className="text-muted" />
              </span>
              <input 
                type="search" 
                className="form-control search-input" 
                placeholder="Rechercher personnes, pages..." 
              />
            </div>
          </div>

          {/* Navigation */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active hover-effect" href="/dashboard">
                <FaHome className="icon" />
                <span className="d-none d-lg-inline ms-1">Home</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link hover-effect position-relative" href="#">
                <FaFacebookMessenger className="icon" />
                <span className="d-none d-lg-inline ms-1">Messages</span>
                {unreadMessages > 0 && (
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {unreadMessages}
                  </Badge>
                )}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link hover-effect position-relative" href="#">
                <FaBell className="icon" />
                <span className="d-none d-lg-inline ms-1">Notifications</span>
                {unreadNotifications > 0 && (
                  <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                    {unreadNotifications}
                  </Badge>
                )}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link hover-effect" href="/ImageUpload">
                <FaUser className="icon" />
                <span className="d-none d-lg-inline ms-1">Profil</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default SocialHeader;