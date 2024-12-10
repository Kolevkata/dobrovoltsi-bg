// /frontend/src/components/ApplicationsList.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext'; // Imported AuthContext

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

  return (
    <div className="applications-list">
      <table className="table table-striped">
        <thead>
          <tr>
            {isVolunteer ? (
              <>
                <th>Инициатива</th>
                <th>Статус</th>
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
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleStatusChange(application.id, 'Approved')}
                      disabled={application.status === 'Approved'}
                    >
                      Одобряване
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleStatusChange(application.id, 'Denied')}
                      disabled={application.status === 'Denied'}
                    >
                      Отхвърляне
                    </button>
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
