// /frontend/src/components/ApplicationsList.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext'; // Imported AuthContext
import { Button } from 'react-bootstrap';

const ApplicationsList = ({ applications, isVolunteer = false, refreshApplications }) => {
  const { auth } = useContext(AuthContext); // Access auth context

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await axios.put(
        `/applications/${applicationId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      refreshApplications(); // Refresh the list after status update
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.msg || 'Грешка при актуализиране на статуса');
    }
  };

  const handleDelete = async (applicationId) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете тази кандидатура?')) return;
    try {
      await axios.delete(`/applications/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      alert('Кандидатурата е изтрита успешно.');
      refreshApplications(); // Refresh the list after deletion
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.msg || 'Грешка при изтриване на кандидатурата');
    }
  };

  return (
    <div className="applications-list">
      <table className="table table-striped">
        <thead>
          <tr>
            {isVolunteer ? (
              <>
                <th>Инициатива</th>
                <th>Статус</th>
                <th>Действия</th>
              </>
            ) : (
              <>
                <th>Доброволец</th>
                <th>Инициатива</th>
                <th>Статус</th>
                <th>Действия</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              {isVolunteer ? (
                <>
                  <td>
                    <Link to={`/initiatives/${application.initiative.id}`}>
                      {application.initiative.title}
                    </Link>
                  </td>
                  <td>{application.status}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(application.id)}
                      disabled={application.status === 'Approved' || application.status === 'Denied'}
                    >
                      Изтриване
                    </Button>
                  </td>
                </>
              ) : (
                <>
                  <td>{application.volunteer.name} ({application.volunteer.email})</td>
                  <td>
                    <Link to={`/initiatives/${application.initiative.id}`}>
                      {application.initiative.title}
                    </Link>
                  </td>
                  <td>{application.status}</td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleStatusChange(application.id, 'Approved')}
                      disabled={application.status === 'Approved'}
                    >
                      Одобряване
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleStatusChange(application.id, 'Denied')}
                      disabled={application.status === 'Denied'}
                    >
                      Отхвърляне
                    </Button>
                    {auth.user.role === 'admin' && (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleDelete(application.id)}
                        disabled={false}
                      >
                        Изтриване
                      </Button>
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsList;
