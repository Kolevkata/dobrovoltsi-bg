// /src/pages/ProfileEdit.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Spinner } from 'react-bootstrap';

const ProfileEdit = () => {
  const { auth, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '', profileImage: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async() => {
      try {
        const res = await axios.get('/users/me', {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`
          }
        });
        setUser({ name: res.data.name, email: res.data.email, profileImage: res.data.profileImage });
      } catch(err) {
        console.error(err);
        setError('Грешка при зареждане на профила');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [auth.accessToken]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <Card className="p-4 shadow-sm" style={{maxWidth: '500px', width: '100%'}}>
        <h2 className="mb-4 text-center">Редактиране на Профил</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group mb-3">
            <label>Име</label>
            <input 
              type="text" 
              className="form-control" 
              value={user.name}
              onChange={(e) => setUser({...user, name:e.target.value})}
            />
          </div>
          <div className="form-group mb-3">
            <label>Имейл</label>
            <input 
              type="email" 
              className="form-control" 
              value={user.email}
              onChange={(e) => setUser({...user, email:e.target.value})}
            />
          </div>
          <div className="form-group mb-3">
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
          <Button type="submit" variant="primary" className="w-100 mt-3" disabled={submitting}>
            {submitting ? <Spinner as="span" animation="border" size="sm" /> : 'Запазване'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ProfileEdit;
