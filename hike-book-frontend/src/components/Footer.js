import React from 'react';
import { FaHiking, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <FaHiking className="footer-icon" />
          <h2>Hike&Book</h2>
        </div>
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>
              Hike&Book is a platform designed for hiking enthusiasts to discover
              and book incredible trails around the world.
            </p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/trails">Trails</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: info@hikebook.com</p>
            <p>Phone: +381 11 123 456</p>
            <div className="social-icons">
              <a href="#" className="social-icon">
                <FaFacebook />
              </a>
              <a href="#" className="social-icon">
                <FaTwitter />
              </a>
              <a href="#" className="social-icon">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Hike&Book. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;