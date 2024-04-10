import React from 'react';
import { Link } from 'react-router-dom';

const cards = [
	{ name: 'Relatório Geral', component: 'relatorio-geral' },
	{ name: 'Relatório de Despesas', component: 'despesas' },
	{ name: 'Relatório de Receitas', component: 'receitas' },
	// { name: 'Relatório de Investimentos', component: 'investimentos' },
	{ name: 'Cadastrar Categoria de Receita', component: 'categoria-receita' },
	{ name: 'Cadastrar Categoria de Despesa', component: 'categoria-despesa' }
	// { name: 'Cadastrar Categoria de Investimento', component: 'categoria-investimento' }
];

const CardMenu = () => {
	return (
		<div className="columns is-multiline is-centered">
			{cards.map((card, index) => (
				<div key={index} className="is-one-third">
					<div className="card has-background-dark" style={{ width: '400px', margin: '50px' }}>
						<div className="card-content has-text-centered">
							<div className="content">
								<Link
									className="is-size-4 is-dark has-text has-text-white has-tex-minimal-bold"
									to={`/${card.component}`}
								>
									{card.name}
								</Link>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default CardMenu;
