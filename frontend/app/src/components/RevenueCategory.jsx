import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';

import ErrorMessage from './ErrorMessage';
import RevenueModal from './RevenueModal';
import { UserContext } from '../context/UserContext';

const RevenueCategory = () => {
	const [token] = useContext(UserContext);
	const [revenues, setRevenues] = useState(null);
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
		const response = await fetch(`/api/revenues/${id}`, requestOptions);
		if (!response.ok) {
			setErrorMessage('Falha ao deletar receita');
		}

		getRevenues();
	};

	const getRevenues = async () => {
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token
			}
		};
		const response = await fetch('/api/revenues', requestOptions);
		if (!response.ok) {
			setErrorMessage('Algo deu errado. Não foi possivel carregar as receitas');
		} else {
			const data = await response.json();
			setRevenues(data);
			setLoaded(true);
		}
	};

	useEffect(() => {
		getRevenues();
	}, []);

	const handleModal = () => {
		setActiveModal(!activeModal);
		getRevenues();
		setId(null);
	};

	return (
		<div className="container">
			<RevenueModal
				active={activeModal}
				handleModal={handleModal}
				token={token}
				id={id}
				setErrorMessage={setErrorMessage}
			/>
			<ErrorMessage message={errorMessage} />
			{loaded ? (
				revenues.length > 0 ? (
					<table className="table is-fullwidth">
						<thead>
							<tr>
								<th>ID</th>
								<th>Name</th>
								<th>Descrição</th>
								<th>Última Atualização</th>
								<th>Ações</th>
							</tr>
						</thead>
						<tbody>
							{revenues.map((revenue) => (
								<tr key={revenue.id}>
									<td>{revenue.id}</td>
									<td>{revenue.name}</td>
									<td>{revenue.description}</td>
									<td>{moment(revenue.date_last_updated).format('DD/MM/YYYY HH:mm')}</td>
									<td>
										<button className="button mr-2 is-info is-light" onClick={() => handleUpdate(revenue.id)}>
											Atualizar
										</button>
										<button
											className="button mr-2 is-danger is-light"
											onClick={() => handleDelete(revenue.id)}
										>
											Deletar
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p>Não há receitas para exibir.</p>
				)
			) : (
				<p>Carregando...</p>
			)}
			<div className="has-text-centered">
				<button className="button is-primary" onClick={() => setActiveModal(true)}>
					Criar uma receita
				</button>
			</div>
		</div>
	);
};

export default RevenueCategory;
