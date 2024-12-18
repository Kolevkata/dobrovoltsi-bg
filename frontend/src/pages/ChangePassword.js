// /src/pages/ChangePassword.js
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error,setError] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await axios.put('/users/change-password', { currentPassword, newPassword }, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        }
      });
      navigate('/profile');
    } catch(err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Грешка при смяна на паролата');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Смяна на Парола</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Текуща Парола</label>
          <input 
            type="password" 
            className="form-control"
            value={currentPassword}
            onChange={(e)=>setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Нова Парола</label>
          <input 
            type="password" 
            className="form-control"
            value={newPassword}
            onChange={(e)=>setNewPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Смяна</button>
      </form>
    </div>
  );
};

export default ChangePassword;
