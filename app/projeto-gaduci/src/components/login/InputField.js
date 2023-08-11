import React from 'react';
import '../../styles/login/InputField.css';

const InputField = ({ label, type, id, placeholder, value, onChange }) => (
  <div className="mb-3">
    <label htmlFor={id} className="form-label">{label}</label>
    <input
      type={type}
      className="form-control"
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default InputField;
