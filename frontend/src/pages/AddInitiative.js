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
import { Card, Button, Alert, Spinner } from 'react-bootstrap';

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

const CATEGORIES = [
  {value: '', label:'Изберете категория'},
  {value: 'environment', label:'Околна среда'},
  {value: 'education', label:'Образование'},
  {value: 'social', label:'Социална помощ'},
  {value: 'health', label:'Здравеопазване'},
  {value: 'culture', label:'Култура'},
  {value: 'animal', label:'Животни'},
  {value: 'other', label:'Друго'}
];

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
        <Alert variant="danger">
          Неоторизиран достъп. Само организаторите или администраторите могат да добавят нови инициативи.
        </Alert>
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
    <div className="container mt-5 add-initiative d-flex justify-content-center">
      <Card className="p-4 shadow-sm" style={{maxWidth: '700px', width:'100%'}}>
        <div className="d-flex justify-content-start align-items-center mb-4">
          <Button variant="secondary" className="me-3" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i>
          </Button>
          <h2 className="mb-0">Добавяне на нова инициатива</h2>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={AddInitiativeSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, errors, setFieldValue, values }) => (
            <Form>
              {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}
              
              <div className="form-group mb-3">
                <label htmlFor="title" className="fw-bold">Заглавие</label>
                <Field type="text" name="title" className="form-control" />
                <ErrorMessage name="title" component="div" className="text-danger mt-1" />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="description" className="fw-bold">Описание</label>
                <Field as="textarea" name="description" className="form-control" rows="4"/>
                <ErrorMessage name="description" component="div" className="text-danger mt-1" />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="date" className="fw-bold">Дата</label>
                <DatePicker
                  selected={values.date ? new Date(values.date) : null}
                  onChange={date => setFieldValue('date', date)}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                />
                <ErrorMessage name="date" component="div" className="text-danger mt-1" />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="category" className="fw-bold">Категория</label>
                <Field as="select" name="category" className="form-control">
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="div" className="text-danger mt-1" />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="image" className="fw-bold">Изображение (опционално)</label>
                <input 
                  type="file" 
                  name="image" 
                  className="form-control"
                  onChange={(event) => {
                    setFieldValue('image', event.currentTarget.files[0]);
                  }}
                />
              </div>

              <div className="form-group mt-4 mb-3">
                <label className="fw-bold">Изберете Локация на Картата</label>
                <LocationPicker onSelect={(location) => setSelectedLocation(location)} />
                {selectedLocation.address && (
                  <div className="mt-2">
                    <strong>Избрана Адреса:</strong> {selectedLocation.address}
                  </div>
                )}
              </div>

              <Button type="submit" variant="primary" className="w-100 mt-3" disabled={isSubmitting}>
                {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : 'Добавяне'}
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default AddInitiative;
