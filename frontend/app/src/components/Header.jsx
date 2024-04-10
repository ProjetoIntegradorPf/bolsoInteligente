import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import bolsoInteligente from './bolsoInteligente.png';
import { UserContext } from '../context/UserContext';

const Header = () => {
	const currentPath = window.location.pathname;
	const [token] = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!token && currentPath === '/home') {
			navigate('/');
		}
	}, [token, currentPath, navigate]);

	return (
		<>
			<header className="has-text-whight-bold m-3 is-flex is-justify-content-center is-fixed-top has-background-black">
				<img src={bolsoInteligente} alt="logo" width="300" />
			</header>
			{token && currentPath !== '/' && <Navbar />}
		</>
	);
};

export default Header;
