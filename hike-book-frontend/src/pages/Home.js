import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import './Home.css';

const Home = () => {
  const [featuredTrails, setFeaturedTrails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTrails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/trails/featured`);
        setFeaturedTrails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured trails:', error);
        setLoading(false);
      }
    };

    fetchFeaturedTrails();
  }, []);

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Your Next Adventure</h1>
          <p>Explore amazing hiking trails and book guided tours with experienced local guides.</p>
          <Link to="/trails" className="cta-button">
            Explore Trails
          </Link>
        </div>
      </section>

      <section className="featured-trails">
        <div className="section-header">
          <h2>Featured Trails</h2>
          <Link to="/trails" className="view-all">
            View All
          </Link>
        </div>
        {loading ? (
          <div className="loading">Loading featured trails...</div>
        ) : (
          <div className="trails-grid">
            {featuredTrails.map((trail) => (
              <div key={trail.id} className="trail-card">
                <div className="trail-image">
                  <img src={trail.imageUrl || '/images/default-trail.jpg'} alt={trail.name} />
                </div>
                <div className="trail-info">
                  <h3>{trail.name}</h3>
                  <p className="trail-location">{trail.location}</p>
                  <div className="trail-details">
                    <span className="trail-difficulty">{trail.difficulty}</span>
                    <span className="trail-length">{trail.length} km</span>
                  </div>
                  <Link to={`/trails/${trail.id}`} className="trail-link">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="why-choose-us">
        <h2>Why Choose Hike&Book?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-map-marked-alt"></i>
            </div>
            <h3>Curated Trails</h3>
            <p>Discover carefully selected trails that offer the best hiking experiences.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-user-friends"></i>
            </div>
            <h3>Expert Guides</h3>
            <p>Connect with experienced local guides who know the trails inside out.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <h3>Easy Booking</h3>
            <p>Book your hiking tours with just a few clicks, no hassle.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to hit the trails?</h2>
          <p>Join Hike&Book today and start your next adventure!</p>
          <Link to="/register" className="cta-button">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;