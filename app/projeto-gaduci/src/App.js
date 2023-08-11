import React, { useState } from 'react';
import './styles/app/App.css';
import AuthCheck from './components/app/AuthCheck'; // Importa o componente de verificação de autenticação
import Login from './pages/login/Login'; // Importa o componente de login
import Dashboard from './pages/dashboard/Dashboard'; // Importa o componente de painel
import LogoutButton from './components/app/LogoutButton'; // Importa o componente de botão de logout
import Cookies from 'js-cookie'; // Importa a biblioteca js-cookie para gerenciar cookies

function App() {
  // Estado para armazenar o usuário autenticado
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Função para lidar com o login bem-sucedido
  const handleLogin = (token) => {
    // Armazena o token em um cookie seguro com prazo de expiração de 1 dia
    Cookies.set('token', token, { expires: 1, secure: true });
    // Define o usuário autenticado
    setLoggedInUser(token);
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    // Remove o token do cookie
    Cookies.remove('token');
    // Limpa o estado de usuário autenticado
    setLoggedInUser(null);
  };

  return (
    <div className="App">
      {/* Componente de verificação de autenticação */}
      <AuthCheck onLogout={handleLogout}>
        {loggedInUser ? ( // Se o usuário estiver autenticado
          <>
            {/* Componente de painel exibindo o nome de usuário */}
            <Dashboard username={loggedInUser} />
            {/* Componente de botão de logout */}
            <LogoutButton onLogout={handleLogout} />
          </>
        ) : ( // Se o usuário não estiver autenticado
          <Login onLogin={handleLogin} /> // Componente de login
        )}
      </AuthCheck>
    </div>
  );
}

export default App;
