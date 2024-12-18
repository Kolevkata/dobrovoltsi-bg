// /src/pages/AdminUsers.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Alert, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
  const { auth } = useContext(AuthContext);
  const [users,setUsers] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [message,setMessage] = useState(null);

  useEffect(() => {
    const fetchUsers = async() => {
      try {
        const res = await axios.get('/admin/users', {
          headers: { Authorization: `Bearer ${auth.accessToken}` }
        });
        setUsers(res.data);
      } catch(err) {
        console.error(err);
        setError('Грешка при зареждане на потребителите');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [auth]);

  const deleteUser = async(id) => {
    if(!window.confirm('Сигурни ли сте, че искате да изтриете този потребител?')) return;
    try {
      await axios.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` }
      });
      setMessage('Потребителят е изтрит');
      setUsers(users.filter(u=>u.id!==id));
    } catch(err) {
      console.error(err);
      setError('Грешка при изтриване на потребителя');
    }
  };

  if (loading) return <div className="container mt-5 text-center"><Spinner animation="border"/></div>;
  if (error) return <div className="container mt-5"><Alert variant="danger">{error}</Alert></div>;

  return (
    <div className="container mt-5">
      <h2>Управление на Потребители</h2>
      {message && <Alert variant="success" dismissible onClose={()=>setMessage(null)}>{message}</Alert>}
      {users.length===0 ? (
        <Alert variant="info">Няма потребители.</Alert>
      ) : (
        <table className="table align-middle">
          <thead>
            <tr>
              <th></th>
              <th>Име</th>
              <th>Имейл</th>
              <th>Роля</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user=>(
              <tr key={user.id}>
                <td>
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Profile" 
                      style={{width:'50px',height:'50px',objectFit:'cover',borderRadius:'50%'}}
                    />
                  ) : (
                    <div style={{width:'50px',height:'50px',borderRadius:'50%',background:'#ccc'}}></div>
                  )}
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="d-flex gap-2">
                  <Button 
                    variant="danger" 
                    onClick={()=>deleteUser(user.id)}
                  >Изтриване</Button>
                  {(user.role==='volunteer' || user.role==='organizer') && 
                    <Link to={`/profile/user/${user.id}`} className="btn btn-info text-white">Преглед Профил</Link>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
