// /src/pages/Profile.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Spinner, Alert, Button } from 'react-bootstrap';

const Profile = () => {
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('/users/me', {
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`
                    }
                });
                setProfile(res.data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.msg || 'Грешка при зареждане на профила.');
                if (err.response?.status === 401) {
                    logout();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [auth.accessToken, logout, navigate]);

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <Alert variant="danger">{error}</Alert>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2>Моят Профил</h2>
            {message && (
                <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                    {message.text}
                </Alert>
            )}
            <Card className="mb-4">
                <Card.Body className="text-center">
                    {profile.profileImage ? (
                        <img
                            src={profile.profileImage}
                            alt="Профилна снимка"
                            style={{
                                width: '150px',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                marginBottom: '20px'
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                background: '#ccc',
                                margin: '0 auto 20px'
                            }}
                        ></div>
                    )}
                    <Card.Title style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{profile.name}</Card.Title>
                    <Card.Text><strong>Имейл:</strong> {profile.email}</Card.Text>
                    <Card.Text><strong>Роля:</strong> {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</Card.Text>
                </Card.Body>
            </Card>
            <div className="d-flex justify-content-between flex-wrap gap-2">
                <Link to="/profile/edit" className="btn btn-warning">Редактиране на профил</Link>
                <Link to="/profile/change-password" className="btn btn-secondary">Смяна на парола</Link>
                <Button variant="danger" onClick={() => { logout(); navigate('/'); }}>Изход</Button>
            </div>
        </div>
    );
};

export default Profile;
