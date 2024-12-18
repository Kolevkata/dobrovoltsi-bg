// /src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container mt-5 text-center">
    <h1>404</h1>
    <p>Страницата, която търсите, не беше намерена.</p>
    <Link to="/" className="btn btn-primary">
      Върнете се на началната страница
    </Link>
  </div>
);

export default NotFound;
