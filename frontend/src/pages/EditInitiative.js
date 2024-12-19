// /src/pages/EditInitiative.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './EditInitiative.css';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import LocationPicker from '../components/LocationPicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditInitiativeSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'Заглавието трябва да бъде поне 5 символа')
    .required('Заглавието е задължително'),
  description: Yup.string()
    .min(20, 'Описание трябва да бъде поне 20 символа')
    .required('Описание е задължително'),
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
    date: '',
    category: '',
    image: null,
  });
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: null,
    longitude: null,
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInitiative = async () => {
      try {
        const res = await axios.get(`/initiatives/${id}`);
        const { title, description, date, category, address, latitude, longitude } = res.data;
        setInitialValues({
          title,
          description,
          date: date.split('T')[0],
          category,
          image: null,
        });
        setSelectedLocation({
          latitude: latitude || null,
          longitude: longitude || null,
          address: address || '',
        });
      } catch (err) {
        console.error(err);
        setError('Грешка при зареждане на инициативата.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitiative();
  }, [id]);

  const onSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    if (!selectedLocation.latitude || !selectedLocation.longitude) {
      setErrors({ submit: 'Моля, изберете локация на картата.' });
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('date', values.date);
    formData.append('category', values.category);
    formData.append('address', selectedLocation.address);
    formData.append('latitude', selectedLocation.latitude);
    formData.append('longitude', selectedLocation.longitude);
    if (values.image) {
      formData.append('image', values.image);
    }

    try {
      await axios.put(`/initiatives/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      resetForm();
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response?.data || err);
      setErrors({ submit: err.response?.data?.msg || 'Грешка при редактиране на инициативата' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container mt-5">Зареждане...</div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container mt-5 edit-initiative">
      <h2>Редактиране на инициатива</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={EditInitiativeSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ isSubmitting, errors, setFieldValue, values }) => (
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
              <label htmlFor="date">Дата</label>
              <DatePicker
                selected={values.date ? new Date(values.date) : null}
                onChange={date => setFieldValue('date', date)}
                className="form-control"
                dateFormat="yyyy-MM-dd"
              />
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

            <div className="form-group mt-4">
              <label>Изберете Локация на Картата</label>
              <LocationPicker onSelect={(location) => setSelectedLocation(location)} />
              {selectedLocation.address && (
                <div className="mt-2">
                  <strong>Избрана Адреса:</strong> {selectedLocation.address}
                </div>
              )}
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
