import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';

import ErrorMessage from './ErrorMessage';
import ExpenseModal from './ExpenseModal';
import { UserContext } from '../context/UserContext';

const ExpenseCategory = () => {
	const [token] = useContext(UserContext);
	const [expenses, setExpenses] = useState(null);
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
		const response = await fetch(`https://bolsointeligente-api.onrender.com/api/expenses/${id}`, requestOptions);
		if (!response.ok) {
			setErrorMessage('Falha ao deletar despesa');
		}

		getExpenses();
	};

	const getExpenses = async () => {
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token
			}
		};
		const response = await fetch('https://bolsointeligente-api.onrender.com/api/expenses', requestOptions);
		if (!response.ok) {
			setErrorMessage('Zlgo deu errado. Não foi possivel carregar as despesas');
		} else {
			const data = await response.json();
			setExpenses(data);
			setLoaded(true);
		}
	};

	useEffect(() => {
		getExpenses();
	}, []);

	const handleModal = () => {
		setActiveModal(!activeModal);
		getExpenses();
		setId(null);
	};

	return (
		<div className="container">
			<ExpenseModal
				active={activeModal}
				handleModal={handleModal}
				token={token}
				id={id}
				setErrorMessage={setErrorMessage}
			/>
			<ErrorMessage message={errorMessage} />
			{loaded ? (
				expenses.length > 0 ? (
					<table className="table is-bordered is-fullwidth is-hoverable">
						<thead>
							<tr className="is-dark">
								<th className="has-background-dark">ID</th>
								<th className="has-background-dark">Name</th>
								<th className="has-background-dark">Descrição</th>
								<th className="has-background-dark">Última Atualização</th>
								<th className="has-background-dark">Ações</th>
							</tr>
						</thead>
						<tbody>
							{expenses.map((expense) => (
								<tr key={expense.id}>
									<td>{expense.id}</td>
									<td>{expense.name}</td>
									<td>{expense.description}</td>
									<td>{moment(expense.date_last_updated).format('DD/MM/YYYY HH:mm')}</td>
									<td>
										<button className="button mr-2 is-info is-light" onClick={() => handleUpdate(expense.id)}>
											Atualizar
										</button>
										<button
											className="button mr-2 is-danger is-light"
											onClick={() => handleDelete(expense.id)}
										>
											Deletar
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p>Não há despesas para exibir.</p>
				)
			) : (
				<p>Carregando...</p>
			)}
			<div className="has-text-centered">
				<button className="button is-primary" onClick={() => setActiveModal(true)}>
					Criar uma despesa
				</button>
			</div>
		</div>
	);
};

export default ExpenseCategory;
