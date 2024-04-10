import React, { useEffect, useState } from 'react';

const TransactionModal = ({ active, handleModal, token, id, setErrorMessage }) => {
	const currentDate = new Date().toISOString().split('T')[0];

	const [description, setDescription] = useState('');
	const [type, setType] = useState('');
	const [categories, setCategories] = useState([]);
	const [value, setValue] = useState('');
	const [date, setDate] = useState(currentDate);
	const [error, setError] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');

	useEffect(() => {
		const getTransaction = async () => {
			if (id) {
				const requestOptions = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + token
					}
				};
				const newType = type === 'INVESTIMENTO' ? 'investment' : type === 'DESPESA' ? 'expense' : 'revenue';
				try {
					const response = await fetch(`/api/transactions/${id}`, requestOptions);
					if (!response.ok) {
						setErrorMessage('Não foi possível carregar a transação');
						return;
					}
					const data = await response.json();
					setDescription(data.description);
					setType(data.type);
					setSelectedCategory(`${data[`category_${newType}_id`]},${data[`category_${newType}_name`]}`);
					setValue(data.value.toFixed(2));
					setDate(data.date);
				} catch (error) {
					setErrorMessage('Não foi possível carregar a transação');
				}
			}
		};

		getTransaction();
	}, [id, token, setErrorMessage]);

	useEffect(() => {
		const listCategoriesByType = async () => {
			let url;
			switch (type) {
				case 'RECEITA':
					url = '/api/revenues';
					break;
				case 'DESPESA':
					url = '/api/expenses';
					break;
				case 'INVESTIMENTO':
					url = '/api/investments';
					break;
				default:
					console.error('Tipo de categoria inválido');
					return;
			}

			const requestOptions = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token ? `Bearer ${token}` : undefined
				}
			};

			try {
				const response = await fetch(url, requestOptions);
				if (response.ok) {
					const data = await response.json();
					setCategories(data);
				} else {
					console.error(`Erro ao listar categorias do tipo ${type}`);
				}
			} catch (error) {
				console.error(`Erro ao listar categorias do tipo ${type}:`, error.message);
			}
		};

		if (type) {
			listCategoriesByType();
		}
	}, [type, token]);

	const cleanFormData = () => {
		setDescription('');
		setType('');
		setSelectedCategory('');
		setValue('');
		setDate('');
		setError('');
	};

	const handleCreateTransaction = async (e) => {
		e.preventDefault();
		if (!description || !type || !selectedCategory || !value || !date) {
			setError('Por favor, preencha todos os campos.');
			return;
		}
		if (!['RECEITA', 'DESPESA', 'INVESTIMENTO'].includes(type)) {
			setError('Por favor, selecione o tipo da transação.');
			return;
		}

		const formattedValue = parseFloat(value.replace(',', '.')) || 0;
		if (formattedValue === 0) {
			setError('Valor não pode ser zero.');
			return;
		}
		const [categoryId, categoryName] = selectedCategory.split(',');
		const newType = type === 'INVESTIMENTO' ? 'investment' : type === 'DESPESA' ? 'expense' : 'revenue';
		const body = {
			description: description,
			type: type,
			[`category_${newType}_id`]: parseInt(categoryId),
			[`category_${newType}_name`]: categoryName,
			value: formattedValue,
			date: date
		};
		console.log(body);
		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(body)
		};
		try {
			console.log(requestOptions);
			const response = await fetch('/api/transactions', requestOptions);
			if (!response.ok) {
				setError('Algo deu errado. Por favor, tente novamente');
			} else {
				cleanFormData();
				handleModal();
			}
		} catch (error) {
			setError('Algo deu errado. Por favor, tente novamente');
		}
	};

	const handleUpdateTransaction = async (e) => {
		e.preventDefault();
		if (!description || !type || !selectedCategory || !value || !date) {
			setError('Por favor, preencha todos os campos.');
			return;
		}
		if (!['RECEITA', 'DESPESA', 'INVESTIMENTO'].includes(type)) {
			setError('Por favor, selecione o tipo da transação.');
			return;
		}
		const formattedValue = parseFloat(value.replace(',', '.')) || 0;
		if (formattedValue === 0) {
			setError('Valor não pode ser zero.');
			return;
		}
		const newType = type === 'INVESTIMENTO' ? 'investment' : type === 'DESPESA' ? 'expense' : 'revenue';
		const [categoryId, categoryName] = selectedCategory.split(',');
		const body = {
			description: description,
			type: type,
			[`category_${newType}_id`]: parseInt(categoryId),
			[`category_${newType}_name`]: categoryName,
			value: formattedValue,
			date: date
		};
		const requestOptions = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(body)
		};
		try {
			const response = await fetch(`/api/transactions/${id}`, requestOptions);
			if (!response.ok) {
				setError('Alguma coisa deu errado durante a atualização.');
			} else {
				cleanFormData();
				handleModal();
			}
		} catch (error) {
			setError('Alguma coisa deu errado durante a atualização.');
		}
	};

	return (
		<div className={`modal ${active && 'is-active'}`}>
			<div className="modal-background" onClick={handleModal}></div>
			<div className="modal-card">
				<header className="modal-card-head has-background-primary-light">
					<h1 className="modal-card-title">{id ? 'Atualizar Transação' : 'Criar Transação'}</h1>
				</header>
				{error && <div className="notification is-danger">{error}</div>}
				<section className="modal-card-body">
					<form>
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
						<div className="field">
							<label className="label">Tipo</label>
							<div className="control">
								<div className="select is-fullwidth">
									<select value={type} onChange={(e) => setType(e.target.value)} required>
										<option value="">Selecione</option>
										<option value="RECEITA">RECEITA</option>
										<option value="DESPESA">DESPESA</option>
										<option value="INVESTIMENTO">INVESTIMENTO</option>
									</select>
								</div>
							</div>
						</div>
						<div className="field">
							<label className="label">Categoria</label>
							<div className="control">
								<div className="select is-fullwidth">
									<select
										value={selectedCategory}
										onChange={(e) => setSelectedCategory(e.target.value)}
										required
									>
										<option value="">Selecione</option>
										{categories.map((category) => (
											<option key={category.id} value={`${category.id},${category.name}`}>
												{category.name}
											</option>
										))}
									</select>
								</div>
							</div>
						</div>
						<div className="field">
							<label className="label">Valor</label>
							<div className="control">
								<input
									type="text"
									placeholder="Digite o Valor"
									value={value}
									onChange={(e) => {
										const regex = /^[0-9,.]*$/;
										if (regex.test(e.target.value) || e.target.value === '') {
											setValue(e.target.value);
										}
									}}
									className="input"
									required
								/>
							</div>
						</div>
						<div className="field">
							<label className="label">Data</label>
							<div className="control">
								<input
									type="date"
									value={date}
									onChange={(e) => setDate(e.target.value)}
									className="input"
									required
								/>
							</div>
						</div>
					</form>
				</section>
				<footer className="modal-card-foot has-background-primary-light">
					{id ? (
						<button className="button is-info" onClick={handleUpdateTransaction}>
							Atualizar
						</button>
					) : (
						<button className="button is-primary" onClick={handleCreateTransaction}>
							Criar
						</button>
					)}
					<button className="button" onClick={handleModal}>
						Cancelar
					</button>
				</footer>
			</div>
		</div>
	);
};

export default TransactionModal;
