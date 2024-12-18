// /src/pages/ProfileEdit.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileEdit = () => {
  const { auth, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '', profileImage: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async() => {
      try {
        const res = await axios.get('/users/me', {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`
          }
        });
        setUser({ name: res.data.name, email: res.data.email, profileImage: res.data.profileImage });
        setLoading(false);
      } catch(err) {
        console.error(err);
        setError('Грешка при зареждане на профила');
        setLoading(false);
      }
    };
    fetchProfile();
  }, [auth]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    if (user.newImage) {
      formData.append('profileImage', user.newImage);
    }

    try {
      await axios.put('/users/me', formData, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      // Re-fetch updated profile data to update AuthContext and display in Navbar
      const updatedRes = await axios.get('/users/me', {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        }
      });
      updateUser(updatedRes.data);
      navigate('/profile');
    } catch(err) {
      console.error(err);
      setError('Грешка при актуализиране на профила');
    }
  };

  if (loading) return <div className="container mt-5">Зареждане...</div>;

  return (
    <div className="container mt-5">
      <h2>Редактиране на Профил</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Име</label>
          <input 
            type="text" 
            className="form-control" 
            value={user.name}
            onChange={(e) => setUser({...user, name:e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Имейл</label>
          <input 
            type="email" 
            className="form-control" 
            value={user.email}
            onChange={(e) => setUser({...user, email:e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Профилна Снимка</label>
          {user.profileImage && (
            <div className="mb-2">
              <img 
                src={user.profileImage} 
                alt="Профилна снимка" 
                style={{width:'100px',height:'100px',objectFit:'cover',borderRadius:'50%'}} 
              />
            </div>
          )}
          <input 
            type="file" 
            className="form-control"
            onChange={(e) => setUser({...user, newImage:e.target.files[0]})}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Запазване</button>
      </form>
    </div>
  );
};

export default ProfileEdit;
