import React from 'react';
import Cookies from 'js-cookie'; // Importa a biblioteca js-cookie para lidar com cookies

// Componente LogoutButton que recebe a função onLogout como prop
const LogoutButton = ({ onLogout }) => {
  // Função para lidar com o processo de logout
  const handleLogout = () => {
    // Remove o token do cookie
    Cookies.remove('token');

    // Chama a função onLogout para limpar o estado de usuário autenticado
    onLogout();
  };

  // Renderiza um botão que, ao ser clicado, chama a função handleLogout
  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
