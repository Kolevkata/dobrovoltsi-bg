// /src/pages/EditInitiative.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './AddInitiative.css';
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
    image: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchInitiative = async () => {
      try {
        const res = await axios.get(`/initiatives/${id}`);
        const { title, description, location, date, category } = res.data;
        setInitialValues({
          title,
          description,
          location,
          date: date.split('T')[0],
          category,
          image: null
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
      await axios.put(`/initiatives/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'multipart/form-data'
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
              <label htmlFor="image">Изображение (оставете празно, ако не желаете промяна)</label>
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
              {isSubmitting ? 'Редактиране...' : 'Редактиране'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditInitiative;
