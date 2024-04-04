import { Routes, Route } from 'react-router-dom';

import App from './App';
import Table from './components/Table';
import BasePage from './components/BasePage';

function MainRoutes() {
	return (
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="/relatorio-geral" element={<BasePage>{<Table />}</BasePage>} />
		</Routes>
	);
}

export default MainRoutes;
