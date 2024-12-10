// /frontend/src/pages/Dashboard.js
import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import InitiativeCard from '../components/InitiativeCard';
import { Link } from 'react-router-dom';
import ApplicationsList from '../components/ApplicationsList'; 
import { Spinner, Alert } from 'react-bootstrap';

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const [initiatives, setInitiatives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingInitiatives, setLoadingInitiatives] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [errorInitiatives, setErrorInitiatives] = useState(false);
  const [errorApplications, setErrorApplications] = useState(false);

  // Function to fetch initiatives (for organizers)
  const fetchInitiatives = useCallback(async () => {
    try {
      const res = await axios.get('/initiatives', {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      const organizerInitiatives = res.data.filter(
        (initiative) => initiative.organizerId === auth.user.id
      );
      setInitiatives(organizerInitiatives);
    } catch (err) {
      console.error(err);
      setErrorInitiatives(true);
    } finally {
      setLoadingInitiatives(false);
    }
  }, [auth.accessToken, auth.user.id]);

  // Function to fetch applications (for organizers)
  const fetchApplicationsForOrganizer = useCallback(async () => {
    try {
      const res = await axios.get('/applications/organizer', {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      setErrorApplications(true);
    } finally {
      setLoadingApplications(false);
    }
  }, [auth.accessToken]);

  // Function to fetch applications (for volunteers)
  const fetchApplicationsForVolunteer = useCallback(async () => {
    try {
      const res = await axios.get('/applications/user', {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      setErrorApplications(true);
    } finally {
      setLoadingApplications(false);
    }
  }, [auth.accessToken]);

  // Function to fetch initiatives (organizers) and applications
  useEffect(() => {
    if (auth.user.role === 'organizer') {
      fetchInitiatives();
      fetchApplicationsForOrganizer();
    } else if (auth.user.role === 'volunteer') {
      fetchApplicationsForVolunteer();
    }
  }, [auth.user.role, fetchInitiatives, fetchApplicationsForOrganizer, fetchApplicationsForVolunteer]);

  // Function to refresh applications after status change or new application
  const refreshApplications = () => {
    setLoadingApplications(true);
    if (auth.user.role === 'organizer') {
      fetchApplicationsForOrganizer();
    } else if (auth.user.role === 'volunteer') {
      fetchApplicationsForVolunteer();
    }
  };

  // Function to handle initiative deletion (for organizers)
  const handleDelete = async (id) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете тази инициатива?')) {
      try {
        await axios.delete(`/initiatives/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        // Update the initiatives list after deletion
        setInitiatives(initiatives.filter((initiative) => initiative.id !== id));
      } catch (err) {
        console.error(err.response?.data || err);
        alert(err.response?.data?.msg || 'Грешка при изтриване на инициативата');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Моят Dashboard</h2>

      {auth.user.role === 'organizer' && (
        <>
          <Link to="/initiatives/add" className="btn btn-success mb-4">
            Добавяне на нова инициатива
          </Link>
          {loadingInitiatives ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : errorInitiatives ? (
            <Alert variant="danger">Грешка при зареждане на инициативите.</Alert>
          ) : initiatives.length === 0 ? (
            <Alert variant="info">Нямате създадени инициативи.</Alert>
          ) : (
            <div className="row">
              {initiatives.map((initiative) => (
                <div className="col-md-4 d-flex" key={initiative.id}>
                  <InitiativeCard
                    initiative={initiative}
                    isOrganizer={true}
                    onDelete={handleDelete} // Pass handleDelete to InitiativeCard
                  />
                </div>
              ))}
            </div>
          )}

          <h3 className="mt-5">Кандидатури за вашите инициативи</h3>
          {loadingApplications ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : errorApplications ? (
            <Alert variant="danger">Грешка при зареждане на кандидатурите.</Alert>
          ) : applications.length === 0 ? (
            <Alert variant="info">Няма кандидатури за вашите инициативи.</Alert>
          ) : (
            <ApplicationsList
              applications={applications}
              refreshApplications={refreshApplications} // Pass refresh function
            />
          )}
        </>
      )}

      {auth.user.role === 'volunteer' && (
        <>
          <h3>Вашите подадени кандидатури</h3>
          {loadingApplications ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : errorApplications ? (
            <Alert variant="danger">Грешка при зареждане на вашите кандидатури.</Alert>
          ) : applications.length === 0 ? (
            <Alert variant="info">Все още не сте кандидатствали за никакви инициативи.</Alert>
          ) : (
            <ApplicationsList
              applications={applications}
              isVolunteer={true} // Set isVolunteer to true
            />
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
