// /src/App.js
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
import ProfileEdit from './pages/ProfileEdit'; 
import ChangePassword from './pages/ChangePassword';
import UserProfile from './pages/UserProfile'; 
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import NotFound from './pages/NotFound'; 


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
              } />
              <Route path="/initiatives/:id" element={<InitiativeDetail />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile/edit"
                element={
                  <PrivateRoute>
                    <ProfileEdit />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile/change-password"
                element={
                  <PrivateRoute>
                    <ChangePassword />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile/user/:id"
                element={
                  <PrivateRoute>
                    <UserProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute roles={['admin']}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <PrivateRoute roles={['admin']}>
                    <AdminUsers />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
