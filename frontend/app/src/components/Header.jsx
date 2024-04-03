import React from 'react';

const Header = ({ title }) => {
	return (
		<header className="has-text-centered m-6 is-flex is-justify-content-center" id="header">
			<h1 className="title">{title}</h1>
		</header>
	);
};

export default Header;
