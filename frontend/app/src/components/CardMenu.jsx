import React from 'react';

const cards = [
	'Relatorio Geral', //TODO esse cara vai estar na minha lista e deve estar clicavel, e ao clicar deve encaminhar para a tela do componente table
	'Relatorio de Despesas',
	'Relatorio de Receitas',
	'Relatorio de Investimentos',
	'Cadastrar Categoria de Receita',
	'Cadastrar Categoria de Despesa',
	'Cadastrar Categoria de Investimento'
];

const CardMenu = ({ cards }) => {
	return (
		<div className="columns is-multiline is-centered" style={{ paddingLeft: '20%' }}>
			{cards.map((card, index) => (
				<div key={index} className="column is-one-third is-centered">
					<div className="card" style={{ width: '400px' }}>
						<div className="card-content has-text-centered">
							<p className="title" style={{ fontSize: '16px' }}>
								{card}
							</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default CardMenu;
