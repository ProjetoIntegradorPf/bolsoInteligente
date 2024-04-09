import Footer from './Footer';
import Header from './Header';

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
		<div>
			{}
			<Header title={message} />
			<main className="column">{children}</main>
			<Footer />
		</div>
	);
};

export default BasePage;
