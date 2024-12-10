// /src/pages/AddInitiative.js
import React, { useContext } from 'react';
// import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './AddInitiative.css';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddInitiativeSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'Заглавието трябва да бъде поне 5 символа')
    .required('Заглавието е задължително'),
  description: Yup.string()
    .min(20, 'Описание трябва да бъде поне 20 символа')
    .required('Описание е задължително'),
  location: Yup.string()
    .required('Локацията е задължителна'),
  date: Yup.date()
    .required('Датата е задължителна'),
  category: Yup.string()
    .required('Категорията е задължителна'),
  imageUrl: Yup.string()
    .url('Невалиден URL')
    .required('URL на изображението е задължителен'),
});

const AddInitiative = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Проверка дали потребителят е организатор
  if (auth.user.role !== 'organizer') {
    return (
      <div className="container mt-5">
        <h2>Неоторизиран достъп</h2>
        <p>Само организаторите могат да добавят нови инициативи.</p>
      </div>
    );
  }

  const initialValues = {
    title: '',
    description: '',
    location: '',
    date: '',
    category: '',
    imageUrl: '',
  };

  const onSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    try {
    //   const res = await axios.post('/initiatives', values);
      resetForm();
      navigate('/initiatives');
    } catch (err) {
      console.error(err.response?.data || err);
      setErrors({ submit: err.response?.data?.msg || 'Грешка при добавяне на инициатива' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5 add-initiative">
      <h2>Добавяне на нова инициатива</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={AddInitiativeSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
            
            <div className="form-group">
              <label htmlFor="title">Заглавие</label>
              <Field type="text" name="title" className="form-control" />
              <ErrorMessage name="title" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label htmlFor="description">Описание</label>
              <Field as="textarea" name="description" className="form-control" />
              <ErrorMessage name="description" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label htmlFor="location">Локация</label>
              <Field type="text" name="location" className="form-control" />
              <ErrorMessage name="location" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label htmlFor="date">Дата</label>
              <Field type="date" name="date" className="form-control" />
              <ErrorMessage name="date" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label htmlFor="category">Категория</label>
              <Field type="text" name="category" className="form-control" />
              <ErrorMessage name="category" component="div" className="text-danger" />
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl">URL на изображение</label>
              <Field type="url" name="imageUrl" className="form-control" />
              <ErrorMessage name="imageUrl" component="div" className="text-danger" />
            </div>

            <button type="submit" className="btn btn-primary mt-3" disabled={isSubmitting}>
              {isSubmitting ? 'Добавяне...' : 'Добавяне'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddInitiative;
