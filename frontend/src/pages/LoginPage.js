// /src/pages/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'volunteer',
  });

  const { name, email, password, role } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/login', formData);
      console.log(res.data);
      // Пренасочване или друга логика
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="container">
      <h2>Регистрация</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Име</label>
          <input type="text" className="form-control" name="name" value={name} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Имейл</label>
          <input type="email" className="form-control" name="email" value={email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Парола</label>
          <input type="password" className="form-control" name="password" value={password} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Роля</label>
          <select className="form-control" name="role" value={role} onChange={onChange}>
            <option value="volunteer">Доброволец</option>
            <option value="organizer">Организатор</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Регистрация</button>
      </form>
    </div>
  );
};

export default LoginPage;