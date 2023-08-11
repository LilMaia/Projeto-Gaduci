import React from 'react';
import Menu from '../../components/dashboard/Menu';
import SearchBar from '../../components/dashboard/SearchBar';
import SaveButton from '../../components/dashboard/SaveButton';

const Dashboard = ({ username }) => {
  return (
    <div>
      <h2>Bem-vindo, {username}!</h2>
      <Menu />
      <SearchBar />
      <SaveButton />
      {/* Outros conteúdos do painel de controle */}
    </div>
  );
};

export default Dashboard;
