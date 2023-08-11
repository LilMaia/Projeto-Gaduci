import React from 'react';
import '../../styles/login/LoginButton.css';

const LoginButton = ({ onClick }) => (
  <button className="btn btn-primary" onClick={onClick}>Login</button>
);

export default LoginButton;
