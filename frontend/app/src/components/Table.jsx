import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br'; // Importe o idioma português brasileiro
import { useLocation } from 'react-router-dom';

import ErrorMessage from './ErrorMessage';
import TransactionModal from './TransactionModal';
import { UserContext } from '../context/UserContext';

const Table = () => {
	const location = useLocation();
	const currentPath = location.pathname;

	const [token] = useContext(UserContext);
	const [transactions, setTransactions] = useState([]);
	const [errorMessage, setErrorMessage] = useState('');
	const [loaded, setLoaded] = useState(false);
	const [activeModal, setActiveModal] = useState(false);
	const [id, setId] = useState(null);
	const [totalRevenue, setTotalRevenue] = useState(0);
	const [totalExpense, setTotalExpense] = useState(0);
	const [totalInvestment, setTotalInvestment] = useState(0);
	const [totalBalance, setTotalBalance] = useState(0);
	const [descriptionFilter, setDescriptionFilter] = useState('');
	const [startDateFilter, setStartDateFilter] = useState('');
	const [endDateFilter, setEndDateFilter] = useState('');

	moment.locale('pt-br');
	const months = moment.months();

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
			const response = await fetch(`https://bolsointeligente-api.onrender.com/api/transactions/${id}`, requestOptions);
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
			const params = new URLSearchParams();
			const requestOptions = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + token
				}
			};
			let url = 'https://bolsointeligente-api.onrender.com/api/transactions';

			if (currentPath === '/receitas') {
				params.append('type', 'RECEITA');
			} else if (currentPath === '/investimentos') {
				params.append('type', 'INVESTIMENTO');
			} else if (currentPath === '/despesas') {
				params.append('type', 'DESPESA');
			}

			if (descriptionFilter) {
				params.append('description', descriptionFilter);
			}
			if (startDateFilter) {
				params.append('start_date', startDateFilter);
			}
			if (endDateFilter) {
				params.append('end_date', endDateFilter);
			}

			url += '?' + params.toString();

			const response = await fetch(url, requestOptions);
			if (!response.ok) {
				throw new Error('Falha ao buscar transações');
			}
			const data = await response.json();
			const revenues = data
				.filter((transaction) => transaction.type === 'RECEITA')
				.reduce((acc, curr) => acc + curr.value, 0);
			const expenses = data
				.filter((transaction) => transaction.type === 'DESPESA')
				.reduce((acc, curr) => acc + curr.value, 0);
			const balance = revenues - expenses;
			setTotalExpense(expenses);
			setTotalRevenue(revenues);
			setTotalBalance(balance);
			setTransactions(data);
			setLoaded(true);
		} catch (error) {
			setErrorMessage('Erro ao buscar transações: ' + error.message);
		}
	};

	useEffect(() => {
		getTransactions();
	}, [descriptionFilter, startDateFilter, endDateFilter]);

	const handleModal = () => {
		setActiveModal(!activeModal);
		getTransactions();
		setId(null);
	};

	const handleFilter = () => {
		getTransactions();
	};

	const clearFilter = (filterType) => {
		switch (filterType) {
			case 'description':
				setDescriptionFilter('');
				break;
			case 'startDate':
				setStartDateFilter('');
				break;
			case 'endDate':
				setEndDateFilter('');
				break;
			default:
				break;
		}
		getTransactions();
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
			<div className="columns is-centered m-1 is-flex is-justify-content-center">
				<div className="column">
					<div className="field">
						<label className="label">Filtrar por Descrição:</label>
						<div className="control">
							<input
								className="input has-background-dark has-text-white"
								type="text"
								placeholder="Digite a descrição..."
								value={descriptionFilter}
								onChange={(e) => setDescriptionFilter(e.target.value)}
							/>
							<button className="button is-danger is-small m-2" onClick={() => clearFilter('description')}>
								Limpar
							</button>
						</div>
					</div>
				</div>
				<div className="column">
					<div className="field">
						<label className="label">Filtrar por Data de Início:</label>
						<div className="control">
							<input
								className="input has-background-dark has-text-white"
								type="date"
								value={startDateFilter}
								onChange={(e) => setStartDateFilter(e.target.value)}
							/>
							<button className="button is-danger is-small m-2" onClick={() => clearFilter('startDate')}>
								Limpar
							</button>
						</div>
					</div>
				</div>
				<div className="column">
					<div className="field">
						<label className="label">Filtrar por Data de Fim:</label>
						<div className="control">
							<input
								className="input has-background-dark has-text-white"
								type="date"
								value={endDateFilter}
								onChange={(e) => setEndDateFilter(e.target.value)}
							/>
							<button className="button  is-danger is-small m-2" onClick={() => clearFilter('endDate')}>
								Limpar
							</button>
						</div>
					</div>
				</div>
				<div className="column">
					<div className="field">
						<label className="label"></label>
						<div className="control">
							<button
								className="button is-danger mt-5"
								onClick={() => {
									setDescriptionFilter('');
									setStartDateFilter('');
									setEndDateFilter('');
									getTransactions();
								}}
							>
								Limpar todos os filtros
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="columns">
				{currentPath === '/receitas' && (
					<div className="column has-text-centered has-text-success">
						<strong className="column has-text-centered has-background-dark has-text-success">
							Total de Receitas : R$ {totalRevenue.toFixed(2)}
						</strong>
					</div>
				)}
				{currentPath === '/despesas' && (
					<div className="column has-text-centered has-text-danger">
						<strong className="column has-text-centered has-background-dark has-text-danger">
							Total de Despesas: R$ {totalExpense.toFixed(2)}
						</strong>
					</div>
				)}
				{currentPath !== '/receitas' && currentPath !== '/despesas' && currentPath !== '/relatorio-geral' && (
					<div className={`column has-text-centered ${totalBalance >= 0 ? 'has-text-success' : 'has-text-danger'}`}>
						<strong
							className={`column has-text-centered has-background-dark ${totalBalance >= 0 ? 'has-text-success' : 'has-text-danger'}`}
						>
							Saldo: R$ {totalBalance.toFixed(2)}
						</strong>
					</div>
				)}
				{currentPath === '/relatorio-geral' && (
					<>
						<div className="column has-text-centered has-text-success">
							<strong className="column has-text-centered has-background-dark has-text-success">
								Total de Receitas : R$ {totalRevenue.toFixed(2)}
							</strong>
						</div>
						<div className="column has-text-centered has-text-danger">
							<strong className="column has-text-centered has-background-dark has-text-danger">
								Total de Despesas: R$ {totalExpense.toFixed(2)}
							</strong>
						</div>
						<div className={`column has-text-centered ${totalBalance >= 0 ? 'has-text-success' : 'has-text-danger'}`}>
							<strong
								className={`column has-text-centered has-background-dark ${totalBalance >= 0 ? 'has-text-success' : 'has-text-danger'}`}
							>
								Saldo: R$ {totalBalance.toFixed(2)}
							</strong>
						</div>
					</>
				)}
			</div>

			{loaded ? (
				<div>
					{transactions.length > 0 ? (
						<div className="table-container">
							<table className="table is-bordered is-fullwidth is-hoverable">
								<thead>
									<tr className="is-dark">
										<th>ID</th>
										<th>Descrição</th>
										<th>Tipo</th>
										<th>Categoria</th>
										<th>Valor</th>
										<th>Data</th>
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
												{transaction.category_revenue_name ||
													transaction.category_expense_name ||
													transaction.category_investment_name ||
													'Nenhuma categoria atribuída'}
											</td>

											<td>R$ {transaction.value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</td>
											<td>{moment(transaction.date).format('DD/MM/YYYY')}</td>
											<td>{moment(transaction.date_last_updated).format('DD/MM/YYYY HH:mm')}</td>
											<td>
												<button
													className="button is-info is-light"
													onClick={() => handleUpdate(transaction.id)}
												>
													Atualizar
												</button>
												<button
													className="button is-danger is-light ml-2"
													onClick={() => handleDelete(transaction.id)}
												>
													Deletar
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<p>Não há transações para exibir.</p>
					)}
				</div>
			) : (
				<p>Carregando...</p>
			)}
			<div className="buttons is-centered">
				<button className="button is-primary is-centered m-4" onClick={handleModal}>
					Criar uma transação
				</button>
			</div>
		</>
	);
};

export default Table;
