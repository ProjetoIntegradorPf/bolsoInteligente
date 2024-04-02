import './Sidebar.css';

import React, { useContext } from "react";

import { UserContext } from "../context/UserContext";

export const cards = ['Cadastrar Categoria de Receita',
'Cadastrar Categoria de Despesa',
'Cadastrar Categoria de Investimento',
'Relatorio Geral',
'Relatorio de Despesas',
'Relatorio de Receitas',
'Relatorio de Investimentos'];

const Sidebar = () => {
  const [token, setToken] = useContext(UserContext);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <aside className="sidebar">
    <p className="menu-label">Menu</p>
    <ul className="menu-list">
      {cards.map((card, index) => (
        <li key={index}>{card}</li>
      ))}
    </ul>
    {token && (
        <button className="button" onClick={handleLogout}>
          Sair
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
