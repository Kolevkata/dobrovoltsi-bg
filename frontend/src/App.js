// /frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import InitiativeList from './pages/InitiativeList';
import InitiativeDetail from './pages/InitiativeDetail';
import Profile from './pages/Profile';
import AddInitiative from './pages/AddInitiative';
import EditInitiative from './pages/EditInitiative'; 
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-fill">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/initiatives" element={<InitiativeList />} />
              <Route path="/initiatives/add" element={
                <PrivateRoute>
                  <AddInitiative />
                </PrivateRoute>
              } />
              <Route path="/initiatives/edit/:id" element={
                <PrivateRoute>
                  <EditInitiative />
                </PrivateRoute>
              } /> {/* Новият маршрут за редактиране */}
              <Route path="/initiatives/:id" element={<InitiativeDetail />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              {/* Add a catch-all route for 404 if desired */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

// Optional: Create a NotFound component
const NotFound = () => (
  <div className="container mt-5">
    <h2>404 - Страницата не е намерена</h2>
    <p>Съжаляваме, но страницата, която търсите, не съществува.</p>
  </div>
);

export default App;
