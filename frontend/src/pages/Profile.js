// /src/pages/Profile.js
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const [user, setUser] = useState(auth.user);
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/users/profile');
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchProfile();
    }
  }, [user]);

  if (loading) return <div className="container mt-5">Зареждане...</div>;
  if (error) return <div className="container mt-5">Грешка при зареждане на профила.</div>;

  return (
    <div className="container mt-5">
      <h2>Моят Профил</h2>
      <p><strong>Име:</strong> {user.name}</p>
      <p><strong>Имейл:</strong> {user.email}</p>
      <p><strong>Роля:</strong> {user.role}</p>
      {/* Add profile editing functionalities here */}
    </div>
  );
};

export default Profile;
