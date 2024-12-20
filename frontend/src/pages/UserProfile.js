// /src/pages/UserProfile.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import { Spinner, Alert, Card, Badge } from 'react-bootstrap';

const UserProfile = () => {
  const { auth } = useContext(AuthContext);
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async() => {
      try {
        const res = await axios.get(`/admin/users/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`
          }
        });
        setUserProfile(res.data);
      } catch(err) {
        console.error(err);
        setError(err.response?.data?.msg || 'Грешка при зареждане на профила на потребителя.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [auth, id]);

  if (loading) return (
    <div className="container mt-5 text-center">
      <Spinner animation="border"/>
    </div>
  );

  if (error) return (
    <div className="container mt-5">
      <Alert variant="danger">{error}</Alert>
    </div>
  );

  if (!userProfile) return (
    <div className="container mt-5">
      <Alert variant="info">Потребителят не е намерен.</Alert>
    </div>
  );

  const roleLabel = userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1);

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <Card className="p-4 shadow-sm" style={{maxWidth: '500px', width:'100%'}}>
        <div className="d-flex flex-column align-items-center">
          {userProfile.profileImage ? (
            <img 
              src={userProfile.profileImage} 
              alt="Profile" 
              style={{width:'120px',height:'120px',objectFit:'cover',borderRadius:'50%',marginBottom:'20px'}} 
            />
          ) : (
            <div 
              style={{
                width:'120px',
                height:'120px',
                borderRadius:'50%',
                background:'#ddd',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                fontSize:'24px',
                color:'#555',
                marginBottom:'20px'
              }}
            >
              <i className="fas fa-user"></i>
            </div>
          )}

          <h2 className="mb-2">{userProfile.name}</h2>
          <p className="text-muted mb-3">{userProfile.email}</p>
          <Badge bg="info" className="mb-4">{roleLabel}</Badge>

          <div className="text-center">
            {userProfile.role === 'volunteer' && (
              <p className="mb-1"><strong>Тип потребител:</strong> Доброволец</p>
            )}
            {userProfile.role === 'organizer' && (
              <p className="mb-1"><strong>Тип потребител:</strong> Организатор</p>
            )}
            {userProfile.role === 'admin' && (
              <p className="mb-1"><strong>Тип потребител:</strong> Администратор</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
