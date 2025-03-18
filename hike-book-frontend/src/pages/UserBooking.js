import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { API_URL } from '../config';
import { FaCalendarAlt, FaUserFriends, FaEuroSign, FaTrash } from 'react-icons/fa';
import './UserBookings.css';

const UserBookings = () => {
  const { currentUser } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/bookings/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load your bookings. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancelSuccess(false);
    setCancelError(null);

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove the canceled booking from the list
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      setCancelSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setCancelSuccess(false);
      }, 3000);
    } catch (err) {
      setCancelError(err.response?.data?.message || 'Failed to cancel booking. Please try again.');
    }
  };

  // Check if booking date is in the past
  const isPastDate = (dateString) => {
    const bookingDate = new Date(dateString);
    const today = new Date();
    return bookingDate < today;
  };

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  return (
    <div className="user-bookings-container">
      <div className="user-bookings-header">
        <h1>My Bookings</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {cancelSuccess && <div className="success-message">Booking canceled successfully!</div>}
      {cancelError && <div className="error-message">{cancelError}</div>}

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You don't have any bookings yet.</p>
          <Link to="/trails" className="explore-button">
            Explore Trails
          </Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-image">
                <img src={booking.trail.imageUrl || '/images/default-trail.jpg'} alt={booking.trail.name} />
              </div>
              <div className="booking-info">
                <h3>{booking.trail.name}</h3>
                <p className="booking-location">{booking.trail.location}</p>
                <div className="booking-details">
                  <div className="booking-detail">
                    <FaCalendarAlt className="booking-icon" />
                    <span>{new Date(booking.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="booking-detail">
                    <FaUserFriends className="booking-icon" />
                    <span>{booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'person' : 'people'}</span>
                  </div>
                  <div className="booking-detail">
                    <FaEuroSign className="booking-icon" />
                    <span>{booking.totalPrice} EUR</span>
                  </div>
                </div>
                <div className="booking-actions">
                  <Link to={`/trails/${booking.trail.id}`} className="view-trail-button">
                    View Trail
                  </Link>
                  {!isPastDate(booking.date) && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="cancel-button"
                    >
                      <FaTrash className="cancel-icon" /> Cancel Booking
                    </button>
                  )}
                  {isPastDate(booking.date) && (
                    <span className="completed-badge">Completed</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;