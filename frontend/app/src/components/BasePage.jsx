import Footer from './Footer';
import Sidebar from './Sidebar';

import React, { useContext, useEffect, useState } from 'react';

import { UserContext } from '../context/UserContext';

const BasePage = ({ children }) => {
	const [message, setMessage] = useState('');
	const [token] = useContext(UserContext);

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
			console.log('Algo deu errado');
		} else {
			setMessage(data.message);
		}
	};

	useEffect(() => {
		getWelcomeMessage();
	}, []);

	return (
		<div className="columns">
			<div className="column is-one-quarter">
				<Sidebar />
			</div>
			<main className="column is-two-quarters">{children}</main>
			<Footer />
		</div>
	);
};

export default BasePage;
