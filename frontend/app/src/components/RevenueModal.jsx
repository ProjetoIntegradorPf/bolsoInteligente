import React, { useEffect, useState } from 'react';

const RevenueModal = ({ active, handleModal, token, id, setErrorMessage }) => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [error, setError] = useState('');
	const [revenueData, setRevenueData] = useState(null); // Estado para armazenar os dados da receita que será atualizada

	useEffect(() => {
		const fetchData = async (newId) => {
			if (id) {
				try {
					const requestOptions = {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`
						}
					};
					const response = await fetch(`https://bolsointeligente-api.onrender.com/api/revenues/${id}`, requestOptions);
					if (response.ok) {
						const data = await response.json();
						setRevenueData(data); // Atualiza o estado com os dados da receita obtida
						setName(data.name); // Define o valor do campo de nome com o valor da receita
						setDescription(data.description); // Define o valor do campo de descrição com o valor da receita
					} else {
						setErrorMessage('Não foi possivel carregar a receita');
					}
				} catch (error) {
					console.error('Erro ao buscar receita:', error);
					setErrorMessage('Erro ao buscar receita');
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

	const handleCreateRevenue = async (e) => {
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
			const url = 'https://bolsointeligente-api.onrender.com/api/revenues';
			const response = await fetch(url, requestOptions);
			if (!response.ok) {
				const errorMessage = await response.text();
				throw new Error(errorMessage);
			}
			cleanFormData();
			handleModal();
		} catch (error) {
			console.error('Erro ao criar receita:', error.message);
			setError(`Erro ao criar receita: ${error.message}`);
		}
	};

	const handleUpdateRevenue = async (e) => {
		e?.preventDefault();
		if (!description || !name) {
			setError('Por favor, preencha todos os campos.');
			return;
		}
		let body = { name: name, description: description };
		try {
			const requestOptions = {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token ? `Bearer ${token}` : undefined
				},
				body: JSON.stringify(body)
			};
			const url = `https://bolsointeligente-api.onrender.com/api/revenues/${id}`;
			const response = await fetch(url, requestOptions);
			if (!response.ok) {
				const errorMessage = await response.text();
				throw new Error(errorMessage);
			}
			cleanFormData();
			handleModal();
		} catch (error) {
			console.error('Erro ao atualizar receita:', error.message);
			setError(`Erro ao atualizar receita: ${error.message}`);
		}
	};

	return (
		<div className={`modal ${active && 'is-active'}`}>
			<div className="modal-background" onClick={handleModal}></div>
			<div className="modal-card">
				<header className="modal-card-head has-background-primary-light">
					<h1 className="modal-card-title">{id ? 'Atualizar Receita' : 'Criar Receita'}</h1>
				</header>
				{error && <div className="notification is-danger">{error}</div>}
				<section className="modal-card-body">
					<form>
						<div className="field">
							<label className="label">Nome</label>
							<div className="control">
								<input
									type="text"
									placeholder="Digite o nome"
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
						<button className="button is-info" onClick={handleUpdateRevenue}>
							Atualizar
						</button>
					) : (
						<button
							className="button is-primary"
							onClick={() => {
								cleanFormData();
								handleCreateRevenue();
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

export default RevenueModal;
