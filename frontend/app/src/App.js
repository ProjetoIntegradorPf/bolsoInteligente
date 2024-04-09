import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importe o hook useNavigate

import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header';

import { UserContext } from './context/UserContext';
import BasePage from './components/BasePage';
import CardMenu from './components/CardMenu';

const App = () => {
	const [message, setMessage] = useState('');
	const [token] = useContext(UserContext);
	const navigate = useNavigate();

	const getWelcomeMessage = async () => {
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		};
		const response = await fetch('/api', requestOptions);
		const data = await response.json();

		if (!response.ok) {
			console.log('something messed up');
		} else {
			setMessage(data.message);
		}
	};

	useEffect(() => {
		getWelcomeMessage();
	}, []);

	useEffect(() => {
		if (token && window.location.pathname === '/') {
			navigate('/home');
		}
	}, [token, navigate]);

	return (
		<>
			{!token && <Header title={message} />}
			{!token ? (
				<div className="columns">
					<div className="column"></div>
					<div className="column m-5 is-two-thirds">
						<div className="columns">
							<Register /> <Login />
						</div>
					</div>
					<div className="column"></div>
				</div>
			) : (
				<BasePage>
					<CardMenu />
				</BasePage>
			)}
		</>
	);
};

export default App;
