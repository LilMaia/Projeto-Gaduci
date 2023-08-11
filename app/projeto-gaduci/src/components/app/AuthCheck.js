import React, { useEffect } from 'react';
import Cookies from 'js-cookie'; // Importa a biblioteca js-cookie para lidar com cookies
import axios from 'axios'; // Importa a biblioteca axios para fazer requisições HTTP

// Componente AuthCheck que recebe children (elementos filhos) e a função onLogout como prop
const AuthCheck = ({ children, onLogout }) => {
  // Efeito colateral que é executado quando o componente é montado
  useEffect(() => {
    // Função assíncrona para verificar o token do usuário
    async function checkToken() {
      const token = Cookies.get('token'); // Obtém o token do cookie
  
      if (token) {
        try {
          // Tenta fazer uma requisição para verificar o token no servidor
          await axios.get('http://localhost:3000/verify-token', {
            headers: {
              Authorization: token,
            },
          });
        } catch (error) {
          // Se ocorrer um erro na requisição
          if (error.response && error.response.status === 401) {
            console.error('Token expirado:', error);
            // Limpa o token expirado do cookie
            Cookies.remove('token');
            // Chama a função onLogout para lidar com o logout
            onLogout();
          } else {
            console.error('Erro ao verificar o token:', error);
          }
        }
      }
    }
  
    // Chama a função para verificar o token ao montar o componente
    checkToken();
  }, [onLogout]); // Dependência que determina quando o efeito será executado

  // Renderiza os elementos filhos (children) sem alterações
  return <>{children}</>;
};

export default AuthCheck;
