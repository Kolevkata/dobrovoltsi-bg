// /src/pages/AdminDashboard.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Alert, Spinner, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HoverDropdown from '../components/HoverDropdown'; // Import HoverDropdown
import './AdminDashboard.css'; // Import custom CSS

const AdminDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchAllInitiatives = async () => {
      try {
        const res = await axios.get('/initiatives', {
          headers: { Authorization: `Bearer ${auth.accessToken}` }
        });
        setInitiatives(res.data);
      } catch (err) {
        console.error(err);
        setError('Грешка при зареждане на инициативите');
      } finally {
        setLoading(false);
      }
    };
    fetchAllInitiatives();
  }, [auth]);

  const approveInitiative = async (id) => {
    try {
      await axios.put(`/initiatives/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${auth.accessToken}` }
      });
      setMessage('Инициативата е одобрена!');
      setInitiatives(initiatives.map(i => i.id === id ? { ...i, approved: true } : i));
    } catch (err) {
      console.error(err);
      setError('Грешка при одобряване на инициативата');
    }
  };

  const deleteInitiative = async (id) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете тази инициатива?')) return;
    try {
      await axios.delete(`/initiatives/${id}`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` }
      });
      setInitiatives(initiatives.filter(i => i.id !== id));
      setMessage('Инициативата е изтрита успешно');
    } catch (err) {
      console.error(err);
      setError('Грешка при изтриване на инициативата');
    }
  };

  if (loading) return <div className="container mt-5 text-center"><Spinner animation="border"/></div>;
  if (error) return <div className="container mt-5"><Alert variant="danger">{error}</Alert></div>;

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      {message && <Alert variant="success" dismissible onClose={() => setMessage(null)}>{message}</Alert>}
      <Link to="/admin/users" className="btn btn-secondary mb-3">Управление на Потребители</Link>
      <h3>Инициативи</h3>
      {initiatives.length === 0 ? (
        <Alert variant="info">Няма инициативи.</Alert>
      ) : (
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Заглавие</th>
              <th>Организатор</th>
              <th>Одобрена</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {initiatives.map(init => (
              <tr key={init.id}>
                <td>{init.title}</td>
                <td>
                  {init.organizer ? (
                    <>
                      {init.organizer.name} ({init.organizer.email}){' '}
                      <Link to={`/profile/user/${init.organizer.id}`} className="btn btn-info btn-sm text-white ms-2">
                        Преглед Организатор
                      </Link>
                    </>
                  ) : 'N/A'}
                </td>
                <td>{init.approved ? 'Да' : 'Не'}</td>
                <td>
                  <HoverDropdown>
                    <Dropdown.Toggle variant="secondary" id={`dropdown-${init.id}`}>
                      Действия
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to={`/initiatives/${init.id}`}>
                        Преглед
                      </Dropdown.Item>
                      {!init.approved && (
                        <Dropdown.Item onClick={() => approveInitiative(init.id)}>
                          Одобряване
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item onClick={() => deleteInitiative(init.id)}>
                        Изтриване
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </HoverDropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
