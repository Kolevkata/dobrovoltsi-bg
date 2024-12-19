// /src/pages/InitiativeDetail.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; 
import { Spinner, Button, Alert } from 'react-bootstrap'; 
import InitiativesMap from '../components/InitiativesMap'; 

const InitiativeDetail = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext); 
  const [initiative, setInitiative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [application, setApplication] = useState(null); 
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch initiative details
  useEffect(() => {
    const fetchInitiative = async () => {
      try {
        const res = await axios.get(`/initiatives/${id}`);
        setInitiative(res.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInitiative();
  }, [id]);

  // Check if the volunteer has already applied
  useEffect(() => {
    const fetchApplication = async () => {
      if (auth.user && auth.user.role === 'volunteer') {
        try {
          const res = await axios.get('/applications/user', {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          });

          const application = res.data.find(
            (app) => app.initiativeId === parseInt(id)
          );
          if (application) {
            setApplication(application);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchApplication();
  }, [auth, id]);

  const handleApply = async () => {
    setApplying(true);
    setMessage(null);

    try {
      const res = await axios.post(
        '/applications',
        { initiativeId: id },
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      setApplication(res.data);
      setMessage({ type: 'success', text: 'Кандидатурата ви е подадена успешно!' });
    } catch (err) {
      console.error(err.response?.data || err);
      setMessage({
        type: 'danger',
        text: err.response?.data?.msg || 'Грешка при подаване на кандидатурата',
      });
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    if (!application) return;
    if (!window.confirm('Сигурни ли сте, че искате да изтриете тази кандидатура?')) return;
    try {
      await axios.delete(`/applications/${application.id}`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      setApplication(null);
      setMessage({ type: 'success', text: 'Кандидатурата е изтрита успешно.' });
    } catch (err) {
      console.error(err.response?.data || err);
      setMessage({
        type: 'danger',
        text: err.response?.data?.msg || 'Грешка при изтриване на кандидатурата',
      });
    }
  };

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" />
      </div>
    );
  if (error)
    return (
      <div className="container mt-5">
        <Alert variant="danger">Грешка при зареждане на инициативата.</Alert>
      </div>
    );

  return (
    <div className="container mt-5">
      <h2>{initiative.title}</h2>
      {initiative.imageUrl && (
        <img
          src={initiative.imageUrl}
          className="img-fluid mb-4"
          alt={initiative.title}
        />
      )}
      <p>{initiative.description}</p>
      <p>
        <strong>Дата:</strong> {new Date(initiative.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Категория:</strong> {initiative.category}
      </p>
      <p>
        <strong>Организатор:</strong> {initiative.organizer ? initiative.organizer.name : 'N/A'} (
        {initiative.organizer ? initiative.organizer.email : 'N/A'})
      </p>

      {initiative.latitude && initiative.longitude && (
        <InitiativesMap
          latitude={initiative.latitude}
          longitude={initiative.longitude}
          title={initiative.title}
          description={initiative.description}
        />
      )}

      {auth.user && auth.user.role === 'volunteer' && (
        <>
          {message && (
            <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
              {message.text}
            </Alert>
          )}
          {!application ? (
            <Button
              variant="primary"
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? 'Подаване...' : 'Кандидатстване'}
            </Button>
          ) : (
            <>
              <Button
                variant="success"
                disabled
              >
                {application.status}
              </Button>
              <Button
                variant="danger"
                className="ms-2"
                onClick={handleDelete}
              >
                Изтриване на кандидатура
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default InitiativeDetail;
