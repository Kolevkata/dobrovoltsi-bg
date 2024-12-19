// /src/pages/InitiativeDetail.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; 
import { Spinner, Button, Alert, Form, Card } from 'react-bootstrap'; 
import InitiativesMap from '../components/InitiativesMap'; 
import './InitiativeDetail.css';

const InitiativeDetail = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext); 
  const [initiative, setInitiative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [application, setApplication] = useState(null); 
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState(null);

  // Коментари
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [errorComments, setErrorComments] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentMessage, setCommentMessage] = useState(null);

  // Вземане на детайли за инициативата
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

  // Проверка дали доброволецът вече е кандидатствал
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

  // Вземане на коментари
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/initiatives/${id}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error(err);
        setErrorComments(true);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [id]);

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

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentContent.trim()) {
      setCommentMessage({ type: 'danger', text: 'Коментарът не може да бъде празен.' });
      return;
    }

    setSubmittingComment(true);
    setCommentMessage(null);

    try {
      const res = await axios.post(
        `/initiatives/${id}/comments`,
        { content: newCommentContent },
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      setComments([...comments, res.data]);
      setNewCommentContent('');
      setCommentMessage({ type: 'success', text: 'Коментарът е добавен успешно.' });
    } catch (err) {
      console.error(err.response?.data || err);
      setCommentMessage({
        type: 'danger',
        text: err.response?.data?.msg || 'Грешка при добавяне на коментар',
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете този коментар?')) return;

    try {
      await axios.delete(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      setComments(comments.filter(comment => comment.id !== commentId));
      setCommentMessage({ type: 'success', text: 'Коментарът е изтрит успешно.' });
    } catch (err) {
      console.error(err.response?.data || err);
      setCommentMessage({
        type: 'danger',
        text: err.response?.data?.msg || 'Грешка при изтриване на коментара',
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
    <div className="container mt-5 initiative-detail-container">
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
        <div className="initiative-map">
          <InitiativesMap
            latitude={initiative.latitude}
            longitude={initiative.longitude}
            title={initiative.title}
            description={initiative.description}
          />
        </div>
      )}

      {/* Секция за коментари */}
      <div className="mt-5">
        <h3>Коментари</h3>
        {commentMessage && (
          <Alert variant={commentMessage.type} onClose={() => setCommentMessage(null)} dismissible>
            {commentMessage.text}
          </Alert>
        )}
        {auth.user ? (
          <Form onSubmit={handleAddComment} className="mb-4">
            <Form.Group controlId="commentContent">
              <Form.Label>Добавете коментар:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                placeholder="Напишете вашия коментар..."
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2" disabled={submittingComment}>
              {submittingComment ? 'Добавяне...' : 'Добавяне на коментар'}
            </Button>
          </Form>
        ) : (
          <Alert variant="info">Моля, влезте или се регистрирайте, за да добавите коментари.</Alert>
        )}

        {loadingComments ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : errorComments ? (
          <Alert variant="danger">Грешка при зареждане на коментарите.</Alert>
        ) : comments.length === 0 ? (
          <Alert variant="info">Няма коментари за тази инициатива.</Alert>
        ) : (
          <div>
            {comments.map(comment => (
              <div key={comment.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{comment.user.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{new Date(comment.createdAt).toLocaleString()}</Card.Subtitle>
                    <Card.Text>{comment.content}</Card.Text>
                    {(auth.user && (auth.user.id === comment.userId || auth.user.role === 'admin')) && (
                      <Button variant="danger" size="sm" onClick={() => handleDeleteComment(comment.id)}>
                        Изтриване
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Секция за кандидатура (само за доброволци) */}
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
