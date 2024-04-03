import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';

import ErrorMessage from './ErrorMessage';
import TransactionModal from './TransactionModal';
import { UserContext } from '../context/UserContext';

const Table = () => {
	const [token] = useContext(UserContext);
	const [transactions, setTransactions] = useState(null);
	const [errorMessage, setErrorMessage] = useState('');
	const [loaded, setLoaded] = useState(false);
	const [activeModal, setActiveModal] = useState(false);
	const [id, setId] = useState(null);

	const handleUpdate = async (id) => {
		setId(id);
		setActiveModal(true);
	};

	const handleDelete = async (id) => {
		const requestOptions = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token
			}
		};
		const response = await fetch(`/api/transactions/${id}`, requestOptions);
		if (!response.ok) {
			setErrorMessage('Failed to delete transaction');
		}

		getTransactions();
	};

	const getTransactions = async () => {
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token
			}
		};
		const response = await fetch('/api/transactions', requestOptions);
		if (!response.ok) {
			setErrorMessage("Something went wrong. Couldn't load the transactions");
		} else {
			const data = await response.json();
			setTransactions(data);
			setLoaded(true);
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
			<button className="button is-fullwidth mb-5 is-primary" onClick={() => setActiveModal(true)}>
				Criar uma transação
			</button>
			<ErrorMessage message={errorMessage} />
			{loaded ? (
				transactions.length > 0 ? (
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
									<td>{transaction.category}</td>
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
				)
			) : (
				<p>Carregando...</p>
			)}
		</>
	);
};

export default Table;
