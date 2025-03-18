import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaHiking, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaMap, FaHome, FaBookmark, FaList } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaHiking className="navbar-icon" />
          <span>Hike&Book</span>
        </Link>

        <div className="menu-icon" onClick={toggleMobileMenu}>
          <i className={mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

        <ul className={mobileMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              <FaHome className="nav-icon" />
              <span>Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/trails" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              <FaMap className="nav-icon" />
              <span>Trails</span>
            </Link>
          </li>
          
          {currentUser ? (
            <>
              <li className="nav-item">
                <Link to="/my-bookings" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <FaBookmark className="nav-icon" />
                  <span>My Bookings</span>
                </Link>
              </li>
              {currentUser.roles.includes('ROLE_ADMIN') && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <FaList className="nav-icon" />
                    <span>Admin</span>
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link to="/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <FaUser className="nav-icon" />
                  <span>Profile</span>
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-link btn-logout" onClick={handleLogout}>
                  <FaSignOutAlt className="nav-icon" />
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <FaSignInAlt className="nav-icon" />
                  <span>Login</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <FaUserPlus className="nav-icon" />
                  <span>Register</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;