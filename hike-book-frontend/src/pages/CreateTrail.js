import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { API_URL } from '../config';
import './CreateTrail.css';

const CreateTrail = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    length: '',
    duration: '',
    difficulty: 'MODERATE',
    features: '',
    price: '',
    imageUrl: '',
    availableDates: ['']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (index, value) => {
    const updatedDates = [...formData.availableDates];
    updatedDates[index] = value;
    setFormData({
      ...formData,
      availableDates: updatedDates
    });
  };

  const addDateField = () => {
    setFormData({
      ...formData,
      availableDates: [...formData.availableDates, '']
    });
  };

  const removeDateField = (index) => {
    const updatedDates = formData.availableDates.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      availableDates: updatedDates
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Filter out empty dates
    const filteredDates = formData.availableDates.filter(date => date.trim() !== '');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/trails`,
        {
          ...formData,
          length: parseFloat(formData.length),
          duration: parseFloat(formData.duration),
          price: parseFloat(formData.price),
          availableDates: filteredDates
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      navigate(`/trails/${response.data.id}`);
    } catch (err) {
      console.error('Error creating trail:', err);
      setError(err.response?.data?.message || 'Failed to create trail. Please try again.');
      setLoading(false);
    }
  };

  // Check if user has admin role
  if (currentUser && !currentUser.roles.includes('ROLE_ADMIN')) {
    return (
      <div className="create-trail-container">
        <div className="access-denied">
          <h1>Access Denied</h1>
          <p>You need administrator privileges to create trails.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-trail-container">
      <div className="create-trail-header">
        <h1>Create New Trail</h1>
      </div>

      <div className="create-trail-form-container">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="create-trail-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label htmlFor="name">Trail Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Trail Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="length">Length (km)</label>
                <input
                  type="number"
                  id="length"
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  step="0.1"
                  min="0.1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="duration">Duration (hours)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  step="0.5"
                  min="0.5"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="difficulty">Difficulty</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  required
                >
                  <option value="EASY">Easy</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="DIFFICULT">Difficult</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="price">Price (EUR)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="features">Features (comma separated)</label>
              <input
                type="text"
                id="features"
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="e.g. Waterfall, Forest, Mountain View"
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Available Dates</h2>
            <p>Add dates when this trail is available for booking:</p>
            
            {formData.availableDates.map((date, index) => (
              <div key={index} className="date-input-group">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => handleDateChange(index, e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                {formData.availableDates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDateField(index)}
                    className="remove-date-button"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={addDateField}
              className="add-date-button"
            >
              Add More Dates
            </button>
          </div>

          <div className="form-actions">
            <button type="submit" className="create-button" disabled={loading}>
              {loading ? 'Creating...' : 'Create Trail'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrail;