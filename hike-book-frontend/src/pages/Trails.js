import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import './Trails.css';

const Trails = () => {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    difficulty: '',
    location: '',
    minLength: '',
    maxLength: '',
    searchTerm: ''
  });

  useEffect(() => {
    const fetchTrails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/trails`, {
          params: {
            difficulty: filters.difficulty || null,
            location: filters.location || null,
            minLength: filters.minLength || null,
            maxLength: filters.maxLength || null,
            searchTerm: filters.searchTerm || null
          }
        });
        setTrails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trails:', err);
        setError('Failed to load trails. Please try again later.');
        setLoading(false);
      }
    };

    fetchTrails();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // The useEffect will handle the filtering
  };

  const handleClearFilters = () => {
    setFilters({
      difficulty: '',
      location: '',
      minLength: '',
      maxLength: '',
      searchTerm: ''
    });
  };

  if (loading) {
    return <div className="loading">Loading trails...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="trails-container">
      <h1>Discover Hiking Trails</h1>
      
      <div className="filters-container">
        <form onSubmit={handleSubmit} className="filters-form">
          <div className="filters-row">
            <div className="filter-group">
              <label htmlFor="searchTerm">Search</label>
              <input
                type="text"
                id="searchTerm"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Search by name or description"
              />
            </div>
            <div className="filter-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Enter location"
              />
            </div>
          </div>
          <div className="filters-row">
            <div className="filter-group">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MODERATE">Moderate</option>
                <option value="DIFFICULT">Difficult</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="minLength">Min Length (km)</label>
              <input
                type="number"
                id="minLength"
                name="minLength"
                value={filters.minLength}
                onChange={handleFilterChange}
                min="0"
                step="0.1"
              />
            </div>
            <div className="filter-group">
              <label htmlFor="maxLength">Max Length (km)</label>
              <input
                type="number"
                id="maxLength"
                name="maxLength"
                value={filters.maxLength}
                onChange={handleFilterChange}
                min="0"
                step="0.1"
              />
            </div>
          </div>
          <div className="filters-buttons">
            <button type="submit" className="filter-button">Apply Filters</button>
            <button type="button" className="clear-button" onClick={handleClearFilters}>Clear Filters</button>
          </div>
        </form>
      </div>

      {trails.length === 0 ? (
        <div className="no-trails">No trails found matching your criteria.</div>
      ) : (
        <div className="trails-grid">
          {trails.map((trail) => (
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
                <p className="trail-description">{trail.description.substring(0, 100)}...</p>
                <Link to={`/trails/${trail.id}`} className="trail-link">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trails; 