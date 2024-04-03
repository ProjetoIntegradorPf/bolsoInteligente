import './Sidebar.css';

import React, { useContext } from 'react';

import { UserContext } from '../context/UserContext';

export const cards = [
	'Relatorio Geral',
	'Relatorio de Despesas',
	'Relatorio de Receitas',
	'Relatorio de Investimentos',
	'Cadastrar Categoria de Receita',
	'Cadastrar Categoria de Despesa',
	'Cadastrar Categoria de Investimento'
];

const Sidebar = () => {
	const [token, setToken] = useContext(UserContext);

	const handleLogout = () => {
		setToken(null);
	};

	return (
		<div className="sidebar">
			<p className="menu-label">Menu</p>
			<ul className="menu-list">
				{cards.map((card, index) => (
					<li key={index}>{card}</li>
				))}
				<li>
					{token && (
						<button className="button" id="logout-button" onClick={handleLogout}>
							Sair
						</button>
					)}
				</li>
			</ul>
		</div>
	);
};

export default Sidebar;
