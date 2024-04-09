import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import Register from './components/Register';
import Login from './components/Login';
import Header from './components/Header';
import BasePage from './components/BasePage';
import CardMenu from './components/CardMenu';

const App = () => {
	const [token] = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (token && window.location.pathname === '/') {
			navigate('/home');
		}
		if (!token && window.location.pathname.includes('/')) {
			navigate('/');
		}
	}, [token, navigate]);

	return (
		<>
			{!token ? (
				<div>
					<Header />
					<div className="columns">
						<div className="column"></div>
						<div className="column m-5 is-two-thirds">
							<div className="columns">
								<Register /> <Login />
							</div>
						</div>
						<div className="column"></div>
					</div>
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
