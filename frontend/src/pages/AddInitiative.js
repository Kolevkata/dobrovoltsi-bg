// /src/pages/AddInitiative.js
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './AddInitiative.css';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../components/LocationPicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddInitiativeSchema = Yup.object().shape({
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

const AddInitiative = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: null,
    longitude: null,
    address: '',
  });

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
    date: '',
    category: '',
    image: null,
  };

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
      await axios.post('/initiatives', formData, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'multipart/form-data',
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
              {isSubmitting ? 'Добавяне...' : 'Добавяне'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddInitiative;
