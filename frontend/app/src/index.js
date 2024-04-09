import React from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import MainRoutes from './routes';

import { UserProvider } from './context/UserContext';

ReactDOM.render(
	<Router>
		<UserProvider>
			<MainRoutes />
		</UserProvider>
	</Router>,
	document.getElementById('root')
);
