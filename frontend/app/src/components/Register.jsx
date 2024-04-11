import React, { useContext, useState } from 'react';

import { UserContext } from '../context/UserContext';
import ErrorMessage from './ErrorMessage';

const Register = () => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [dateOfBirth, setDateOfBirth] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmationPassword, setConfirmationPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [, setToken] = useContext(UserContext);

	const submitRegistration = async () => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				first_name: firstName,
				last_name: lastName,
				date_of_birth: dateOfBirth,
				email: email,
				hashed_password: password
			})
		};
		const response = await fetch('https://bolsointeligente-api.onrender.com/api/users', requestOptions);
		const data = await response.json();

		if (!response.ok) {
			setErrorMessage(data.detail);
		} else {
			setToken(data.access_token);
		}
	};

	const handleSubmit = async (e) => {
		setErrorMessage('');
		e?.preventDefault();
		if (password === confirmationPassword && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password)) {
			await submitRegistration();
			return;
		}
		setErrorMessage(
			password !== confirmationPassword
				? 'Senhas não coincidem'
				: 'Certifique-se de que a senha tenha pelo menos 8 caracteres, contenha pelo menos uma letra minúscula, uma letra maiúscula e um número'
		);
		setPassword('');
		setConfirmationPassword('');
	};

	return (
		<div className="column">
			<form className="box" onSubmit={handleSubmit}>
				<h1 className="title has-text-centered">Registro de Usuário</h1>
				<div className="field">
					<label className="label">Nome</label>
					<div className="control">
						<input
							type="text"
							placeholder="Digite seu nome aqui..."
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							className="input"
							required
						/>
					</div>
				</div>
				<div className="field">
					<label className="label">Sobrenome</label>
					<div className="control">
						<input
							type="text"
							placeholder="Digite seu sobrenome completo aqui..."
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							className="input"
							required
						/>
					</div>
				</div>
				<div className="field">
					<label className="label">Data de Nascimento</label>
					<div className="control">
						<input
							type="date"
							placeholder="Digite seu sobrenome completo aqui..."
							value={dateOfBirth}
							onChange={(e) => setDateOfBirth(e.target.value)}
							className="input"
							required
						/>
					</div>
				</div>
				<div className="field">
					<label className="label">E-mail</label>
					<div className="control">
						<input
							type="email"
							placeholder="Digite seu e-mail aqui..."
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="input"
							required
						/>
					</div>
				</div>
				<div className="field">
					<label className="label">Senha</label>
					<div className="control">
						<input
							type="password"
							placeholder="Digite sua senha aqui..."
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="input"
							required
						/>
					</div>
				</div>
				<div className="field">
					<label className="label">Confirmação de senha</label>
					<div className="control">
						<input
							type="password"
							placeholder="Confirme a sua senha aqui..."
							value={confirmationPassword}
							onChange={(e) => setConfirmationPassword(e.target.value)}
							className="input"
							required
						/>
					</div>
				</div>
				<ErrorMessage message={errorMessage} />
				<br />
				<button className="button is-primary" type="submit">
					Registrar
				</button>
			</form>
		</div>
	);
};

export default Register;
