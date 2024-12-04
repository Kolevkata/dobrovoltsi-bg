// /src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <Link className="navbar-brand" to="/">Доброволци БГ</Link>
    <div className="collapse navbar-collapse">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/login">Вход</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/register">Регистрация</Link>
        </li>
      </ul>
    </div>
  </nav>
);

export default Navbar;