import React from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.min.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'; // Importe o BrowserRouter
import MainRoutes from './routes'; // Importe suas rotas

import { UserProvider } from './context/UserContext';

ReactDOM.render(
	<Router>
		<UserProvider>
			<MainRoutes />
		</UserProvider>
	</Router>,
	document.getElementById('root')
);
