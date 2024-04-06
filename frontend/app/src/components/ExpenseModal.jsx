import React, { useEffect, useState } from 'react';

const ExpenseModal = ({ active, handleModal, token, id, setErrorMessage }) => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			if (id) {
				try {
					const requestOptions = {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`
						}
					};
					const response = await fetch(`/api/expenses/${id}`, requestOptions);
					if (response.ok) {
						const data = await response.json();
						setId(data.id);
						setName(data.name);
						setDescription(data.description);
					} else {
						setErrorMessage('Não foi possivel carregar a despesa');
					}
				} catch (error) {
					console.error('Erro ao buscar despesa:', error);
					setErrorMessage('Erro ao buscar despesa');
				}
			}
		};

		fetchData();
	}, [id, token, setErrorMessage]);

	const cleanFormData = () => {
		setName('');
		setDescription('');
		setError('');
	};

	const handleCreateExpense = async (e) => {
		e?.preventDefault();
		if (!description || !name) {
			setError('Por favor, preencha todos os campos.');
			return;
		}
		try {
			const requestOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token ? `Bearer ${token}` : undefined
				},
				body: JSON.stringify({ name, description })
			};
			const url = '/api/expenses';
			const response = await fetch(url, requestOptions);
			if (!response.ok) {
				const errorMessage = await response.text();
				throw new Error(errorMessage);
			}
			cleanFormData();
			handleModal();
		} catch (error) {
			console.error('Erro ao criar despesa:', error.message);
			setError(`Erro ao criar despesa: ${error.message}`);
		}
	};

	const handleUpdateExpense = async (e) => {
		e?.preventDefault();
		if (!description || !name) {
			setError('Por favor, preencha todos os campos.');
			return;
		}
		try {
			const requestOptions = {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token ? `Bearer ${token}` : undefined
				},
				body: JSON.stringify({ name, description })
			};
			const url = `/api/expenses/${id}`;
			const response = await fetch(url, requestOptions);
			if (!response.ok) {
				const errorMessage = await response.text();
				throw new Error(errorMessage);
			}
			cleanFormData();
			handleModal();
		} catch (error) {
			console.error('Erro ao atualizar despesa:', error.message);
			setError(`Erro ao atualizar despesa: ${error.message}`);
		}
	};

	return (
		<div className={`modal ${active && 'is-active'}`}>
			<div className="modal-background" onClick={handleModal}></div>
			<div className="modal-card">
				<header className="modal-card-head has-background-primary-light">
					<h1 className="modal-card-title">{id ? 'Atualizar Despesa' : 'Criar Despesa'}</h1>
				</header>
				{error && <div className="notification is-danger">{error}</div>}
				<section className="modal-card-body">
					<form>
						<div className="field">
							<label className="label">Nome</label>
							<div className="control">
								<input
									type="text"
									placeholder="Digite a Nome"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="input"
									required
								/>
							</div>
						</div>
						<div className="field">
							<label className="label">Descrição</label>
							<div className="control">
								<input
									type="text"
									placeholder="Digite a descrição"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									className="input"
									required
								/>
							</div>
						</div>
					</form>
				</section>
				<footer className="modal-card-foot has-background-primary-light">
					{id ? (
						<button className="button is-info" onClick={handleUpdateExpense}>
							Atualizar
						</button>
					) : (
						<button
							className="button is-primary"
							onClick={() => {
								cleanFormData();
								handleCreateExpense();
							}}
						>
							Criar
						</button>
					)}
					<button
						className="button"
						onClick={() => {
							cleanFormData();
							handleModal();
						}}
					>
						Cancelar
					</button>
				</footer>
			</div>
		</div>
	);
};

export default ExpenseModal;