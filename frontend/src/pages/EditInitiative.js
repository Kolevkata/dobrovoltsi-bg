// /frontend/src/pages/EditInitiative.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './AddInitiative.css'; // Използване на същите стилове
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const EditInitiativeSchema = Yup.object().shape({
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

const EditInitiative = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    category: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Зареждане на данните на инициативата
  useEffect(() => {
    const fetchInitiative = async () => {
      try {
        const res = await axios.get(`/initiatives/${id}`);
        const { title, description, location, date, category, imageUrl } = res.data;
        setInitialValues({
          title,
          description,
          location,
          date: date.split('T')[0], // Форматиране на датата за input type="date"
          category,
          imageUrl,
        });
      } catch (err) {
        console.error(err.response?.data || err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInitiative();
  }, [id]);

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await axios.put(`/initiatives/${id}`, values, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response?.data || err);
      setErrors({ submit: err.response?.data?.msg || 'Грешка при редактиране на инициативата' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container mt-5">Зареждане...</div>;
  if (error) return <div className="container mt-5">Грешка при зареждане на инициативата.</div>;

  return (
    <div className="container mt-5 add-initiative">
      <h2>Редактиране на инициатива</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={EditInitiativeSchema}
        enableReinitialize
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
              {isSubmitting ? 'Редактиране...' : 'Редактиране'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditInitiative;
