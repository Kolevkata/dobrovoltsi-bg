// /src/pages/AddInitiative.js
import React, { useContext } from 'react';
import axios from 'axios';
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
});

const AddInitiative = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  if (auth.user.role !== 'organizer' && auth.user.role !== 'admin') {
    return (
      <div className="container mt-5">
        <h2>Неоторизиран достъп</h2>
        <p>Само организаторите или администраторите могат да добавят нови инициативи.</p>
      </div>
    );
  }

  const initialValues = {
    title: '',
    description: '',
    location: '',
    date: '',
    category: '',
    image: null
  };

  const onSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('location', values.location);
    formData.append('date', values.date);
    formData.append('category', values.category);
    if (values.image) {
      formData.append('image', values.image);
    }

    try {
      await axios.post('/initiatives', formData, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'multipart/form-data'
        },
      });
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
        {({ isSubmitting, errors, setFieldValue }) => (
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
              <label htmlFor="image">Изображение</label>
              <input 
                type="file" 
                name="image" 
                className="form-control"
                onChange={(event) => {
                  setFieldValue('image', event.currentTarget.files[0]);
                }}
              />
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
