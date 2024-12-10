// /frontend/src/components/InitiativeCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const InitiativeCard = ({ initiative, isOrganizer = false, onDelete }) => (
  <div className="card mb-4 h-100">
    <img src={initiative.imageUrl} className="card-img-top" alt={initiative.title} />
    <div className="card-body d-flex flex-column">
      <h5 className="card-title">{initiative.title}</h5>
      <p className="card-text">{initiative.description.substring(0, 100)}...</p>
      <Link to={`/initiatives/${initiative.id}`} className="btn btn-primary mt-auto mb-2">
        Виж повече
      </Link>
      {isOrganizer && (
        <div className="d-flex justify-content-between">
          <Link to={`/initiatives/edit/${initiative.id}`} className="btn btn-warning">
            Редактиране
          </Link>
          <button
            className="btn btn-danger"
            onClick={() => onDelete(initiative.id)} // Use onDelete prop
          >
            Изтриване
          </button>
        </div>
      )}
    </div>
  </div>
);

export default InitiativeCard;
