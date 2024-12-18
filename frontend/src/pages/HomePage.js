// /src/pages/HomePage.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg';
import './HomePage.css';
import { AuthContext } from '../contexts/AuthContext';
import { Button } from 'react-bootstrap';

const HomePage = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <div className="homepage">
      <header className="hero-section text-white d-flex align-items-center">
        <div className="container text-center">
          <img src={logo} className="App-logo mb-4" alt="logo" />
          <h1 className="display-4">Добре дошли в Доброволци БГ</h1>
          <p className="lead">
            Свържете се с организации и намерете идеалната доброволческа инициатива за вас.
          </p>
          <div className="d-flex justify-content-center mt-4 flex-wrap gap-3">
            {!auth.user ? (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Регистрация
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Вход
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="btn btn-success btn-lg">
                  Dashboard
                </Link>
                <Button variant="danger" className="btn btn-lg" onClick={logout}>
                  Изход
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="features-section py-5">
        <div className="container">
          <h2 className="text-center mb-4">Нашите Предимства</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="feature-box text-center p-4">
                <i className="fas fa-users fa-3x mb-3"></i>
                <h4>Голяма Общност</h4>
                <p>Свържете се с хиляди доброволци и организации в цялата страна.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-box text-center p-4">
                <i className="fas fa-search fa-3x mb-3"></i>
                <h4>Лесно Търсене</h4>
                <p>Намерете инициативи по локация, категория и умения.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-box text-center p-4">
                <i className="fas fa-handshake fa-3x mb-3"></i>
                <h4>Ефективна Комуникация</h4>
                <p>Взаимодействайте лесно с организаторите и управлението на кандидатурите.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="call-to-action text-center py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-center flex-column align-items-center">
            {!auth.user ? (
              <>
                <h2>Готови ли сте да направите разлика?</h2>
                <p className="mb-4">
                  Присъединете се към нашата общност и започнете да участвате в смислени инициативи днес.
                </p>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Започнете сега
                </Link>
              </>
            ) : (
              <>
                <h2>Добре дошли, {auth.user.name}!</h2>
                <p className="mb-4">
                  Разгледайте нашите инициативи и намерете перфектната за вас.
                </p>
                <Link to="/initiatives" className="btn btn-primary btn-lg">
                  Разгледай Инициативи
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
