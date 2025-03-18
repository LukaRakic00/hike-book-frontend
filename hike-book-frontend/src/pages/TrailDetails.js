import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { API_URL } from '../config';
import { FaCalendarAlt, FaMapMarkerAlt, FaMountain, FaRuler, FaClock, FaUserFriends, FaEuroSign } from 'react-icons/fa';
import './TrailDetail.css';

const TrailDetail = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [trail, setTrail] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    const fetchTrailDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/trails/${id}`);
        setTrail(response.data);
        
        // Fetch available dates
        const datesResponse = await axios.get(`${API_URL}/api/trails/${id}/available-dates`);
        setAvailableDates(datesResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trail details:', err);
        setError('Failed to load trail details. Please try again later.');
        setLoading(false);
      }
    };

    fetchTrailDetails();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login', { state: { from: `/trails/${id}` } });
      return;
    }

    setBookingError(null);
    setBookingSuccess(false);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/bookings`,
        {
          trailId: parseInt(id),
          date: bookingDate,
          numberOfPeople: parseInt(numberOfPeople)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setBookingSuccess(true);
      setBookingDate('');
      setNumberOfPeople(1);
      
      // Refresh available dates
      const datesResponse = await axios.get(`${API_URL}/api/trails/${id}/available-dates`);
      setAvailableDates(datesResponse.data);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to book the trail. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading trail details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!trail) {
    return <div className="error-message">Trail not found.</div>;
  }

  return (
    <div className="trail-detail-container">
      <div className="trail-detail-header">
        <h1>{trail.name}</h1>
        <div className="trail-detail-meta">
          <div className="trail-meta-item">
            <FaMapMarkerAlt className="meta-icon" />
            <span>{trail.location}</span>
          </div>
          <div className="trail-meta-item">
            <FaMountain className="meta-icon" />
            <span>{trail.difficulty}</span>
          </div>
          <div className="trail-meta-item">
            <FaRuler className="meta-icon" />
            <span>{trail.length} km</span>
          </div>
          <div className="trail-meta-item">
            <FaClock className="meta-icon" />
            <span>{trail.duration} hours</span>
          </div>
          <div className="trail-meta-item">
            <FaEuroSign className="meta-icon" />
            <span>{trail.price} EUR</span>
          </div>
        </div>
      </div>

      <div className="trail-detail-content">
        <div className="trail-detail-image">
          <img src={trail.imageUrl || '/images/default-trail.jpg'} alt={trail.name} />
        </div>

        <div className="trail-detail-info">
          <div className="trail-detail-description">
            <h2>Description</h2>
            <p>{trail.description}</p>
          </div>

          <div className="trail-detail-features">
            <h2>Features</h2>
            <ul>
              {trail.features && trail.features.split(',').map((feature, index) => (
                <li key={index}>{feature.trim()}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="trail-booking-form">
          <h2>Book This Trail</h2>
          {bookingSuccess && <div className="success-message">Booking successful! Check your bookings for details.</div>}
          {bookingError && <div className="error-message">{bookingError}</div>}
          {!currentUser && (
            <div className="login-prompt">
              <p>You need to be logged in to book this trail.</p>
              <Link to="/login" state={{ from: `/trails/${id}` }} className="login-button">
                Login to Book
              </Link>
            </div>
          )}
          {currentUser && (
            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label htmlFor="bookingDate">Select Date</label>
                <select
                  id="bookingDate"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                >
                  <option value="">Select a date</option>
                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="numberOfPeople">Number of People</label>
                <div className="number-input">
                  <button
                    type="button"
                    onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                    className="number-btn"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="numberOfPeople"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setNumberOfPeople(numberOfPeople + 1)}
                    className="number-btn"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="form-group total-price">
                <span>Total Price:</span>
                <span>{trail.price * numberOfPeople} EUR</span>
              </div>
              <button type="submit" className="booking-button">Book Now</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailDetail;