// /src/pages/RegisterPage.js
import React, { useContext } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './RegisterPage.css';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Spinner } from 'react-bootstrap';

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Името трябва да бъде поне 2 символа')
    .required('Името е задължително'),
  email: Yup.string()
    .email('Невалиден имейл адрес')
    .required('Имейлът е задължителен'),
  password: Yup.string()
    .min(6, 'Паролата трябва да бъде поне 6 символа')
    .required('Паролата е задължителна'),
  role: Yup.string()
    .oneOf(['volunteer', 'organizer'], 'Изберете валидна роля')
    .required('Ролята е задължителна'),
});

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    role: 'volunteer',
  };

  const onSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    try {
      const res = await axios.post('/auth/register', values);
      const { accessToken, refreshToken, user } = res.data;
      register(accessToken, refreshToken, user);
      resetForm();
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response?.data || err);
      setErrors({ submit: err.response?.data?.message || 'Грешка при регистрацията' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <Card className="p-4 shadow-sm" style={{maxWidth: '500px', width: '100%'}}>
        <h2 className="mb-4 text-center">Регистрация</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={RegisterSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}
              
              <div className="form-group mb-3">
                <label htmlFor="name">Име</label>
                <Field type="text" name="name" className="form-control" />
                <ErrorMessage name="name" component="div" className="text-danger mt-1" />
              </div>

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

              <div className="form-group mb-3">
                <label htmlFor="role">Роля</label>
                <Field as="select" name="role" className="form-control">
                  <option value="volunteer">Доброволец</option>
                  <option value="organizer">Организатор</option>
                </Field>
                <ErrorMessage name="role" component="div" className="text-danger mt-1" />
              </div>

              <Button type="submit" className="w-100 mt-3" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : 'Регистрация'}
              </Button>
            </Form>
          )}
        </Formik>
        <div className="text-center mt-3">
          <small>Вече имате акаунт? <a href="/login">Вход</a></small>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
