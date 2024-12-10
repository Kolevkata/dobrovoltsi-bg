// /src/pages/LoginPage.js
import React, { useContext } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './LoginPage.css';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response?.data || err);
      setErrors({ submit: err.response?.data?.message || 'Грешка при входа' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Вход</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
            <div className="form-group">
              <label htmlFor="email">Имейл</label>
              <Field type="email" name="email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Парола</label>
              <Field type="password" name="password" className="form-control" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary mt-3" disabled={isSubmitting}>
              {isSubmitting ? 'Вход...' : 'Вход'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
