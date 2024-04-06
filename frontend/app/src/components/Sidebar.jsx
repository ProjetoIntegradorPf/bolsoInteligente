import './Sidebar.css';

import React, { useContext } from 'react';

import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

const Sidebar = () => {
	const [token, setToken] = useContext(UserContext);

	const cards = [
		{ name: 'Relatorio Geral', component: 'relatorio-geral' },
		{ name: 'Relatorio de Despesas', component: 'despesas' },
		{ name: 'Relatorio de Receitas', component: 'receitas' },
		{ name: 'Relatorio de Investimentos', component: 'investimentos' },
		{ name: 'Cadastrar Categoria de Receita', component: 'categoria-receita' },
		{ name: 'Cadastrar Categoria de Despesa', component: 'categoria-despesa' },
		{ name: 'Cadastrar Categoria de Investimento', component: 'categoria-investimento' }
	];

	const handleLogout = () => {
		setToken(null);
	};

	return (
		<>
			<aside className="sidebar">
				<p className="menu-label">Menu</p>
				<ul className="menu-list">
					{cards.map(({ name, component }) => (
						<li>
							{' '}
							<Link to={`/${component}`}>{name}</Link>
						</li>
					))}
					<li>
						{token && (
							<button className="button" id="logout-button" onClick={handleLogout}>
								Sair
							</button>
						)}
					</li>
				</ul>
			</aside>
		</>
	);
};

export default Sidebar;
