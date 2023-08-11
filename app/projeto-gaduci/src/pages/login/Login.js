import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/login/Login.css'; // Importa os estilos personalizados da página de login
import axios from 'axios'; // Importa a biblioteca axios para fazer requisições HTTP
import InputField from '../../components/login/InputField'; // Importa o componente de input customizado
import LoginButton from '../../components/login/LoginButton'; // Importa o componente de botão de login customizado

// Componente de Login que recebe a função onLogin como prop
const Login = ({ onLogin }) => {
  // Estados para armazenar o nome de usuário e senha
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Função para lidar com a tentativa de login
  const handleLogin = async () => {
    try {
      // Envia uma requisição POST para a rota de login
      const response = await axios.post('http://localhost:3000/login', {
        login: username,
        password: password,
      });

      // Extrai o token da resposta e chama a função onLogin
      const token = response.data.token;
      onLogin(token);
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          {/* Componente InputField customizado para o campo de usuário */}
          <InputField
            label="Usuário"
            type="text"
            id="username"
            placeholder="Digite seu usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {/* Componente InputField customizado para o campo de senha */}
          <InputField
            label="Senha"
            type="password"
            id="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Componente LoginButton customizado para o botão de login */}
          <LoginButton onClick={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default Login;
