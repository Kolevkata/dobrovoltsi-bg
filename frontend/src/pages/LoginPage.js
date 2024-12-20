// /src/pages/LoginPage.js
import React, { useContext } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './LoginPage.css';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Spinner } from 'react-bootstrap';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Невалиден имейл адрес')
    .required('Имейлът е задължителен'),
  password: Yup.string()
    .min(6, 'Паролата трябва да бъде поне 6 символа')
    .required('Паролата е задължителна'),
});

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const onSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    try {
      const res = await axios.post('/auth/login', values);
      const { accessToken, refreshToken, user } = res.data;
      login(accessToken, refreshToken, user);
      resetForm();
      navigate('/');
    } catch (err) {
      console.error(err.response?.data || err);
      setErrors({ submit: err.response?.data?.message || 'Грешка при входа' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <Card className="p-4 shadow-sm" style={{maxWidth: '500px', width: '100%'}}>
        <h2 className="mb-4 text-center">Вход</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}
              <div className="form-group mb-3">
                <label htmlFor="email">Имейл</label>
                <Field type="email" name="email" className="form-control" />
                <ErrorMessage name="email" component="div" className="text-danger mt-1" />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="password">Парола</label>
                <Field type="password" name="password" className="form-control" />
                <ErrorMessage name="password" component="div" className="text-danger mt-1" />
              </div>

              <Button type="submit" className="w-100 mt-3" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : 'Вход'}
              </Button>
            </Form>
          )}
        </Formik>
        <div className="text-center mt-3">
          <small>Нямате акаунт? <a href="/register">Регистрация</a></small>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
