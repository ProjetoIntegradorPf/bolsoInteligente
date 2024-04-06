import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { useLocation } from 'react-router-dom';

import ErrorMessage from './ErrorMessage';
import TransactionModal from './TransactionModal';
import { UserContext } from '../context/UserContext';

const Table = () => {
	const location = useLocation();
	const currentPath = location.pathname;
	console.log(currentPath);

	const [token] = useContext(UserContext);
	const [transactions, setTransactions] = useState([]);
	const [errorMessage, setErrorMessage] = useState('');
	const [loaded, setLoaded] = useState(false);
	const [activeModal, setActiveModal] = useState(false);
	const [id, setId] = useState(null);

	const handleUpdate = (id) => {
		setId(id);
		setActiveModal(true);
	};

	const handleDelete = async (id) => {
		try {
			const requestOptions = {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + token
				}
			};
			const response = await fetch(`/api/transactions/${id}`, requestOptions);
			if (!response.ok) {
				throw new Error('Falha ao deletar transação');
			}
			getTransactions();
		} catch (error) {
			setErrorMessage(error.message);
		}
	};

	const getTransactions = async () => {
		try {
			const requestOptions = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + token
				}
			};

			let url =
				currentPath === '/receitas'
					? '/api/transactions?type=RECEITA'
					: currentPath === '/investimentos'
						? '/api/transactions?type=INVESTIMENTO'
						: currentPath === '/despesas'
							? '/api/transactions?type=DESPESA'
							: '/api/transactions';

			const response = await fetch(url, requestOptions);
			if (!response.ok) {
				throw new Error('Falha ao buscar transações');
			}
			const data = await response.json();
			setTransactions(data);
			setLoaded(true);
		} catch (error) {
			setErrorMessage('Erro ao buscar transações: ' + error.message);
		}
	};

	useEffect(() => {
		getTransactions();
	}, []);

	const handleModal = () => {
		setActiveModal(!activeModal);
		getTransactions();
		setId(null);
	};

	return (
		<>
			<TransactionModal
				active={activeModal}
				handleModal={handleModal}
				token={token}
				id={id}
				setErrorMessage={setErrorMessage}
			/>
			<ErrorMessage message={errorMessage} />
			{loaded ? (
				<div>
					{transactions.length > 0 ? (
						<table className="table is-fullwidth">
							<thead>
								<tr>
									<th>ID</th>
									<th>Descrição</th>
									<th>Tipo</th>
									<th>Categoria</th>
									<th>Valor</th>
									<th>Última Atualização</th>
									<th>Ações</th>
								</tr>
							</thead>
							<tbody>
								{transactions.map((transaction) => (
									<tr key={transaction.id}>
										<td>{transaction.id}</td>
										<td>{transaction.description}</td>
										<td>{transaction.type}</td>
										<td>
											{transaction.category_revenue_name !== null
												? transaction.category_revenue_name
												: transaction.category_expense_name !== null
													? transaction.category_expense_name
													: transaction.category_investment_name !== null
														? transaction.category_investment_name
														: 'Nenhuma categoria atribuída'}
										</td>
										<td>R$ {transaction.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
										<td>{moment(transaction.date_last_updated).format('DD/MM/YYYY HH:mm')}</td>
										<td>
											<button
												className="button mr-2 is-info is-light"
												onClick={() => handleUpdate(transaction.id)}
											>
												Atualizar
											</button>
											<button
												className="button mr-2 is-danger is-light"
												onClick={() => handleDelete(transaction.id)}
											>
												Deletar
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p>Não há transações para exibir.</p>
					)}
				</div>
			) : (
				<p>Carregando...</p>
			)}
			<div className="buttons is-centered">
				<button className="button is-primary is-centered" onClick={handleModal}>
					Criar uma transação
				</button>
			</div>
		</>
	);
};

export default Table;
