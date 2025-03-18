import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Trails from './pages/Trails';
import TrailDetail from './pages/TrailDetail';
import Profile from './pages/Profile';
import CreateTrail from './pages/CreateTrail';
import UserBookings from './pages/UserBookings';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/trails" element={<Trails />} />
              <Route path="/trails/:id" element={<TrailDetail />} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/create-trail" element={<PrivateRoute><CreateTrail /></PrivateRoute>} />
              <Route path="/my-bookings" element={<PrivateRoute><UserBookings /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute admin={true}><AdminDashboard /></PrivateRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;