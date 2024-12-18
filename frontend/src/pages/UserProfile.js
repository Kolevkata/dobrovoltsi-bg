// /src/pages/VolunteerProfile.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';

const VolunteerProfile = () => {
  const { auth } = useContext(AuthContext);
  const { id } = useParams();
  const [volunteer, setVolunteer] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVolunteer = async() => {
      try {
        const res = await axios.get(`/admin/users/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`
          }
        });
        setVolunteer(res.data);
      } catch(err) {
        console.error(err);
        setError('Грешка при зареждане на профила на доброволеца.');
      }
    };
    fetchVolunteer();
  }, [auth, id]);

  if (error) return <div className="container mt-5">{error}</div>;
  if (!volunteer) return <div className="container mt-5">Зареждане...</div>;

  return (
    <div className="container mt-5">
      <h2>Профил на Доброволец</h2>
      {volunteer.profileImage && <img src={volunteer.profileImage} alt="Profile" style={{width:'150px', borderRadius:'50%'}} />}
      <p><strong>Име:</strong> {volunteer.name}</p>
      <p><strong>Имейл:</strong> {volunteer.email}</p>
      <p><strong>Роля:</strong> {volunteer.role}</p>
    </div>
  );
};

export default VolunteerProfile;
