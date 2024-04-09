import React from 'react';
import Navbar from './Navbar';
import bolsoInteligente from './bolsoInteligente.png';

const Header = ({ title }) => {
	const currentPath = location.pathname;

	return (
		<>
			<header className="has-text-whight-bold m-3 is-flex is-justify-content-center is-fixed-top">
				<img src={bolsoInteligente} alt="logo" width="300" />
			</header>
			{currentPath !== '/' && <Navbar />}
		</>
	);
};

export default Header;
