// /src/pages/InitiativeDetail.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; 
import { Spinner, Button, Alert } from 'react-bootstrap'; 

const InitiativeDetail = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext); 
  const [initiative, setInitiative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
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
    const checkApplication = async () => {
      if (auth.user && auth.user.role === 'volunteer') {
        try {
          const res = await axios.get('/applications/user', {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          });

          const applied = res.data.some(
            (application) => application.initiativeId === parseInt(id)
          );
          setHasApplied(applied);
        } catch (err) {
          console.error(err);
        }
      }
    };

    checkApplication();
  }, [auth, id]);

  const handleApply = async () => {
    setApplying(true);
    setMessage(null);

    try {
      await axios.post(
        '/applications',
        { initiativeId: id },
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      setHasApplied(true);
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
        <strong>Локация:</strong> {initiative.location}
      </p>
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

      {auth.user && auth.user.role === 'volunteer' && (
        <>
          {message && (
            <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
              {message.text}
            </Alert>
          )}
          <Button
            variant="primary"
            onClick={handleApply}
            disabled={hasApplied || applying}
          >
            {applying ? 'Подаване...' : hasApplied ? 'Вече сте кандидатствали' : 'Кандидатстване'}
          </Button>
        </>
      )}
    </div>
  );
};

export default InitiativeDetail;
