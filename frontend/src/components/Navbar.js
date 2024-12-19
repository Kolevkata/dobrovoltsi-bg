// /src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const isAuthenticated = !!auth.accessToken;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavLinkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Доброволци БГ
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className={getNavLinkClass} to="/initiatives">
                Инициативи
              </NavLink>
            </li>
            {isAuthenticated && auth.user.role === 'organizer' && (
              <li className="nav-item">
                <NavLink className={getNavLinkClass} to="/initiatives/add">
                  Добавяне на инициатива
                </NavLink>
              </li>
            )}

            {/* Dashboard Link for Non-Admin Authenticated Users */}
            {isAuthenticated && auth.user.role !== 'admin' && (
              <li className="nav-item">
                <NavLink className={getNavLinkClass} to="/dashboard">
                  Dashboard
                </NavLink>
              </li>
            )}
            {isAuthenticated && auth.user.role === 'admin' && (
              <li className="nav-item">
                <NavLink className={getNavLinkClass} to="/admin">
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#!"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {auth.user.profileImage && (
                    <img 
                      src={auth.user.profileImage}
                      alt="Profile"
                      style={{width:'30px', height:'30px', borderRadius:'50%', marginRight:'8px'}}
                    />
                  )}
                  Профил
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li>
                    <NavLink className="dropdown-item" to="/profile">
                      Моят Профил
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/profile/edit">
                      Редактиране на Профил
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/profile/change-password">
                      Смяна на Парола
                    </NavLink>
                  </li>
                  {auth.user.role === 'admin' && (
                    <>
                      <li>
                        <NavLink className="dropdown-item" to="/admin/users">
                          Управление на Потребители
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className="dropdown-item" to="/admin/metrics">
                          Метрики
                        </NavLink>
                      </li>
                    </>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Изход
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className={getNavLinkClass} to="/login">
                    Вход
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={getNavLinkClass} to="/register">
                    Регистрация
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
